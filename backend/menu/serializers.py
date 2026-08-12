from rest_framework import serializers
from .models import MenuItem, Category, SiteAsset, GalleryImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'slug', 'description', 'price', 'price_half', 'has_half_option', 'serves', 'serves_half', 'image', 'is_available', 'category', 'category_name']

class SiteAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteAsset
        fields = ['key', 'image', 'title', 'updated_at']

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'alt', 'span', 'order', 'is_active']

