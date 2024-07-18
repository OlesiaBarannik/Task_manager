from django.db import models
from django.core.exceptions import ValidationError
# Create your models here.


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, default="New Project")

    class Meta:
        db_table = "projects"
    @staticmethod
    def validate_project_name(name, id=None):
        projects = Project.objects.filter(name=name)
        if id is not None:
            projects = projects.exclude(id=id)

        if projects.exists():
            raise ValidationError("Project with that name already exists")

    def __str__(self):
        return self.name