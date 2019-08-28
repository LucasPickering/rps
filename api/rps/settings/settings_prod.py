import os
from .settings import *


ALLOWED_HOSTS = ["rps.lucaspickering.me"]
DEBUG = False
SECRET_KEY = os.environ["RPS_SECRET_KEY"]
STATIC_URL = "/static/"
