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
    # POST only comes in if drop down is value is changed
    if request.method == 'POST':
        # Getting project name from POST
        proj_name = request.POST.get("selectedProject")
        # Safe check for project name
        if proj_name is not None and proj_name != 'Select':
            # Getting participant list from firebase present in the project
            part_list = firebase.get_participant_list(proj_name)
            part_list_count = len(part_list)
            # percentage to be displayed on the card
            participant_percentage = (part_list_count / len(firebase.get_all_users_names())) * 100

            # Setting cookie on client end for the data to be represented:
            response = HttpResponse("Cookie Set")
            # set part_list_count on client end for the data to be represented
            response.set_cookie('part_list_count', part_list_count)
            # setting percentage cookie to be displayed on card
            response.set_cookie('participant_percentage', participant_percentage)
            return response

    # Contains list of projects
    list_of_projects = firebase.get_all_project_names()

    # total projects present on firebase
    list_of_projects_count = len(list_of_projects)

    # total users present on firebase
    list_of_users_count = len(firebase.get_all_users_names())

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


# Rendering the support page
@login_required(login_url="/login/")
def support_page(request):
    return render(request, 'home/support.html')
