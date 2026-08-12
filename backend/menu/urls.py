from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, CategoryViewSet, SiteAssetViewSet, GalleryImageViewSet

router = DefaultRouter()
router.register(r'items', MenuItemViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'site-assets', SiteAssetViewSet)
router.register(r'gallery', GalleryImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
