import os
from .settings import *


RPS_HOSTNAME = os.environ["RPS_HOSTNAME"]
ALLOWED_HOSTS = [RPS_HOSTNAME]
DEBUG = False
SECRET_KEY = os.environ["RPS_SECRET_KEY"]
STATIC_URL = "/static/"
