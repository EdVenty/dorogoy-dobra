from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator

# Create your models here.


class Badge(models.Model):
    icon = models.ImageField()
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.title}"


class Role(models.Model):
    title = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.title}"


class Event(models.Model):
    title = models.CharField(max_length=40)
    description = models.TextField()
    badges = models.ManyToManyField(Badge)
    experience = models.IntegerField()
    time_start = models.DateTimeField()
    time_end = models.DateTimeField()
    preview = models.ImageField()

    def __str__(self):
        return f"{self.title}"


class UserParticipation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.PROTECT)
    role = models.ForeignKey(Role, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.title} - {self.role}"


class UserBadge(models.Model):
    origin = models.ForeignKey(Badge, on_delete=models.PROTECT)
    time_got = models.DateTimeField()
    event = models.ForeignKey(Event, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.origin} - {self.event}"


class User(AbstractUser):
    bio = models.TextField(max_length=100, blank=True)
    badges = models.ManyToManyField(UserBadge, blank=True)
    participations = models.ManyToManyField(UserParticipation, blank=True)
    experience = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.username}"


class Video(models.Model):
    title = models.CharField(max_length=40, blank=True)
    description = models.TextField(max_length=100, blank=True)
    src = models.FileField(validators=[FileExtensionValidator(
        allowed_extensions=['MOV', 'avi', 'mp4', 'webm', 'mkv'])])

    def __str__(self):
        return f"{self.title}"
