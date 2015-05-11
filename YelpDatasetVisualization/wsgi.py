"""
WSGI config for YelpDatasetVisualization project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
from business.models import init_models
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "YelpDatasetVisualization.settings")

print "Startup code"
init_models()

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
