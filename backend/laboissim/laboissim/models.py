from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import PermissionDenied
from django.utils import timezone

class SiteContent(models.Model):
    # Contact/footer (existing)
    contact_address = models.CharField(max_length=255, blank=True, default='')
    contact_phone = models.CharField(max_length=50, blank=True, default='')
    contact_email = models.EmailField(max_length=254, blank=True, default='')
    contact_hours = models.CharField(max_length=100, blank=True, default='')
    footer_research_domains = models.JSONField(blank=True, default=list)
    footer_team_introduction = models.TextField(blank=True, default='')
    footer_team_name = models.CharField(max_length=255, blank=True, default='')
    footer_copyright = models.CharField(max_length=255, blank=True, default='')

    # Branding / Lab information
    lab_name = models.CharField(max_length=255, blank=True, default='')
    logo_image = models.ImageField(upload_to='site_logo/', blank=True, null=True)
    logo_text = models.CharField(max_length=255, blank=True, default='')
    logo_subtitle = models.CharField(max_length=255, blank=True, default='')

    # Navigation
    nav_home = models.CharField(max_length=50, blank=True, default='Accueil')
    nav_about = models.CharField(max_length=50, blank=True, default='À propos')
    nav_projects = models.CharField(max_length=50, blank=True, default='Projets')
    nav_publications = models.CharField(max_length=50, blank=True, default='Publications')
    nav_events = models.CharField(max_length=50, blank=True, default='Événements')
    nav_contact = models.CharField(max_length=50, blank=True, default='Contact')
    nav_login = models.CharField(max_length=50, blank=True, default='Connexion')
    nav_register = models.CharField(max_length=50, blank=True, default='S\'inscrire')
    nav_dashboard = models.CharField(max_length=50, blank=True, default='Tableau de bord')
    nav_profile = models.CharField(max_length=50, blank=True, default='Profil')
    nav_logout = models.CharField(max_length=50, blank=True, default='Déconnexion')

    # Hero section
    hero_title = models.CharField(max_length=255, blank=True, default='')
    hero_subtitle = models.CharField(max_length=255, blank=True, default='')
    hero_description = models.TextField(blank=True, default='')
    hero_primary_button = models.CharField(max_length=100, blank=True, default='Découvrir nos projets')
    hero_secondary_button = models.CharField(max_length=100, blank=True, default='Rejoindre l\'équipe')

    # Stats section
    stats_researchers = models.IntegerField(blank=True, null=True)
    stats_publications = models.IntegerField(blank=True, null=True)
    stats_awards = models.IntegerField(blank=True, null=True)
    stats_events = models.IntegerField(blank=True, null=True)
    stats_researchers_label = models.CharField(max_length=50, blank=True, default='Chercheurs')
    stats_publications_label = models.CharField(max_length=50, blank=True, default='Publications')
    stats_awards_label = models.CharField(max_length=50, blank=True, default='Prix reçus')
    stats_events_label = models.CharField(max_length=50, blank=True, default='Événements')

    # About section
    about_team_name = models.CharField(max_length=255, blank=True, default='')
    about_description = models.TextField(blank=True, default='')
    about_mission = models.TextField(blank=True, default='')
    about_title = models.CharField(max_length=255, blank=True, default='À propos de nous')
    about_subtitle = models.CharField(max_length=255, blank=True, default='Notre équipe de recherche')

    # Projects section
    projects_title = models.CharField(max_length=255, blank=True, default='Nos Projets')
    projects_subtitle = models.CharField(max_length=255, blank=True, default='Découvrez nos recherches en cours')
    projects_view_all = models.CharField(max_length=50, blank=True, default='Voir tous les projets')

    # Publications section
    publications_title = models.CharField(max_length=255, blank=True, default='Publications')
    publications_subtitle = models.CharField(max_length=255, blank=True, default='Nos dernières publications scientifiques')
    publications_view_all = models.CharField(max_length=50, blank=True, default='Voir toutes les publications')

    # Events section
    events_title = models.CharField(max_length=255, blank=True, default='Événements')
    events_subtitle = models.CharField(max_length=255, blank=True, default='Rejoignez-nous lors de nos événements')
    events_view_all = models.CharField(max_length=50, blank=True, default='Voir tous les événements')

    # Contact section
    contact_title = models.CharField(max_length=255, blank=True, default='Contactez-nous')
    contact_subtitle = models.CharField(max_length=255, blank=True, default='Nous sommes là pour vous aider')
    contact_form_name = models.CharField(max_length=50, blank=True, default='Nom')
    contact_form_email = models.CharField(max_length=50, blank=True, default='Email')
    contact_form_subject = models.CharField(max_length=50, blank=True, default='Sujet')
    contact_form_message = models.CharField(max_length=50, blank=True, default='Message')
    contact_form_send = models.CharField(max_length=50, blank=True, default='Envoyer le message')

    # Footer
    footer_about_title = models.CharField(max_length=100, blank=True, default='À propos')
    footer_quick_links_title = models.CharField(max_length=100, blank=True, default='Liens rapides')
    footer_contact_title = models.CharField(max_length=100, blank=True, default='Contact')
    footer_follow_us = models.CharField(max_length=100, blank=True, default='Suivez-nous')

    # Page titles
    page_title_home = models.CharField(max_length=255, blank=True, default='Accueil')
    page_title_about = models.CharField(max_length=255, blank=True, default='À propos')
    page_title_projects = models.CharField(max_length=255, blank=True, default='Projets')
    page_title_publications = models.CharField(max_length=255, blank=True, default='Publications')
    page_title_events = models.CharField(max_length=255, blank=True, default='Événements')
    page_title_contact = models.CharField(max_length=255, blank=True, default='Contact')
    page_title_login = models.CharField(max_length=255, blank=True, default='Connexion')
    page_title_register = models.CharField(max_length=255, blank=True, default='Inscription')
    page_title_dashboard = models.CharField(max_length=255, blank=True, default='Tableau de bord')
    page_title_profile = models.CharField(max_length=255, blank=True, default='Profil')
    page_title_admin = models.CharField(max_length=255, blank=True, default='Administration')

    # Meta information
    site_title = models.CharField(max_length=255, blank=True, default='Laboratoire de Recherche')
    site_description = models.TextField(blank=True, default='')
    site_keywords = models.CharField(max_length=500, blank=True, default='')

    def __str__(self):
        return "Site Content Settings"

