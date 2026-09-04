import os
import django

# Django settings load panrom
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
email = "michaelkeerthi77@gmail.com"
password = "lucifer"

user = User.objects.filter(username=email).first()

if user:
    user.is_active = True
    user.set_password(password)
    user.save()
    print("SUCCESS: User updated and activated!")
else:
    User.objects.create_user(
        username=email,
        email=email,
        password=password,
        is_active=True
    )
    print("SUCCESS: New user created and activated!")