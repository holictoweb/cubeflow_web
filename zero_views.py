# -*- coding: utf-8 -*-

from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponse, HttpResponseRedirect

#CSRF tocken
from django.views.decorators.csrf import csrf_protect

#authenticate
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

#reverse
from django.core.urlresolvers import reverse

import datetime

import base64
import json

#from intershell.models import core,con,ex

#Executing custom SQL directly
from django.db import connection

#django form class
from django import forms

#djagno Authentication
from django.contrib.auth.models import User

# raw htmlcode 
from django.template import Context, Template, loader

##############################################################################################3
#decoratoer
def need_auth(func):
    def try_auth(*args, ** kwargs):
        if 'HTTP_AUTHOIZATION' in request.META:
            basicauth = request.MEATA['HTTP_AUTHOIZATION']
            user = None
            try:
                b64key = basicauth.split('')[1]
                key = base64.decodestring(b64key)
                
                (username,pw) = key.split(':')
                
                user = authenticate(username=username, password=pw)
            
            except:
                pass

        
        ret = func(*args, **kwargs)
        print 'ent'
    return wrap
##############################################################################################3
#session and login/logout
def zero_session(request):

    print '#### zero_session start ..............................'
    print request.POST['target']
    print request.POST["session_type"]

    if request.POST["session_type"] == "cube":
        request.session['cube_id'] = request.POST['target']
        #print request.session['cube_id']
    elif request.POST["session_type"] == "shell":
        request.session['shell_id'] = request.POST['target']

    print '#### zero_session success ..............................'
    #if request.POST['redirect_path']=="cubeD":
    #    return HttpRedirect("/zero/cubeD")

    return toJSON({'status':'change sucess'})

def zero_social_auth(request):

    #context = Context({'zero_cube':zero_cube })
    context = RequestContext(request, {'request': request, 'user': request.user})
    #template = Template('sub_single_cube.html')

    '''template = loader.get_template("M_profile.html")
    Mprofile = template.render(context)

    return HttpResponse (Mprofile)'''

    return render( request, 'zero_index.html')

def zero_default_auth(request):

    print '### Z.00 default auth............'

    username = request.POST['username']
    password = request.POST['password']

    user = authenticate(username=username, password=password)

    message = ''

    if user is not None:
        if user.is_active:
            login(request, user)

            message="success!!!"

            #return_data = zero_cube(request, 'TH', 0 )

            return redirect('intershell/zero/cube/T/0')

        else:
            message = 'disable'
            return render(request, 'zero_index.html')
    else:
        message = 'error!'

    return render(request, 'zero_index.html')


def zero_login(request):

    return render(request, 'zero_index.html')
##############################################################################################3
# 1. join_view

def zero_join (request):

    #username = request.POST[]
    zero_retrieve = 'history'

    context = {'history':zero_retrieve }

    return render(request, 'M_join.html', context)

def zero_join_control (request):

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        nick_name = request.POST['nickname']

    user = User.objects.create_user(username, None,  password)

    try:
        cursor = connection.cursor()
        cursor.execute("EXEC dbo.PProfile_create   @user_id = %s, @nick_name = %s ", [user.id, nick_name])

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'create profile failed'})


    return redirect('intershell/zero/cube/T/0')

##############################################################################################3
# 0. holic index view

def index(request):
    print 'test'
    if request.user.id:
        print request.user.id
        return zero_cube(request, 'T', 0 )
    
    return render(request,'index.html')


def zero_index(request):

    print '### Zero index page load.........'
    
    if request.user.id:
        #move to cube page
        print '###### call zero_cube'
        return zero_cube(request, 'T', 0)

    return render(request, 'zero_index.html')

##############################################################################################3
# profile 
    
def zero_hover_user(request):
    
    print "#### hover user"
    
    user_id = request.POST["user_id"]
    
    try:
        cursor = connection.cursor()
        #cursor.execute("EXEC dbo.puser_retrieve   @user_id = %s", user_id ) 
        cursor.execute("EXEC dbo.puser_retrieve   @user_id = 1" )
        ajax_retrieve = dictfetchall(cursor)

        '''cursor.execute("select username from dbo.auth_user where id = 4" ) 
        ajax_retrieve_hover = dictfetchall(cursor)'''    
    except Exception as e:  
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'create failed'})
    finally:
        cursor.close()
    
    context = {'M_profile_retrieve':ajax_retrieve, 'div_id':'M_hover_user' }
    #template = Template('sub_single_cube.html')
    template = loader.get_template("M_profile.html")

    output = template.render(context, request)
    print "#### END hover user"
    return HttpResponse (output)

