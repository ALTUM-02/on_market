from rest_framework.routers import DefaultRouter

from .views import LessonViewSet

router = DefaultRouter()

router.register(
    "lessons",
    LessonViewSet
)

urlpatterns = router.urls