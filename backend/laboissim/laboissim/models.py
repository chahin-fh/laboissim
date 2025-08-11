from django.db import models
from django.conf import settings

class SiteContent(models.Model):
    contact_address = models.CharField(max_length=255, blank=True, default='')
    contact_phone = models.CharField(max_length=50, blank=True, default='')
    contact_email = models.EmailField(max_length=254, blank=True, default='')
    contact_hours = models.CharField(max_length=100, blank=True, default='')
    footer_research_domains = models.JSONField(blank=True, default=list)
    footer_team_introduction = models.TextField(blank=True, default='')
    footer_team_name = models.CharField(max_length=255, blank=True, default='')
    footer_copyright = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return "Site Content Settings"

class UserFile(models.Model):
    file = models.FileField(upload_to='user_files/')
    name = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=50)
    size = models.BigIntegerField()

    def __str__(self):
        return self.name

class Publication(models.Model):
    title = models.CharField(max_length=500)
    abstract = models.TextField()
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    posted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-posted_at']
    
    def __str__(self):
        return self.title