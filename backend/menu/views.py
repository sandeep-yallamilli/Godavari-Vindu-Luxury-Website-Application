from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import MenuItem, Category, SiteAsset, GalleryImage
from .serializers import MenuItemSerializer, CategorySerializer, SiteAssetSerializer, GalleryImageSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

class SiteAssetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteAsset.objects.all()
    serializer_class = SiteAssetSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = {}
        for asset in queryset:
            if asset.image:
                data[asset.key] = request.build_absolute_uri(asset.image.url)
        return Response(data)

class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.filter(is_active=True)
    serializer_class = GalleryImageSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


