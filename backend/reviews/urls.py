from django.urls import path
from .views import TestimonialListCreateView

urlpatterns = [
    path('testimonials/', TestimonialListCreateView.as_view(), name='testimonial-list'),
]
