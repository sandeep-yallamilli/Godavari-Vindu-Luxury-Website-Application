from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Testimonial
from .serializers import TestimonialSerializer

class TestimonialListCreateView(generics.ListCreateAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

