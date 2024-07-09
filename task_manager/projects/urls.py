from django.urls import path
from .views import *

urlpatterns = [
    path('', ProjectView.as_view(), name='project-create'),
    path('<int:project_id>/', ProjectView.as_view(), name='project-detail'),

]

