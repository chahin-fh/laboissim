from django.db import models

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