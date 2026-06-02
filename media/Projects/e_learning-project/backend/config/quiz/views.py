from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from .models import (
    Question,
    QuizResult
)

from .serializers import (
    QuestionSerializer,
    QuizResultSerializer
)

class QuestionViewSet(
    viewsets.ModelViewSet
):

    queryset = Question.objects.all()

    serializer_class = QuestionSerializer


class QuizResultViewSet(
    viewsets.ModelViewSet
):

    queryset = QuizResult.objects.all()

    serializer_class = QuizResultSerializer