import os
from .core import *

ALLOWED_HOSTS = ["rps-api"]
DEBUG = False
SECRET_KEY = os.environ["RPS_SECRET_KEY"]

CLEAR_LIVEMATCH_ON_STARTUP = True
