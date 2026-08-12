from django.db import models

class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True)
    text = models.TextField()
    rating = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.name} - {self.rating} stars"
