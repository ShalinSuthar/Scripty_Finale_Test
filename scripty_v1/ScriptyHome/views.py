
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from ScriptyHome import grammer_checker

# Create your views here.

def home(request):
    return render(request, 'home.html')

def grammarCheck(request):
    text = request.GET['text']

    parser = grammer_checker.GingerIt()
    print(parser.parse(text))
    return JsonResponse({'result': parser.parse(text)})


def login(request):
    return HttpResponse('Login')

    
    num1 = request.POST['number1']
    num2 = request.POST['number2']
    result = int(num1) + int(num2)

    return render(request, 'home.html',{'result': result})