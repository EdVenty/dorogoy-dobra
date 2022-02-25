from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions

from .serializers import UserSerializer, BadgeSerializer, EventSerializer, RoleSerializer, UserBadgeSerializer, UserParticipationSerializer, VideoSerializer
from .models import Badge, Event, Role, UserBadge, UserParticipation, Video, User

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class BadgeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows badges to be viewed or edited.
    """
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAdminUser]


class RoleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows roles to be viewed or edited.
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser]


class UserParticipationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user participations to be viewed or edited.
    """
    queryset = UserParticipation.objects.all()
    serializer_class = UserParticipationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserBadgeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user badges to be viewed or edited.
    """
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class VideoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows videos to be viewed or edited.
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAdminUser]
