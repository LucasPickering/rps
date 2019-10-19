import os
from .settings import *

RPS_HOSTNAME = os.environ.get("RPS_HOSTNAME", "localhost:3000")
ALLOWED_HOSTS = ["*"]
STATIC_URL = "/api/static/"
SECRET_KEY = "ssfzscql8d7rf016q!&16z5@qo@a6_eou-7_76m7gtgs8q^n5j"
DEBUG = True
DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": lambda request: True}