def zero_profile(request, M_profile_type, user_id ):

    print '###### PROFILE start.......'
    
    if "user_id" in request.POST:
        target_user_id = request.POST["user_id"]
    else:
        target_user_id = user_id

    if "new_comment" in request.POST:
        new_comment = request.POST["new_comment"]
    else:
        new_comment = ''

    if "new_nick_name" in request.POST:
        new_nick_name = request.POST["new_nick_name"]
    else:
        new_nick_name = 'nonamed'


    request_user_id = request.user.id

    cursor = connection.cursor()
    try:

        if M_profile_type == "updateR": # back data (one user Profile)
            cursor.execute("exec dbo.Pprofile_retrieve @target_user_id = %s , @request_user_id = %s", [target_user_id, request_user_id])
            M_Profile_retrieve = dictfetchall(cursor)
            context =  {'M_Profile_retrieve': M_Profile_retrieve, 'M_profile_type':M_profile_type }
            return render(request, 'zero_profile.html', context)

        elif M_profile_type == "update": # back data (one user Profile)
            print new_nick_name
            print new_comment
            cursor.execute("exec dbo.Pprofile_create @user_id = %s , @profile_type = %s, @nick_name = %s, @comment = %s ", [user_id, 'U', new_nick_name, new_comment])
            return toJSON({'status':'Success Update Profile'})

        elif M_profile_type == "P": # one user Profile
            cursor.execute("exec dbo.Pprofile_retrieve @target_user_id = %s, @request_user_id = %s ", [target_user_id, request_user_id])
            M_Profile_retrieve = dictfetchall(cursor)

            context = {'M_Profile_retrieve': M_Profile_retrieve, "M_profile_type":M_profile_type}

            template = loader.get_template("M_profile.html")
            output = template.render(context, request)
            return HttpResponse(output)

        elif M_profile_type == "DO": # back data (one user Profile)
            cursor.execute("exec dbo.Pprofile_retrieve @target_user_id = %s, @request_user_id = %s ", [target_user_id, request_user_id])
            M_Profile_retrieve = dictfetchall(cursor)
            return M_Profile_retrieve

        elif M_profile_type == 'hover':
            #cursor.execute("select username from dbo.auth_user where id = %s ", [user_id] )
            cursor.execute("exec dbo.Pprofile_retrieve @target_user_id = %s, @request_user_id = %s ", [target_user_id, request_user_id])
            M_Profile_retrieve = dictfetchall(cursor)

            data = json.dumps(M_Profile_retrieve)

            context = {'M_Profile_retrieve': M_Profile_retrieve }

            template = loader.get_template("M_profile.html")
            output = template.render(context, request)
            return HttpResponse(output)

        elif M_profile_type == "L":
            cursor.execute("exec dbo.PSearch_User @search_keyword = %s , @user_id = %s " , [search_keyword, request.user.id] )
            M_Profile_retrieve = dictfetchall(cursor)

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'create failed'})
    finally:
            cursor.close()
    print ".....................Profile end ####"
    
    return toJSON({'status':'FAILED retrieve profile'})

##############################################################################################3
# top Control data

def zero_control (request):
    
    return data

##############################################################################################3
    
def zero_connect(request, M_connect_type):
    print ('#### zero connect '+ M_connect_type +'.........................')

    '''connect_type
    
    R : retrieve
    U : connect User (action)
    
    create connect type
    F : follow
    C : connect
    '''

    user_id = request.user.id
    
    if( "target_id" in request.POST):   
        target_id = request.POST["target_id"]
        
    cursor = connection.cursor()    
    try:    
            
        if M_connect_type == "U": # create follow
            cursor.execute("exec dbo.PConnect_create @connect_type = %s, @target_id = %s, @source_id =%s" , [M_connect_type, target_id, user_id] )
        else:
            cursor.execute("exec dbo.PConnect_retrieve @user_id = %s, @connect_type = %s  " , [user_id, M_connect_type] ) 
            M_Connect_retrieve = dictfetchall(cursor)
            
    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'zero_connect retrieve  failed'})
    
    finally:
        cursor.close()
    
    print ('......................... END connect '+ M_connect_type+'#####')
    
    if M_connect_type == 'R':
        context =  {'M_Connect_retrieve': M_Connect_retrieve, 'M_connect_type':M_connect_type }
        return render(request, 'zero_connect.html', context)
        
    elif M_connect_type == 'U':
        return toJSON({'status':'connect success'})


