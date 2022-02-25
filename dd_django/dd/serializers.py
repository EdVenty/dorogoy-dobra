# from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Badge, Event, Role, UserBadge, UserParticipation, Video, User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'bio', 'badges', 'participations', 'experience']


class BadgeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Badge
        fields = ['url', 'icon', 'title', 'description']


class RoleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Role
        fields = ['url', 'title']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ['url', 'title', 'description', 'badges',
                  'experience', 'time_start', 'time_end', 'preview']


class UserParticipationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserParticipation
        fields = ['url', 'event', 'role']


class UserBadgeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserBadge
        fields = ['url', 'origin', 'time_got', 'event']


class VideoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Video
        fields = ['url', 'title', 'description', 'src']
