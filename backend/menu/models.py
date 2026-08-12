from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class MenuItem(models.Model):
    category = models.ForeignKey(Category, related_name='items', on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price for Full portion")
    price_half = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Price for Half portion")
    has_half_option = models.BooleanField(default=True, help_text="Whether Half portion option is available")
    serves = models.CharField(max_length=50, default='Serves 1', blank=True, help_text="Serving size for Full portion, e.g. Serves 3-4, Serves 1")
    serves_half = models.CharField(max_length=50, default='Serves 1-2', blank=True, null=True, help_text="Serving size for Half portion, e.g. Serves 1-2")
    image = models.ImageField(upload_to='menu_images/', null=True, blank=True)
    is_available = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class SiteAsset(models.Model):
    ASSET_KEYS = [
        ('hero_bg', 'Hero Background'),
        ('logo', 'Site Logo'),
        ('about_story', 'About Story Image'),
        ('chef_photo', 'Chef Photo'),
        ('chef_signature', 'Chef Signature'),
        ('reservation_bg', 'Reservation Background'),
    ]
    key = models.CharField(max_length=50, choices=ASSET_KEYS, unique=True)
    image = models.ImageField(upload_to='site_assets/')
    title = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_key_display()} ({self.key})"


class GalleryImage(models.Model):
    SPAN_CHOICES = [
        ('col-span-1 row-span-1', 'Standard (1x1)'),
        ('col-span-2 row-span-2', 'Large Square (2x2)'),
        ('col-span-1 row-span-2', 'Vertical Rectangle (1x2)'),
        ('col-span-2 row-span-1', 'Horizontal Rectangle (2x1)'),
    ]
    image = models.ImageField(upload_to='gallery/')
    alt = models.CharField(max_length=255, default='Gallery Image')
    span = models.CharField(max_length=50, choices=SPAN_CHOICES, default='col-span-1 row-span-1')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Gallery Image {self.id} - {self.alt[:25]}"

