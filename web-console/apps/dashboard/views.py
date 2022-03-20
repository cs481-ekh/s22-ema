from importlib.machinery import SourceFileLoader
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
import os

from django.template import loader
from django.urls import reverse
from django.utils.translation import template

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()


@login_required(login_url="/login/")
def index(request):
    list_of_projects = firebase.get_all_project_names()

    # total projects present on firebase
    list_of_projects_count = len(list_of_projects)

    # total users present on firebase
    list_of_users_count = len(firebase.get_all_users_names())

    if request.method == 'POST':
        print(request.POST)

    return render(request, 'home/index.html',
                  {'list_of_projects_dict': list_of_projects, 'list_of_projects_count': list_of_projects_count,
                   'list_of_users_count': list_of_users_count})


# To be removed later
@login_required(login_url="/login/")
def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:

        load_template = request.path.split('/')[-1]

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        context['segment'] = load_template

        html_template = loader.get_template('home/' + load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:

        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))