def zero_connect_CRUD (request):
    
    print "#### zero_connect_CRUD started.................."
    
    if 'connect_type' in request.POST:
        connect_type = request.POST['connect_type']
    else: 
        connect_type = "C"
    
    if 'target_id' in request.POST:
        target_id = request.POST['target_id']
    
    if connect_type == "F": # flow
        source_id = request.user.id
    elif 'source_id' in request.POST:
        source_id = request.POST['source_id']
    else:
        source_id = 0
    
    
    cursor = connection.cursor()
    
    try:
        cursor.execute("exec dbo.PConnect_creeate @connect_type  = %s, @target_id = %s , @source_id = %s  " , [connect_type , target_id , source_id] )
         
    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'zero_connect retrieve  failed'})
    
    finally:
        cursor.close()
    
    return toJSON({'status':'succes create connect'})


######################################################################################################
def zero_cube(request, M_cube_type, target_id):
    # Min Stream cube
    print '##### zero.1 Cube - '+ M_cube_type +'.............'
    
    request_user_id = request.user.id

    if request.user.id is None:
        M_cube_type="S"
        request_user_id = 0

    if 'target_user_id' in request.POST:
        target_user_id = request.POST['target_user_id']
    else:
        target_user_id = 0

    if 'scroll_seq' in request.POST:
        scroll_seq = request.POST['scroll_seq']
    else:
        scroll_seq = 0


    cursor = connection.cursor()
    try:
        # type Timeline User  MetaData  SearchResult OneCube HtmlCube
        if M_cube_type == "T" or M_cube_type =="TH" : #all cube with follower and my cube WITH SCROLL
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @request_user_id = %s, @scroll_seq = %s", ["T", request_user_id, scroll_seq])
            M_Cube_retrieve = dictfetchall(cursor)

        elif M_cube_type == "U": #USER cube list WITH SCROLL - user click
            target_user_id = target_id
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @request_user_id = %s, @user_id = %s, @scroll_seq = %s", [M_cube_type, request_user_id, target_user_id, scroll_seq])
            M_Cube_retrieve = dictfetchall(cursor)
            M_Profile_retrieve = zero_profile(request, 'DO', target_user_id); #개별 profile 정보

        elif M_cube_type == "M" or M_cube_type == "MC": #META Cube List and my cube
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @request_user_id = %s,  @scroll_seq = %s", ["M", request_user_id, scroll_seq])
            M_Cube_retrieve = dictfetchall(cursor)

        elif M_cube_type == "S": #for search engine display # google and search in cubeflow
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @scroll_seq = %s", [M_cube_type, scroll_seq])
            M_Cube_retrieve = dictfetchall(cursor)

        elif M_cube_type == "O" or M_cube_type == "OH": #??? create is exist?? or any time one cube display
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @request_user_id = %s, @cube_id = %s", ['O', request.user.id, target_id])
            M_Cube_retrieve = dictfetchall(cursor)

        elif M_cube_type == "H": #HTML Display
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @request_user_id = %s, @cube_id = %s", [M_cube_type, request.user.id, target_id])
            M_Cube_retrieve = dictfetchall(cursor)

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'zero_cube retrieve  failed - type : ' + M_cube_type + ''})

    finally:
        cursor.close()
    context = {'M_Cube_retrieve':M_Cube_retrieve, 'M_cube_type': M_cube_type, 'request_user_id': request_user_id, 'scroll_seq':scroll_seq}

    if M_cube_type == 'H'  or  M_cube_type == 'TH' or  M_cube_type == 'OH' or scroll_seq > 0:
        # print M_Cube_retrieve
        template = loader.get_template("M_cube.html")
        # add template
        output = template.render(context, request)
        print '##### zero.1-2 M_Cube.html load END.........'
        return HttpResponse(output)

    elif M_cube_type == 'T' or M_cube_type == 'O' or M_cube_type == 'S': #basic call timeline and someone cubelist
        print '##### zero.1-1 zero_cube load end......... ######'
        return render(request, 'zero_cube.html', context)

    elif M_cube_type == 'U' : #basic call timeline and someone cubelist
        context = {'M_Cube_retrieve':M_Cube_retrieve, 'M_cube_type': M_cube_type, 'request_user_id': request_user_id, 'scroll_seq':scroll_seq , "M_Profile_retrieve":M_Profile_retrieve, "M_profile_type":'DO'}
        return render(request, 'zero_cube.html', context)

    elif M_cube_type == 'M': #Meta data
        template = loader.get_template("M_cube.html")
        output = template.render(context, request)
        return HttpResponse(output)

    elif M_cube_type == 'MC': #My Cube for select Meta cube
        template = loader.get_template("M_cube.html")
        output = template.render(context, request)
        return HttpResponse(output)



