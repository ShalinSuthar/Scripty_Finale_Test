#from googletrans import Translator
#from google_trans_new import google_translator  

from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from ScriptyHome import grammer_checker
from ScriptyHome import scripty_gtranslate

# Create your views here.

def home(request):
    return render(request, 'home.html')

def grammarCheck(request):
    text = request.POST['text']

    parser = grammer_checker.GingerIt()
    print(parser.parse(text))
    return JsonResponse({'result': parser.parse(text)})


def login(request):
    return HttpResponse('Login')

def translateText(request):
    text = request.POST['text']
    src = request.POST['src']
    dest = request.POST['dest']
    #print(dest)

    translate_text = scripty_gtranslate.gtranslate(text,src=src,dest=dest)
    #print(translate_text)
    return JsonResponse({'result': translate_text})
    

    