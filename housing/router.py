from rest_framework import routers
from .views import ListingsViewSet


router = routers.SimpleRouter()
router.register(r'listings', ListingsViewSet, basename='listings')
urlpatterns = router.urls