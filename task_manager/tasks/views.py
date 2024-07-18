from django.http.request import QueryDict
from django.http import JsonResponse, HttpResponse
from django.views import View
from projects.models import Project
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from tasks.models import Task
from django.shortcuts import render
from django.template.loader import render_to_string
from django.db.models import Max
from django.core.exceptions import ValidationError
from django.http import JsonResponse



class TaskCreateView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, project_id):
        data = request.POST.dict()
        max_priority = Task.objects.filter(project_id=project_id).aggregate(Max('priority'))['priority__max'] or 0
        new_priority = max_priority + 1
        data['priority'] = new_priority

        try:
            Task.validate_task_name_within_project(project_id, data['name'])
        except ValidationError as e:
            error_message = str(e)
            return JsonResponse({'message': error_message}, status=400)

        task = Task.create_task(project_id, data)
        task_html = render_to_string('tasks/new_task.html', {'task': task})
        return HttpResponse(task_html)

    def get(self, request, project_id):
        tasks = Task.objects.filter(project_id=project_id).order_by('priority')
        tasks_list = [task.to_dict() for task in tasks]
        return render(request, 'tasks/taks_list.html', {'task_list': tasks_list})

    def patch(self, request, project_id, task_id):
        if request.method == 'PATCH':
            data = QueryDict(request.body)
            task = Task.objects.get(id=task_id, project_id=project_id)
            tasks_in_project = Task.objects.filter(project_id=project_id)
            priority_list = list(tasks_in_project.values_list('priority', flat=True))

            if 'priority_up' in data:
                if task.priority > 1:
                    prev_task = tasks_in_project.filter(priority=task.priority - 1).first()
                    if prev_task:
                        prev_task.priority += 1
                        prev_task.save()
                    task.priority -= 1
            elif 'priority_down' in data:
                if task.priority < len(priority_list):
                    next_task = tasks_in_project.filter(priority=task.priority + 1).first()
                    if next_task:
                        next_task.priority -= 1
                        next_task.save()
                    task.priority += 1
            try:
                if 'name' in data:
                    Task.validate_task_name_within_project(project_id, data['name'], task_id)
            except ValidationError as e:
                error_message = str(e)
                return JsonResponse({'message': error_message}, status=400)

            task.update(data)

            if 'priority_up' in data or 'priority_down' in data:
                tasks = Task.objects.filter(project_id=project_id).order_by('priority')
                tasks_list = [task.to_dict() for task in tasks]
                return render(request, 'tasks/taks_list.html', {'task_list': tasks_list})

        return HttpResponse()

    def delete(self, request, project_id, task_id):
        task = Task.objects.get(id=task_id, project_id=project_id)
        task.delete()

        tasks_in_project = Task.objects.filter(project_id=project_id)

        for i in range(len(tasks_in_project)):
            tasks_in_project[i].priority = i + 1
            tasks_in_project[i].save()
        return HttpResponse()