from django.db import models

# Create your models here.
from django.db import models

class Question(models.Model):

    question = models.TextField()

    option_a = models.CharField(max_length=255)

    option_b = models.CharField(max_length=255)

    option_c = models.CharField(max_length=255)

    option_d = models.CharField(max_length=255)

    correct_answer = models.CharField(
        max_length=1
    )

    def __str__(self):
        return self.question
    
class QuizResult(models.Model):

    student_name = models.CharField(
        max_length=255
    )

    score = models.IntegerField()

    total_questions = models.IntegerField()

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.student_name
        