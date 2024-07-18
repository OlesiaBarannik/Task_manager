from django.urls import path
from .views import ProjectView

app_name = 'projects'  # Додайте простір імен для додатку

urlpatterns = [
    path('', ProjectView.as_view(), name='project-create'),
    path('<int:project_id>/', ProjectView.as_view(), name='project-detail'),
]
