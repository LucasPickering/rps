import os
from .settings import *


ALLOWED_HOSTS = [os.environ["RPS_HOSTNAME"]]
DEBUG = False
SECRET_KEY = os.environ["RPS_SECRET_KEY"]
STATIC_URL = "/static/"
