"""scripty_v1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    #path('add', views.add, name='add'),
    path('grammarCheck', views.grammarCheck, name='grammarCheck'),
    path('login',views.login,name='login'),
    path('translateText',views.translateText,name='translateText'),
    path('readPdfImage',views.readPdfImage,name='readPdfImage'),
    path('gosynonym',views.gosynonym,name='gosynonym'),
    path('goantonym',views.goantonym,name='goantonym'),
    path('gomeaning',views.gomeaning,name='gomeaning'),    
    path('dashboard',views.dashboard,name='dashboard'),
    path('home',views.home,name='home'),
]
