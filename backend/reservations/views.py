import stripe
# pyrefly: ignore [missing-import]
import razorpay
import hmac
import hashlib
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Reservation, Order, OrderItem
from .serializers import ReservationSerializer, OrderSerializer
from menu.models import MenuItem

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

stripe.api_key = settings.STRIPE_SECRET_KEY

# --------------- Existing Viewsets ---------------

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --------------- Razorpay Views ---------------

@method_decorator(csrf_exempt, name='dispatch')
class CreateRazorpayOrderView(APIView):
    """
    Creates a Razorpay order and returns order details + key_id.
    The frontend uses this to open the Razorpay checkout popup.
    Supports: PhonePe, Google Pay, Paytm, UPI, Cards, Net Banking.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart_items = request.data.get('items', [])
            full_name = request.data.get('full_name')
            email = request.data.get('email')
            phone = request.data.get('phone')

            if not all([full_name, email, phone]):
                return Response(
                    {'error': 'full_name, email, and phone are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not cart_items:
                return Response(
                    {'error': 'Cart is empty. Please select menu items.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Build order in DB
            order = Order.objects.create(
                user=request.user,
                full_name=full_name,
                email=email,
                phone=phone,
                total_price=0
            )

            total_price = 0
            for item in cart_items:
                raw_id = item.get('menu_item_id') or item.get('id')
                menu_item_id = int(str(raw_id).split('-')[0])
                menu_item = MenuItem.objects.get(id=menu_item_id)
                quantity = int(item['quantity'])
                portion = item.get('portion', 'Full')

                if portion == 'Half' and menu_item.price_half:
                    price = menu_item.price_half
                else:
                    price = menu_item.price

                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    portion=portion,
                    quantity=quantity,
                    price=price
                )
                total_price += price * quantity

            if total_price <= 0:
                order.delete()
                return Response(
                    {'error': 'Total price must be greater than zero.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order.total_price = total_price
            order.save()

            # Amount in paise (1 INR = 100 paise)
            amount_in_paise = int(total_price * 100)

            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
            razorpay_order = client.order.create({
                'amount': amount_in_paise,
                'currency': 'INR',
                'receipt': f'order_{order.id}',
                'notes': {
                    'order_id': str(order.id),
                    'customer_name': full_name,
                    'customer_email': email,
                }
            })

            # Save Razorpay order ID on our order
            order.stripe_payment_intent_id = razorpay_order['id']  # reusing field
            order.save()

            return Response({
                'razorpay_order_id': razorpay_order['id'],
                'amount': amount_in_paise,
                'currency': 'INR',
                'key_id': settings.RAZORPAY_KEY_ID,
                'order_id': order.id,
                'customer': {
                    'name': full_name,
                    'email': email,
                    'contact': phone,
                }
            })

        except MenuItem.DoesNotExist as e:
            return Response({'error': f'Menu item not found: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class VerifyRazorpayPaymentView(APIView):
    """
    Verifies the HMAC-SHA256 signature from Razorpay after payment.
    Marks the Order as 'paid' if verification passes.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_signature = request.data.get('razorpay_signature')
            order_id = request.data.get('order_id')

            # Verify signature
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                f'{razorpay_order_id}|{razorpay_payment_id}'.encode(),
                hashlib.sha256
            ).hexdigest()

            if generated_signature != razorpay_signature:
                return Response(
                    {'error': 'Payment verification failed. Invalid signature.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Mark order as paid
            order = Order.objects.get(id=order_id, user=request.user)
            order.status = 'paid'
            order.stripe_payment_intent_id = razorpay_payment_id
            order.save()

            return Response({'message': 'Payment verified successfully.', 'order_id': order.id})

        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# --------------- Legacy Stripe Views ---------------

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart_items = request.data.get('items', [])
            full_name = request.data.get('full_name')
            email = request.data.get('email')
            phone = request.data.get('phone')

            if not all([full_name, email, phone]):
                return Response(
                    {'error': 'full_name, email, and phone are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not cart_items:
                return Response(
                    {'error': 'Cart is empty. Please select menu items.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order = Order.objects.create(
                user=request.user,
                full_name=full_name,
                email=email,
                phone=phone,
                total_price=0
            )

            line_items = []
            total_price = 0
            for item in cart_items:
                raw_id = item.get('menu_item_id') or item.get('id')
                menu_item_id = int(str(raw_id).split('-')[0])
                menu_item = MenuItem.objects.get(id=menu_item_id)
                quantity = int(item['quantity'])
                portion = item.get('portion', 'Full')

                if portion == 'Half' and menu_item.price_half:
                    price = menu_item.price_half
                else:
                    price = menu_item.price

                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    portion=portion,
                    quantity=quantity,
                    price=price
                )
                total_price += price * quantity
                line_items.append({
                    'price_data': {
                        'currency': 'inr',
                        'product_data': {'name': f"{menu_item.name} ({portion})"},
                        'unit_amount': int(price * 100),
                    },
                    'quantity': quantity,
                })

            if total_price <= 0:
                order.delete()
                return Response(
                    {'error': 'Total price must be greater than zero.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order.total_price = total_price
            order.save()

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=settings.FRONTEND_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.FRONTEND_URL + '/cancel',
                metadata={'order_id': order.id}
            )
            return Response({'id': checkout_session.id})
        except MenuItem.DoesNotExist as e:
            return Response({'error': f'Menu item not found: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StripeWebhookView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            order_id = session.get('metadata', {}).get('order_id')
            if order_id:
                try:
                    order = Order.objects.get(id=order_id)
                    order.status = 'paid'
                    order.stripe_payment_intent_id = session.get('payment_intent')
                    order.save()
                except Order.DoesNotExist:
                    pass
        return Response(status=status.HTTP_200_OK)
