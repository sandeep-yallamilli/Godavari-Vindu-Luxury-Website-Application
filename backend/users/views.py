import requests as http_requests

from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer, get_tokens_for_user

User = get_user_model()

GOOGLE_TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo'
GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(get_tokens_for_user(user), status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Login (email + password)
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')

    if not email or not password:
        return Response(
            {'detail': 'Email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # AbstractUser with USERNAME_FIELD='email' — authenticate with email
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response(
            {'detail': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return Response(get_tokens_for_user(user), status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Token refresh (thin wrapper — frontend can also call /api/auth/token/refresh/)
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def token_refresh_view(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response(
            {'detail': 'Refresh token required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        refresh = RefreshToken(refresh_token)
        return Response({'access': str(refresh.access_token)}, status=status.HTTP_200_OK)
    except Exception:
        return Response(
            {'detail': 'Invalid or expired refresh token.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ---------------------------------------------------------------------------
# Google OAuth — verify the ID token the frontend sends
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_view(request):
    """
    Accepts the Google ID token (credential) from @react-oauth/google.
    Verifies it against Google's tokeninfo endpoint, then either logs
    in or creates a user account.
    """
    id_token = request.data.get('credential') or request.data.get('id_token')
    if not id_token:
        return Response(
            {'detail': 'Google credential/id_token is required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Verify token with Google
    try:
        resp = http_requests.get(
            GOOGLE_TOKEN_INFO_URL,
            params={'id_token': id_token},
            timeout=10,
        )
        if resp.status_code != 200:
            return Response(
                {'detail': 'Invalid Google token.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        google_data = resp.json()
    except Exception:
        return Response(
            {'detail': 'Could not verify Google token.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # Validate audience matches our client ID (optional but recommended)
    client_id = settings.GOOGLE_OAUTH2_CLIENT_ID
    if client_id and google_data.get('aud') != client_id:
        return Response(
            {'detail': 'Token audience mismatch.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    google_id = google_data.get('sub')
    email = google_data.get('email', '')
    name = google_data.get('name', '')
    avatar = google_data.get('picture', '')

    if not email:
        return Response(
            {'detail': 'Google account has no email.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Get-or-create the user
    user = User.objects.filter(google_id=google_id).first()
    if user is None:
        user = User.objects.filter(email=email).first()
        if user is None:
            # Brand-new user — create account
            username = email.split('@')[0]
            # Ensure username uniqueness
            base = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f'{base}{counter}'
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                password=None,  # No password for Google-only accounts
            )

        # Link Google ID + avatar
        user.google_id = google_id
        if avatar:
            user.avatar = avatar
        if not user.get_full_name() and name:
            parts = name.split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ''
        user.save()

    return Response(get_tokens_for_user(user), status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Get current user profile
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
