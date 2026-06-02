from django.core.management.base import BaseCommand

from lessons.models import Lesson
from quiz.models import Question, QuizResult
from feedback.models import Feedback


class Command(BaseCommand):
    help = "Seed the backend with sample lessons, quiz questions, quiz results, and feedback."

    def handle(self, *args, **options):
        lessons = [
            {
                "title": "Introduction to Cybersecurity",
                "description": "Learn the basics of cybersecurity, threats, and safe online behavior.",
                "image": "",
                "audio": "",
                "video": "",
                "pdf": "",
            },
            {
                "title": "Network Security Fundamentals",
                "description": "Understand how networks work and how to protect them from attacks.",
                "image": "",
                "audio": "",
                "video": "",
                "pdf": "",
            },
            {
                "title": "Password Safety and Authentication",
                "description": "Build strong passwords and learn the principles of modern authentication.",
                "image": "",
                "audio": "",
                "video": "",
                "pdf": "",
            },
        ]

        questions = [
            {
                "question": "What is the strongest form of authentication?",
                "option_a": "Password only",
                "option_b": "Two-factor authentication",
                "option_c": "Security questions",
                "option_d": "Username only",
                "correct_answer": "B",
            },
            {
                "question": "Which of the following is a safe password practice?",
                "option_a": "Using the same password on every site",
                "option_b": "Writing passwords on a sticky note",
                "option_c": "Using a passphrase with symbols",
                "option_d": "Sharing passwords with coworkers",
                "correct_answer": "C",
            },
            {
                "question": "What does HTTPS protect?",
                "option_a": "DNS names",
                "option_b": "Encrypted communication between browser and server",
                "option_c": "The operating system",
                "option_d": "Your browser history",
                "correct_answer": "B",
            },
        ]

        results = [
            {
                "student_name": "Alice",
                "score": 8,
                "total_questions": 10,
            },
            {
                "student_name": "Bob",
                "score": 7,
                "total_questions": 10,
            },
        ]

        feedbacks = [
            {
                "name": "John Doe",
                "comment": "Great learning platform with clear lessons.",
                "rating": 5,
            },
            {
                "name": "Jane Smith",
                "comment": "Very helpful examples and quizzes.",
                "rating": 4,
            },
        ]

        for lesson_data in lessons:
            Lesson.objects.update_or_create(
                title=lesson_data["title"],
                defaults=lesson_data,
            )

        for question_data in questions:
            Question.objects.update_or_create(
                question=question_data["question"],
                defaults=question_data,
            )

        for result_data in results:
            QuizResult.objects.update_or_create(
                student_name=result_data["student_name"],
                defaults=result_data,
            )

        for feedback_data in feedbacks:
            Feedback.objects.update_or_create(
                name=feedback_data["name"],
                comment=feedback_data["comment"],
                defaults={
                    "rating": feedback_data["rating"],
                },
            )

        self.stdout.write(self.style.SUCCESS("Sample backend data has been created."))