######################################################################################################
def zero_shell(request, M_shell_type):
    #print '##### zero.2 Shell load '+ M_shell_type +' .........'
    '''M_shell_type
    New M_shell_type
    Shell
    M :Meta
    ReadOnly
    '''

    #user_id is same as request.user.id
    
    if 'cube_id' in request.POST:
        cube_id = request.POST['cube_id']
        shell_id = 0
    elif 'shell_id' in request.POST:
        cube_id = 0
        shell_id = request.POST['shell_id']

    if 'con_id' in request.POST:
        con_id = request.POST['con_id']

    request_user_id = request.user.id

    cursor = connection.cursor()
    try:
        if M_shell_type == 'CN':
            cursor.execute("exec dbo.PShell_retrieve_connection   @shell_id= %s, @con_id=%s, @user_id=%s ", [ shell_id, con_id, request_user_id])
            M_shell_retrieve = dictfetchall(cursor)
        else :
            cursor.execute("exec dbo.PShell_retrieve  @cube_id= %s, @shell_id= %s, @user_id=%s ", [cube_id, shell_id, request_user_id])
            M_shell_retrieve = dictfetchall(cursor)


        context = Context( {'M_Shell_retrieve':M_shell_retrieve,'M_shell_type': M_shell_type} )
        template = loader.get_template("M_Shell.html")

        output = template.render(context)

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'create failed'})
    finally:
        cursor.close()    

    #M- meta
    return HttpResponse(output)
        
######################################################################################################
### flow 
def zero_flow(request, M_flow_type, cube_id, shell_id ):
    
    print '#### zero_flow type : ' + M_flow_type +'.............................'

    if 'cube_id' in request.POST:
        cube_id = request.POST['cube_id']

    if 'shell_id' in request.POST:
        shell_id = request.POST['shell_id']

    if 'scroll_seq' in request.POST:
        scroll_seq = request.POST['scroll_seq']
    else:
        scroll_seq = 0

    if 'target_user_id ' in request.POST:
        target_user_id = request.POST['target_user_id']
    else:
        target_user_id = request.user.id
    request_user_id = request.user.id
    cursor = connection.cursor()
    try:
        #type -  Flow Single SignleMeta User
        if M_flow_type == "UF": # Full User ( Self or others ) LIST
            M_cube_type = "F"
            M_profile_type = "DO" #only DATA
            cursor.execute("exec dbo.PFlow_retrieve  @flow_type = %s , @request_user_id = %s, @scroll_seq = %s", [M_cube_type, request_user_id, scroll_seq])
            M_Cube_retrieve = dictfetchall(cursor)

            M_Profile_retrieve = zero_profile(request, M_profile_type, target_user_id); #개별 profile 정보
            context = {"M_Cube_retrieve":M_Cube_retrieve, "M_cube_type":M_cube_type, "scroll_seq":scroll_seq, "M_flow_type":M_flow_type, "M_Profile_retrieve":M_Profile_retrieve, "M_profile_type":M_profile_type}

        ###### single target For Meta
        if M_flow_type == "S" or M_flow_type == "SF": #single Target  For META DATA - only html
            cursor.execute("exec dbo.PFlow_retrieve @flow_type = %s, @shell_id = %s, @cube_id = %s", ["S", shell_id, cube_id])
            M_Cube_retrieve = dictfetchall(cursor)
            if M_flow_type == "S" :
                M_cube_type = "M"
            elif M_flow_type =="SF":
                M_cube_type = "F"
            context = {"M_Cube_retrieve":M_Cube_retrieve, "M_cube_type":M_cube_type, "M_flow_type":M_flow_type, "scroll_seq":scroll_seq}

        elif M_flow_type == "U": #????/ What is this??? single cube???
            cursor.execute("exec dbo.PFlow_retrieve  @flow_type = %s , @cube_id= %s", [M_flow_type, cube_id])
            M_Flow_retrieve = dictfetchall(cursor)
            context={"M_Flow_retrieve":M_Flow_retrieve, "M_flow_type":M_flow_type}

        elif M_flow_type == "O":  #single cube
            cursor.execute("exec dbo.PFlow_retrieve @flow_type = %s, @cube_id = %s" , [M_flow_type, cube_id] )
            M_Flow_retrieve = dictfetchall(cursor)  
            M_Cube_retrieve = zero_cube(request, M_flow_type, cube_id)
            context={"M_Flow_retrieve":M_Flow_retrieve, "M_flow_type":M_flow_type, "M_Cube_retrieve":M_Cube_retrieve, "M_cube_type":M_flow_type, 'request_user_id': request.user.id}
            
    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'flow retrieve failed'})
    finally:
        cursor.close()
    
    if M_flow_type == "U":
        template = loader.get_template("M_Flow.html")
        output = template.render(context, request)
        return HttpResponse(output)
    elif M_flow_type == "S":
        template = loader.get_template("M_Cube.html")
        output = template.render(context, request)
        return HttpResponse(output)
    elif M_flow_type == "SF" :
        template = loader.get_template("M_Flow.html")
        output = template.render(context, request)
        return HttpResponse(output)
    elif M_flow_type == "UF":
        return render(request, 'zero_flow.html', context)
    elif M_flow_type == "O":
        return render(request, 'zero_flow.html', context)

    
    return toJSON({'status':'request is not correct!'})

