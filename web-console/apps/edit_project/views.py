from django.shortcuts import render
from django.http import HttpResponse

def edit_project(request):

    return render(request, 'home/edit-project.html')


# Create your views here.
