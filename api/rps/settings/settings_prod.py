import os
from .settings import *


ALLOWED_HOSTS = [os.environ["RPS_HOSTNAME"]]
DEBUG = False
SECRET_KEY = os.environ["RPS_SECRET_KEY"]
STATIC_URL = "/static/"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ["RPS_EMAIL_USERNAME"]
EMAIL_HOST_PASSWORD = os.environ["RPS_EMAIL_PASSWORD"]
