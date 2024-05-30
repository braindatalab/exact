from django.contrib import admin
from .platform.backend.api.models import *

admin.site.register(Mlmodel)
admin.site.register(Dataset)
admin.site.register(Xaimethod)
admin.site.register(Score)
admin.site.register(Challenge)
