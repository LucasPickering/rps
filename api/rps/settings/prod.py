import os
from .core import *


STATIC_URL = "/static/"
ALLOWED_HOSTS = ["rps.lucaspickering.me"]
DEBUG = False
SECRET_KEY = os.environ["RPS_SECRET_KEY"]
