from django.contrib import admin
from .models import SiteContent, UserFile, Publication

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ['contact_email', 'footer_team_name']
    fieldsets = (
        ('Contact Information', {
            'fields': ('contact_address', 'contact_phone', 'contact_email', 'contact_hours')
        }),
        ('Footer Information', {
            'fields': ('footer_research_domains', 'footer_team_introduction', 'footer_team_name', 'footer_copyright')
        }),
    )

@admin.register(UserFile)
class UserFileAdmin(admin.ModelAdmin):
    list_display = ['name', 'uploaded_by', 'uploaded_at', 'file_type', 'size']
    list_filter = ['uploaded_at', 'file_type']
    search_fields = ['name', 'uploaded_by__username']
    readonly_fields = ['uploaded_at']

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'posted_by', 'posted_at']
    list_filter = ['posted_at']
    search_fields = ['title', 'abstract', 'posted_by__username']
    readonly_fields = ['posted_at']
