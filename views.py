# -*- coding: utf-8 -*-

from django.shortcuts import render, render_to_response
from django.http import HttpResponse

from django.template.context import RequestContext

import datetime

import base64
import json

#Executing custom SQL directly
from django.db import connection

#django form class
from django import forms


##############################################################################################3

'''def test_auth(request):
   context = RequestContext(request,
                           {'request': request,
                            'user': request.user})
   return render_to_response('test_auth.html',
                             context_instance=context)
'''


##############################################################################################3
# 0. holic index view
def holic_index (request):
    #if request.method != 'POST':
    #    return toJSON({'status':'bad request'}, 400)
    user_id = 2
    intershell_retrieve = core.objects.raw('SELECT * FROM intershell_core')
    context = {'intershell_retrieve':intershell_retrieve, 'user_id':user_id }
    
    return render(request, 'holic_index.html', context)


##############################################################################################3
# 1. index view

def intershell_index (request):
    #if request.method != 'POST':
    #    return toJSON({'status':'bad request'}, 400)
    user_id = 2
    intershell_retrieve = core.objects.raw('SELECT * FROM intershell_core')
    context = {'intershell_retrieve':intershell_retrieve, 'user_id':user_id }
    return render(request, 'index.html', context)


def intershell_index_test (request):
    #if request.method != 'POST':
    #    return toJSON({'status':'bad request'}, 400)
    user_id = 2
    intershell_retrieve = core.objects.raw('SELECT * FROM intershell_core')
    context = {'intershell_retrieve':intershell_retrieve, 'user_id':user_id }
    return render(request, 'test_jinja.html', context)


##############################################################################################3
# 2. create view
def intershell_CRUD (request):
    
    if request.method == 'POST':
        cursor = connection.cursor()
        cursor.execute("call holic_test.Pintershell_retrieve_user( %s ) ", [user_id])
        row = dictfetchall(cursor)
        
    else:
        shell_form = ShellForm()
    
    return render(request, 'intershell_create.html', {'shell_form':shell_form})

def message_create_view(request):
    if request.method != 'POST':
        return toJSON({'status':'bad request'}, 400)
    
    message = Message()
    try:
        message.user = request.user
        message.message = request.POST.get('message', '')
        message.save()
        return toJSON({'status':'create success'})
    except:
        return toJSON({'status':'bad request'}, 400)

##############################################################################################
# 3. retrieve view
def intershell_retrieve (request, user_id):
    
    cursor = connection.cursor()
    cursor.execute("call holic_test.Pintershell_retrieve_user( %s ) ", [user_id])
    row = dictfetchall(cursor)
    
    context = {'intershell_retrieve':row}
    return render(request, 'intershell_retrieve.html', context)

def intershell_retrieve_test (request, user_id):
    
    cursor = connection.cursor()
    cursor.execute("call holic_test.Pintershell_retrieve_user( %s ) ", [user_id])
    row = dictfetchall(cursor)
    
    context = {'intershell_retrieve':row}
    return render(request, 'intershell_retrieve.html', context)

def message_view(request, num):
    try:
        message = Message.objects.get(id=num)
        
        return toJSON(message.serialize())
    except:
        return toJSON({'status':'not found'}, 400)
    
    return HttpResponse(None)


def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

##############################################################################################
# T.1 test custom sql
def custom_sql(self):
    cursor = connection.cursor()

    cursor.execute("call Pintershell_retrieve(%s ) ", [self.shell_id])
    row = cursor.fetchone()

    return row




# Create your views here.
def test(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s</body></html>" % now
    return HttpResponse(html)


def intershell_main_view(request):
    
    return true


#########################################################################################
# JSON and serialize
def serialize(objs):
    serialize=[]
    for obj in objs:
        obj.append(obj.serialize())
    return serialize
        
def toJSON(objs, status=200):
    j = json.dumps(objs, ensure_ascii=False)
    return HttpResponse(j,status,content_type='application/json;charset=utf-8')