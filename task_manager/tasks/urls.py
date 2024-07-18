from django.urls import path
from .views import TaskCreateView

app_name = 'tasks'

urlpatterns = [
    path('<int:project_id>/tasks/', TaskCreateView.as_view(), name='create_task'),
    path('<int:project_id>/tasks/<int:task_id>', TaskCreateView.as_view(), name='update_task'),

]
