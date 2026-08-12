from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='auth-register'),
    path('login/', views.login_view, name='auth-login'),
    path('token/refresh/', views.token_refresh_view, name='auth-token-refresh'),
    path('google/', views.google_auth_view, name='auth-google'),
    path('profile/', views.profile_view, name='auth-profile'),
]
