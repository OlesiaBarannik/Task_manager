from django.db import models
from projects.models import Project
from django.core.exceptions import ValidationError

class Task(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    deadline = models.DateField(null=True, blank=True)
    priority = models.IntegerField(default=1)


    class Meta:
        db_table = "tasks"
        ordering = ['priority']

    @classmethod
    def create_task(cls, project_id, data):
        name = data.get('name')
        status = data.get('status', 'pending')
        deadline = data.get('deadline', None)
        priority = data.get('priority', 1)

        project = Project.objects.get(id=project_id)

        return cls.objects.create(
            project=project,
            name=name,
            status=status,
            deadline=deadline,
            priority=priority
        )

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project.id,
            'name': self.name,
            'status': self.status,
            'deadline': self.deadline,
            'priority': self.priority,
        }

    def update(self, data):
        self.name = data.get('name', self.name)
        self.status = data.get('status', self.status)
        self.deadline = data.get('deadline', self.deadline)
        self.priority = data.get('priority', self.priority)
        self.save()

    @staticmethod
    def validate_task_name_within_project(project_id, name, id=None):
        tasks = Task.objects.filter(project_id=project_id, name=name)
        if id is not None:
            tasks = tasks.exclude(id=id)

        if tasks.exists():
            raise ValidationError("Task with that name already exists for this object.")


    def __str__(self):
        return self.name