def zero_flow_T (request, M_flow_type, cube_id, shell_id):
    return HttpResponse("<p>test</p>")


######################################################################################################
def zero_hash(request, M_hash_type):
    '''
    D : hashDir
    H : hashtag retrieve
    '''

    if "cube_id" in request.POST:
        cube_id = request.POST["cube_id"]
    else:
        cube_id = 0

    if "hashcon_id" in request.POST:
        hashcon_id = request.POST["hashcon_id"]
    else:
        hashcon_id = 0

    M_Hashdir_retrieve = []
    M_Hashtag_retrieve = []

    request_user_id = request.user.id

    cursor = connection.cursor()
    try:
        if M_hash_type == "H": #HASHTAG #top hash list show # in CUBE D and H all derive
            cursor.execute("exec dbo.PHash_retrieve  @hash_type = %s , @cube_id= %s, @request_user_id =%s" , ['H', cube_id, request_user_id])
            M_Hashtag_retrieve = dictfetchall(cursor)

            cursor.execute("exec dbo.PHash_retrieve  @hash_type = %s , @cube_id= %s, @request_user_id =%s" , ['D', cube_id, request_user_id])
            M_Hashdir_retrieve  = dictfetchall(cursor)

        elif M_hash_type == "HO": #only hashtag
            cursor.execute("exec dbo.PHash_retrieve  @hash_type = %s , @cube_id= %s, @request_user_id =%s" , ['H', cube_id, request_user_id])
            M_Hashtag_retrieve = dictfetchall(cursor)

        elif M_hash_type == "CD": #CreatehashDir
            #procedure call PHash_retrieve
            cursor.execute("exec dbo.PHash_create  @hash_type = %s , @target_hashcon_id= %s , @request_user_id = %s" , ['CD', hashcon_id, request_user_id])
            cursor.execute("exec dbo.PHash_retrieve  @hash_type = %s , @cube_id= %s, @request_user_id =%s" , ['D', cube_id, request_user_id])
            M_Hashdir_retrieve  = dictfetchall(cursor)

        elif M_hash_type == "UD": #updatehashDir

            json_data = json.loads(request.body.decode("utf-8"))
            if 'hashcon_list' in json_data:
                # shell and con create finished
                hashcon_list = json_data['hashcon_list']
                hashcon_list = json.dumps(hashcon_list)

            cursor.execute("exec dbo.PHash_create  @hash_type = %s , @target_hashcon_list= %s , @request_user_id = %s" , ['UD', hashcon_list, request_user_id] )
            #cursor.execute("exec dbo.PHash_retrieve  @hash_type = %s , @cube_id= %s, @request_user_id =%s" , ['D', cube_id, request_user_id] )
            #M_Hashdir_retrieve = dictfetchall(cursor)
            return toJSON({'status':'hashdir created!!'})

        elif M_hash_type == "RD": #REMOVE HASHDIR
            #procedure call PHash_retrieve

            print hashcon_id
            cursor.execute("exec dbo.PHash_create  @hash_type = %s , @target_hashcon_id= %s , @request_user_id = %s" , ['RD', hashcon_id, request_user_id])
            return toJSON({'status':'hashdir removed !!'})

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'retrieve extend failed'})
    finally:
        cursor.close()

    context={"M_Hashtag_retrieve":M_Hashtag_retrieve, "M_Hashdir_retrieve": M_Hashdir_retrieve, "M_hash_type":M_hash_type }

    template = loader.get_template("M_Hash.html")
    output = template.render(context, request)
    return HttpResponse(output)

    #return toJSON({'status':'request is not correct!'})

