from django.db import models

class Persona(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    data = models.JSONField(blank=True, null=True)  # Stores analyzed writing sample data

    def __str__(self):
        return self.name

class BlogPost(models.Model):
    id = models.BigAutoField(primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, related_name='blog_posts')
    title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"BlogPost {self.id}"
