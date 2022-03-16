from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def reset_password(request):
    return HttpResponse("I am the reset app!")