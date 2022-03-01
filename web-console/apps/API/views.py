from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(['POST'])
def api_test(request):
    print(request.body)
    return JsonResponse("API BASE POINT", safe=False)