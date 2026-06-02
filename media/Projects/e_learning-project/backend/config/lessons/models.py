from django.db import models

class Lesson(models.Model):

    title = models.CharField(max_length=255)

    description = models.TextField()

    image = models.ImageField(
        upload_to="lessons/images/"
    )

    audio = models.FileField(
        upload_to="lessons/audio/"
    )

    video = models.FileField(
        upload_to="lessons/videos/"
    )

    pdf = models.FileField(
        upload_to="lessons/pdfs/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title