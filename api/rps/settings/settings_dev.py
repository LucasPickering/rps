from .settings import *

STATIC_URL = "/api/static/"
SECRET_KEY = "ssfzscql8d7rf016q!&16z5@qo@a6_eou-7_76m7gtgs8q^n5j"
DEBUG = True
ALLOWED_HOSTS = ["*"]
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
