from django.contrib.auth import get_user_model

User = get_user_model()

def save_profile(backend, user, response, *args, **kwargs):
    if backend.name == 'google-oauth2':
        user.first_name = response.get('given_name', '')
        user.last_name = response.get('family_name', '')
        user.save()
    return 

def prevent_duplicate_email(strategy, details, backend, uid, user=None, *args, **kwargs):
    email = details.get('email')
    if email:
        User = get_user_model()
        try:
            existing_user = User.objects.get(email=email)
            return {'user': existing_user}
        except User.DoesNotExist:
            pass
    return {} 