class exterieurs(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    cv = models.FileField(upload_to='external_cvs/', blank=True, null=True)
    profile_pic = models.ImageField(upload_to='external_profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('admin', 'Admin'),
        ('chef_d_equipe', 'Chef d\'équipe'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    institution = models.CharField(max_length=200, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_team_lead = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')

    def __str__(self):
        return f"{self.user.username}'s profile"

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_chef_d_equipe(self):
        return self.role == 'chef_d_equipe'

# Signal to create UserProfile when User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()

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
    # New fields for tagging and file uploads
    tagged_members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tagged_publications', blank=True)
    tagged_externals = models.ManyToManyField('exterieurs', related_name='tagged_publications', blank=True)
    attached_files = models.ManyToManyField('UserFile', related_name='publications', blank=True)
    keywords = models.JSONField(default=list, blank=True)
    
    class Meta:
        ordering = ['-posted_at']
    
    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
    ]
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"

class AccountRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.email}"

class InternalMessage(models.Model):
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
    ]
    
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    created_at = models.DateTimeField(auto_now_add=True)
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}: {self.subject}"
    
    @property
    def conversation_id(self):
        """Generate a unique conversation ID for the two users"""
        user_ids = sorted([self.sender.id, self.receiver.id])
        return f"conv_{user_ids[0]}_{user_ids[1]}"

class Event(models.Model):
    EVENT_TYPES = [
        ('conference', 'Conférence'),
        ('seminar', 'Séminaire'),
        ('workshop', 'Atelier'),
        ('meeting', 'Réunion'),
        ('presentation', 'Présentation'),
        ('other', 'Autre'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')
    location = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title
    
    @property
    def registered_count(self):
        return self.registrations.filter(status='confirmed').count()
    
    @property
    def is_full(self):
        if self.max_participants is None:
            return False
        return self.registered_count >= self.max_participants

class EventRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    registration_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-registration_date']
        unique_together = ['event', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

class Project(models.Model):
    STATUS_CHOICES = (
        ('planning', 'En Planification'),
        ('active', 'Actif'),
        ('on_hold', 'En Pause'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Élevée'),
        ('urgent', 'Urgente'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='project_images/', null=True, blank=True)
    files = models.ManyToManyField('ProjectDocument', related_name='projects', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    team_members = models.ManyToManyField(User, related_name='projects', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class ProjectDocument(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='project_documents/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=50, blank=True)
    size = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.name} - {self.project.title}"