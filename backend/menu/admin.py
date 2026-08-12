from django.contrib import admin
from django.utils.html import format_html
from .models import Category, MenuItem, SiteAsset, GalleryImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['image_tag', 'name', 'category', 'price', 'price_half', 'has_half_option', 'serves', 'serves_half', 'is_available']
    list_editable = ['price', 'price_half', 'has_half_option', 'serves', 'serves_half', 'is_available']
    list_filter = ['category', 'has_half_option', 'is_available']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

    def image_tag(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="width: 50px; height:50px; border-radius: 5px; object-fit: cover;" />', obj.image.url)
            except ValueError:
                pass
        return "-"
    image_tag.short_description = 'Image'

@admin.register(SiteAsset)
class SiteAssetAdmin(admin.ModelAdmin):
    list_display = ['image_tag', 'key', 'title', 'updated_at']
    readonly_fields = ['image_preview']
    search_fields = ['key', 'title']

    def image_tag(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="width: 60px; height:40px; border-radius: 4px; object-fit: cover;" />', obj.image.url)
            except ValueError:
                pass
        return "-"
    image_tag.short_description = 'Image'

    def image_preview(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="max-width: 300px; max-height: 200px; border-radius: 6px; object-fit: contain;" />', obj.image.url)
            except ValueError:
                pass
        return "No image uploaded yet"
    image_preview.short_description = 'Current Preview'

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['image_tag', 'alt', 'span', 'order', 'is_active']
    list_filter = ['is_active', 'span']
    list_editable = ['order', 'span', 'is_active']
    readonly_fields = ['image_preview']
    search_fields = ['alt']

    def image_tag(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="width: 50px; height:50px; border-radius: 5px; object-fit: cover;" />', obj.image.url)
            except ValueError:
                pass
        return "-"
    image_tag.short_description = 'Image'

    def image_preview(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="max-width: 300px; max-height: 200px; border-radius: 6px; object-fit: contain;" />', obj.image.url)
            except ValueError:
                pass
        return "No image uploaded yet"
    image_preview.short_description = 'Current Preview'

