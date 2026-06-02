from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from .models import Lesson

from .serializers import LessonSerializer

class LessonViewSet(
    viewsets.ModelViewSet
):

    queryset = Lesson.objects.all()

    serializer_class = LessonSerializer