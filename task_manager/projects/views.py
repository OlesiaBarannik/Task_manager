from django.views import View
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from .models import Project
from urllib.parse import parse_qs


class ProjectView(View):
    def get(self, request):
        projects = Project.objects.all()
        return render(request, 'projects/projects.html', {'projects': projects})

    def post(self, request):
        name = request.POST.get('project')
        new_project = Project.objects.create(name=name)
        new_project.save()
        return JsonResponse({'id': new_project.id, 'name': new_project.name})

    def patch(self, request, project_id):
        decoded_body = request.body.decode('utf-8')
        parsed_data = parse_qs(decoded_body)
        new_name = parsed_data.get('new_name', [None])[0]
        project = Project.objects.get(id=project_id)
        project.name = new_name
        project.save()
        return JsonResponse({'id': project.id, 'name': project.name})