######################################################################################################
def zero_extend(request, M_extend_type): 
    '''M_extend_type
    R : retrieve tag list
    O : retireve order?

    H : hashtag retrieve
    '''
    #print '#### zero_extend start.............................'+ M_extend_type

    if "cube_id" in request.POST:
        cube_id = request.POST["cube_id"]
    else:
        cube_id = 0
        
    if "shell_id" in request.POST:
        shell_id = request.POST["shell_id"]
    else:
        shell_id = 0

    request_user_id = request.user.id

    cursor = connection.cursor()
    try:
        if M_extend_type == "R":
            cursor.execute("exec dbo.PEx_retrieve  @ex_type = %s , @cube_id= %s, @shell_id= %s " , [M_extend_type, cube_id, shell_id] )
            M_Extend_retrieve = dictfetchall(cursor)
            #print M_Extend_retrieve


    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'retrieve extend failed'})
    finally:
        cursor.close()

    context={"M_Extend_retrieve":M_Extend_retrieve, "M_extend_type":M_extend_type }
    template = loader.get_template("M_Extend.html")
    output = template.render(context, request)
    return HttpResponse(output)

    #return toJSON({'status':'request is not correct!'})

##############################################################################################3
# Search Action and retrieve
def zero_search (request):
    
    '''
    search_type
    T : Tag Search
    S : Shelll Search (flow develop)
    
    U : user
    T : hashtags <-cube_id -> shell_id 
    '''
    print "##### zero_Search ............................."
    #print request


    if "search_type" in request.POST:
        search_type = request.POST["search_type"]
    else:
        search_type = "T"
        
    if "search_keyword" in request.POST:
        search_keyword = request.POST["search_keyword"]
    else:
        search_keyword = ''


    if "search_hashtag" in request.POST:
        search_hashtag = request.POST["search_hashtag"]
    else:
        search_hashtag =''



    request_user_id = request.user.id

    cursor = connection.cursor()
    try:
        if search_type == "T":
            print search_type,search_keyword, request_user_id
            cursor.execute("exec dbo.PSearch @search_type = %s, @search_keyword = %s, @request_user_id = %s" , [search_type, search_keyword, request_user_id] ) 
            M_Cube_retrieve = dictfetchall(cursor)


            print M_Cube_retrieve

        elif search_type == "S": #Search Shell and return Cube and shell_id list
            if "shell_id" in request.POST:
                shell_id = request.POST["shell_id"]
            cursor.execute("exec dbo.PSearch  @search_type = %s, @shell_id = %s ", [search_type, shell_id] )
            M_Cube_retrieve = dictfetchall(cursor)

            # search is only execute by TAG (search keyword) and  shell_id
            #cursor.execute("exec dbo.PSearch @search_type = %s, @search_keyword = %s, @request_user_id = %s" , [search_type, search_keyword, request_user_id] )
            #M_Cube_retrieveT = dictfetchall(cursor)

        elif search_type == "U":
            cursor.execute("exec dbo.PSearch_User @search_keyword = %s , @user_id = %s " , [search_keyword, request_user_id] )
            M_Profile_retrieve = dictfetchall(cursor)


        elif search_type == "A": #have to develope
            cursor.execute("exec dbo.PSearch_User @search_keyword = %s , @user_id = %s ", [search_keyword, request_user_id] )
            M_Profile_retrieve = dictfetchall(cursor)

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'zero_Search retrieve  failed'})
    
    finally:
        cursor.close()
    
    print "........................"+ search_type +" Search End #####"
    
    if search_type == "T": #Tag type Search Tag(ST)
        context = ({"M_Cube_retrieve":M_Cube_retrieve, "M_cube_type":"ST", "scroll_seq":0 })
        template = loader.get_template("M_cube.html")
        output = template.render(context, request)
        return HttpResponse(output)
    if search_type == "S": #just for one shell search -- flow tag develope etc .... HD
        context = ({"M_Cube_retrieve":M_Cube_retrieve, "M_cube_type":"SS", "scroll_seq":0 })
        template = loader.get_template("M_cube.html")
        output = template.render(context, request)
        print output
        return HttpResponse(output)
    #elif search_type == "A":
    #    return toJSON(search_result)
    elif search_type == "U":
        context = ({"M_Profile_retrieve": M_Profile_retrieve , "M_profile_type":"L"})
        template = loader.get_template("M_Profile.html")
        output = template.render(context, request)
        return HttpResponse(output)
