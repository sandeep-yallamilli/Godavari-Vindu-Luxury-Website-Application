import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from menu.models import SiteAsset, GalleryImage

class Command(BaseCommand):
    help = 'Populates SiteAsset and GalleryImage with default frontend public images'

    def handle(self, *args, **options):
        # Paths
        frontend_images_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'images'))
        
        if not os.path.exists(frontend_images_dir):
            self.stdout.write(self.style.ERROR(f"Frontend images directory not found at: {frontend_images_dir}"))
            return

        self.stdout.write(self.style.SUCCESS(f"Found frontend images directory at: {frontend_images_dir}"))

        # 1. Populate Site Assets
        site_assets_data = [
            {'key': 'hero_bg', 'filename': 'Background design-1.png', 'title': 'Hero Background'},
            {'key': 'about_story', 'filename': 'Godavari vindu story.png', 'title': 'About Story Image'},
            {'key': 'chef_photo', 'filename': 'chef.png', 'title': 'Chef Photo'},
            {'key': 'chef_signature', 'filename': 'Chef_Antonio.png', 'title': 'Chef Signature'},
            {'key': 'reservation_bg', 'filename': 'hero_bg.png', 'title': 'Reservation Background'},
        ]

        for asset in site_assets_data:
            src_path = os.path.join(frontend_images_dir, asset['filename'])
            if not os.path.exists(src_path):
                self.stdout.write(self.style.WARNING(f"File {asset['filename']} not found in frontend public folder!"))
                continue

            obj, created = SiteAsset.objects.get_or_create(key=asset['key'])
            obj.title = asset['title']
            
            with open(src_path, 'rb') as f:
                obj.image.save(asset['filename'], File(f), save=True)
            
            status = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{status} site asset: {asset['key']}"))

        # 2. Populate Gallery Images
        gallery_data = [
            {'filename': 'gallery_1.png', 'alt': 'Interior 1', 'span': 'col-span-2 row-span-2', 'order': 1},
            {'filename': 'dish_1.png', 'alt': 'Signature Dish', 'span': 'col-span-1 row-span-1', 'order': 2},
            {'filename': 'hero_bg.png', 'alt': 'Luxury Ambiance', 'span': 'col-span-1 row-span-2', 'order': 3},
            {'filename': 'exterior design.png', 'alt': 'Exterior View', 'span': 'col-span-1 row-span-1', 'order': 4},
            {'filename': 'interior design.png', 'alt': 'Interior View', 'span': 'col-span-1 row-span-1', 'order': 5},
            {'filename': 'godavari story.png', 'alt': 'Story View', 'span': 'col-span-1 row-span-2', 'order': 6},
            {'filename': 'menu card.png', 'alt': 'Menu View', 'span': 'col-span-1 row-span-2', 'order': 7},
            {'filename': 'Dinning design.png', 'alt': 'Dinning View', 'span': 'col-span-1 row-span-1', 'order': 8},
            {'filename': 'beautiful paint.png', 'alt': 'Paint View', 'span': 'col-span-1 row-span-1', 'order': 9},
            {'filename': 'background design.png', 'alt': 'Background View', 'span': 'col-span-1 row-span-1', 'order': 10},
        ]

        # Clean existing gallery first to avoid duplicate seeding
        GalleryImage.objects.all().delete()
        self.stdout.write(self.style.WARNING("Cleared existing gallery images for seeding"))

        for img in gallery_data:
            src_path = os.path.join(frontend_images_dir, img['filename'])
            if not os.path.exists(src_path):
                self.stdout.write(self.style.WARNING(f"File {img['filename']} not found in frontend public folder!"))
                continue

            obj = GalleryImage(
                alt=img['alt'],
                span=img['span'],
                order=img['order'],
                is_active=True
            )
            
            with open(src_path, 'rb') as f:
                obj.image.save(img['filename'], File(f), save=True)
            
            self.stdout.write(self.style.SUCCESS(f"Seeded gallery image: {img['filename']}"))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
