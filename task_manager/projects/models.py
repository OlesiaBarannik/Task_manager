from django.db import models

# Create your models here.


class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "projects"


    def __str__(self):
        return self.name