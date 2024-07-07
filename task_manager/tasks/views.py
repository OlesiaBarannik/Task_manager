from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.


def indext(request):
    return HttpResponse("Hello1")
