import json
from django.http import JsonResponse
from django.views import View
from projects.models import Project
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from tasks.models import Task
from django.shortcuts import render

class TaskCreateView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, project_id):
        task = Task().create_task(project_id, json.loads(request.body))
        return JsonResponse(task.to_dict(), status=201)

    def get(self, request, project_id):
        tasks = Task.objects.filter(project_id=project_id).order_by('priority')
        tasks_list = [task.to_dict() for task in tasks]
        if request.headers.get('Content-Type') == 'application/json':
            return JsonResponse(tasks_list, safe=False)
        return render(request, 'tasks/tasks.html', {'tasks_list': tasks_list})

    def patch(self, request, project_id, task_id):
        task = Task.objects.get(id=task_id, project_id=project_id)
        data = json.loads(request.body)
        task.update(data)
        return JsonResponse(task.to_dict(), status=200)

    def delete(self, request, project_id, task_id):
        task = Task.objects.get(id=task_id, project_id=project_id)
        task.delete()
        return JsonResponse({'status': 'success'})