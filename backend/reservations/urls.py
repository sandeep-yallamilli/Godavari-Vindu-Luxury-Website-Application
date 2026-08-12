from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReservationViewSet, 
    OrderViewSet, 
    CreateCheckoutSessionView, 
    StripeWebhookView,
    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView
)

router = DefaultRouter()
router.register(r'booking-list', ReservationViewSet) # Internal list
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('submit/', ReservationViewSet.as_view({'post': 'create'}), name='reservation-submit'),
    path('', include(router.urls)),
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('create-razorpay-order/', CreateRazorpayOrderView.as_view(), name='create-razorpay-order'),
    path('verify-razorpay-payment/', VerifyRazorpayPaymentView.as_view(), name='verify-razorpay-payment'),
]
