from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from django.views import View
from .models import Project
import json


class ProjectView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        projects = Project.objects.all()
        project_list = [{'id': project.id, 'name': project.name} for project in projects]
        if request.headers.get('Content-Type') == 'application/json':
            return JsonResponse(project_list, safe=False)
        return render(request, 'projects/projects.html', {'project_list': project_list})

    def post(self, request):
        data = json.loads(request.body)
        name = data.get('project')
        new_project = Project.objects.create(name=name)
        new_project.save()
        return JsonResponse({'id': new_project.id, 'name': new_project.name})

    def patch(self, request, project_id):
        data = json.loads(request.body)
        new_name = data.get('project')

        updated_project, _ = Project.objects.update_or_create(
            id=project_id,
            defaults={'name': new_name}
        )

        return JsonResponse({'id': updated_project.id, 'name': updated_project.name})

    def delete(self, request, project_id):
        project = Project.objects.filter(id=project_id)
        project.delete()
        return JsonResponse({'status': 'success'})
