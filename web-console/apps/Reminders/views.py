from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
@login_required(login_url="/login/")
def index(request):
    if(request.method == 'POST'):
        print(request.POST.get('scheduleSendDateInput'))
    return render(request, 'home/notification-settings.html')