##############################################################################################3
def zero_nav (request, M_nav_type):
    print "####ZERO_NAV  ..... "

    '''
    M_nav_type
    D : delete
    '''
    request_user_id = request.user.id

    cursor = connection.cursor()
    try:
        if M_nav_type == "create":
            json_data = json.loads(request.body.decode("utf-8"))
            if 'nav_list_JSON' in json_data:
                nav_list_JSON = json_data['nav_list_JSON']
                nav_list_JSON = json.dumps(nav_list_JSON)
            if 'nav' in json_data:
                nav = json_data["nav"]
            else:
                nav = "empty."
            if 'nav_id' in json_data:
                nav_id = json_data["nav_id"]
            else:
                nav_id = 0

            print nav_id

            cursor.execute("exec dbo.PNav_create @nav_id = %s, @nav = %s, @nav_list_JSON = %s, @user_id = %s", [nav_id, nav, nav_list_JSON, request_user_id] )
            #M_nav_retrieve = dictfetchall(cursor) # if data is not exist cursor is closed
        elif M_nav_type == "delete":

            if "nav_id" in request.POST:
                nav_id = request.POST["nav_id"]
            print nav_id, request_user_id
            cursor.execute("exec dbo.PNav_delete @nav_id = %s, @user_id = %s", [nav_id, request_user_id] )

        else:
            cursor.execute("exec dbo.PNav_retrieve @user_id = %s", [request_user_id] )
            M_nav_retrieve = dictfetchall(cursor)

    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'zero_nav  failed'})

    finally:
        cursor.close()

    if M_nav_type == "create":
        result_set = toJSON({'message':'Nav Create successed!!!'})
        return result_set
    elif M_nav_type == "delete":
        result_set = toJSON({'message':'Nav delete successed!!!'})
        return result_set
    else:
        context = ({ "M_nav_retrieve": M_nav_retrieve, "M_nav_type":M_nav_type })
        template = loader.get_template("M_Nav.html")
        output = template.render(context, request)
        return HttpResponse(output)


##############################################################################################
# user cube

def zero_user_cube(request):
    #print 'Zero index page load.........'

    user_id = request.user.id

    cursor = connection.cursor()
    try:
        cursor.execute("exec dbo.PShell_Retrieve_user  %s, null, null  " , [user_id] )
        zero_cube = dictfetchall(cursor)
        cursor.execute("exec dbo.PUser_Retrieve  %s, null , null  " , [user_id] )
        zero_user = dictfetchall(cursor)
    finally:
        cursor.close()

    context = {'zero_cube':zero_cube, 'zero_user':zero_user, 'user_id':user_id }
    return render(request, 'zero_user_cube.html', context)



##############################################################################################3
#shell create Page load

def shell_create(request, create_type, cube_id, shell_id):
    ''' create_type
    C : Create cube?
    N : new cube with flow?

    H : with flow to change conContent
    '''
    
    print '### Z.1 Total create Form......................'

    user_check = request.user
    request_user_id = request.user.id
    
    M_Cube_retrieve = "0"
    M_Shell_retrieve = "0"
    M_shell_type = "R"
    M_cube_type = "R"
    
    cursor = connection.cursor()
    try:
        #print shell_id
        if shell_id != "0":
            cursor.execute("exec dbo.PShell_retrieve @shell_id = %s", [shell_id]);
            M_Shell_retrieve = dictfetchall(cursor)    
        elif cube_id != "0":
            cursor.execute("exec dbo.PCube_retrieve @M_cube_type = %s, @cube_id = %s, @request_user_id = %s ", ["O", cube_id, request_user_id] );
            M_Cube_retrieve = dictfetchall(cursor)
    except Exception as e:
        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'create form failed'})                    
    finally:
        cursor.close()
        
    context= { 'shell_id': shell_id, 'cube_id':cube_id,  'M_Shell_retrieve':M_Shell_retrieve, 'M_Cube_retrieve':M_Cube_retrieve, 'M_shell_type': M_shell_type , 'M_cube_type':M_cube_type ,'create_type':create_type, 'user_check': user_check }
    return render(request, 'zero_shell_create.html', context )
    
    context= { 'M_Shell_retrieve':M_Shell_retrieve, 'M_Cube_retrieve':M_Cube_retrieve, 'M_shell_type': M_shell_type , 'M_cube_type':M_cube_type ,'create_type':create_type, 'user_check': user_check }
    return render(request, 'zero_shell_create.html', context )


