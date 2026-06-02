from rest_framework import serializers

from .models import (
    Question,
    QuizResult
)

class QuestionSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Question

        fields = "__all__"


class QuizResultSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = QuizResult

        fields = "__all__"