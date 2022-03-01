from django.db.migrations import serializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def api_test(request):
    if request.method == 'POST':
        print("anything")
        print(request.body)
    else:
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