# ToTal create
def zero_CRUD (request):
    print '### 2. zero CRUD ...................'
    # when i come back here... i feel so tired.... even the first step of the day.....
    
    #user_id=request.user.id
    
    user_id = request.user.id 

    json_data = json.loads(request.body.decode("utf-8"))
    
    #print json_data
    
    cursor = connection.cursor()
    
    if 'cube_id' not in json_data and 'cube' in json_data:
        
        #print 'cube'
        cube_sql = "exec dbo.PCube_create @user_id = %s, @cube = %s"
        try:
            cursor.execute(cube_sql, [user_id, json_data["cube"]])
            result_cube = dictfetchall(cursor) 
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            cursor.close()
            return toJSON({'status':'cube create failed'})                    
        cube_id = result_cube[0]['cube_id']

    elif 'cube_id' in json_data:
        cube_id = json_data["cube_id"]
    else:
        cube_id = 0

    if 'shell_id' not in json_data and 'con_shell_list' in json_data:
        # shell and con create finished
        con_shell_list = json_data['con_shell_list']
        con_shell_list = json.dumps(con_shell_list)

        #print con_shell_list["hashtags"]
        #print con_shell_list
        
        shell_list_sql = "exec dbo.PShell_create @user_id=%s, @cube_id=%s, @con_shell_list=%s"
        
        #print user_id, cube_id, con_shell_list

        try:
            cursor.execute( shell_list_sql, [user_id, cube_id, con_shell_list])

            print 'after execute'
        except Exception as e:
            print '%s (%s)' % (e.message, type(e))
            cursor.close() 
            return toJSON({'status':'zero_crud - shell create failed'})
        

        #print result_shell_list

        #con_list = toJSON(result_shell_list)

        #print con_list

    cursor.close()       
    
    print '.....................Zero CRUD successed'
    
    result_set = toJSON({'status':'create successed!!!', 'cube_id':cube_id})
    
    return result_set



def zero_con_shell_CRUD (request):
    
    print '....................Zero_connect_shell CRUD'
    cursor = connection.cursor()
    try:
        if request.method == 'POST':
            
            if request.POST['con_shell'] == '':
                return toJSON({'status':'create fail'})
                
            shell = request.POST['con_shell']
            target_shell_id = request.POST['target_id']
            
            #print target_shell_id
            
            cursor.execute("exec dbo.PMain_stream @user_id = %s, @shell_type =  %s, @shell = %s, @target_id = %s" , [1, 'S', shell, target_shell_id] )
            #cursor.execute("exec dbo.PMain_stream @user_id = %s, @shell_type =  %s, @shell = %s" , [1, 'S', shell] ) 
        else:
            print 'error'
    finally:
        cursor.close()
    
    print '....................Zero_connect_shell CRUD Finished...............'
    
    return toJSON({'status':'create success'})


def zero_con_CRUD (request):
    
    
    con_type = 'S';
    
    
    print '....................Zero_addconnect CRUD'
    cursor = connection.cursor()
    try:
        if request.method == 'POST':
            
            #if request.POST['cube_id'] == '' or request.POST['cube_id'] == null:
            #    return toJSON({'status':'create fail'})
                
            cube_id = request.POST['cube_id']
            source_shell_id = request.POST['source_shell_id']
            user_id = request.POST['user_id']
            pre_con_id= request.POST['pre_con_id']
        
            cursor.execute("exec dbo.PMain_stream @user_id=%s, @cube_id=%s,  @con_type=%s, @shell_id=%s, @pre_con_id=%s", [user_id, cube_id, con_type, source_shell_id, pre_con_id]);
            
        else:
            print 'error'
    except Exception as e:

        print '%s (%s)' % (e.message, type(e))
        return toJSON({'status':'create failed'})                    
        
    finally:
        cursor.close()
    
    print '....................Zero_addconnect CRUD Finished...............'
    
    return toJSON({'status':'create success'})


# 1. index view


##############################################################################################3
# 2. create view


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



def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

##############################################################################################
# Template view
def serve_html(request, page):
    return render_to_response(page+".html")

def serve_svg(request, page):
    return render_to_response(page+".svg")

# JSON and serialize
def serialize(objs):
    data=[]
    for obj in objs:
        obj.append(obj.serialize())
    return data
        
def toJSON(objs, status=200):
    j = json.dumps(objs, ensure_ascii=False)
    return HttpResponse(j,content_type='application/json')
    #return HttpResponse(j,status,content_type='application/json,charset=utf-8')