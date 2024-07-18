from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.http.request import QueryDict
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views import View
from .models import Project


class ProjectView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        projects = Project.objects.all()
        project_list = [{'id': project.id, 'name': project.name} for project in projects]
        return render(request, 'projects/project_list.html', {'project_list': project_list})

    def post(self, request):
        name = request.POST.get('name', 'New Project')

        try:
            Project.validate_project_name(name)
        except ValidationError as e:
            error_message = str(e)
            return JsonResponse({'message': error_message}, status=400)

        new_project = Project.objects.create(name=name)
        new_project.save()
        project_html = render_to_string('projects/new_project.html', {'project': new_project})
        return HttpResponse(project_html)


    def patch(self, request, project_id):
        if request.method == 'PATCH':
            data = QueryDict(request.body)
            new_name = data.get('project-name')
            if new_name:
                project = get_object_or_404(Project, id=project_id)
                project.name = new_name
                try:
                    Project.validate_project_name(project.name, project.id)
                except ValidationError as e:
                    error_message = str(e)
                    return JsonResponse({'message': error_message}, status=400)
                project.save()
        return render(request, 'projects/edit_project_name.html', {'project': project})


    def delete(self, request, project_id):
        project = Project.objects.filter(id=project_id)
        project.delete()
        return HttpResponse()
