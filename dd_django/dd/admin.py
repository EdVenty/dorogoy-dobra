from django.contrib import admin
from .models import User, Badge, Event, Role, UserBadge, UserParticipation, Video

# Register your models here.
admin.site.register(User)
admin.site.register(Badge)
admin.site.register(Event)
admin.site.register(Role)
admin.site.register(UserBadge)
admin.site.register(UserParticipation)
admin.site.register(Video)
