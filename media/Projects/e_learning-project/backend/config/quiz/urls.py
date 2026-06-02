from rest_framework.routers import DefaultRouter

from .views import (
    QuestionViewSet,
    QuizResultViewSet
)

router = DefaultRouter()

router.register(
    "questions",
    QuestionViewSet
)

router.register(
    "results",
    QuizResultViewSet
)

urlpatterns = router.urls