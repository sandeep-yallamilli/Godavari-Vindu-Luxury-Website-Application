"""godavari_vindu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

from django.http import JsonResponse

def home_api_root(request):
    return JsonResponse({
        "status": "online",
        "message": "Welcome to Godavari Vindu Luxury Restaurant API",
        "admin_url": "/admin/",
        "endpoints": {
            "categories": "/api/menu/categories/",
            "menu_items": "/api/menu/items/",
            "site_assets": "/api/menu/site-assets/",
            "auth_register": "/api/auth/register/",
            "auth_login": "/api/auth/login/",
            "reservations": "/api/reservations/submit/",
            "reviews": "/api/reviews/testimonials/"
        }
    })

urlpatterns = [
    path('', home_api_root),
    path('api/', home_api_root),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/reservations/', include('reservations.urls')),
    path('api/menu/', include('menu.urls')),
    path('api/reviews/', include('reviews.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

