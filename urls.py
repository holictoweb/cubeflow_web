"""holic URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin


from intershell import views
from intershell import zero_views

urlpatterns = [
 
    url(r'^$', views.intershell_index, name='intershell_index'),
    url(r'zero/$', zero_views.zero_index, name='zero_index'),
    
    url(r'join/$', zero_views.zero_join, name='zero_join'),
    url(r'join/control', zero_views.zero_join_control, name='zero_join_control'),

    url(r'login/$', zero_views.zero_login, name='zero_login'),
    url(r'login/control', zero_views.zero_default_auth, name='zero_default_auth'),

    url(r'zero/create/(?P<create_type>\w{1,50})/(?P<cube_id>\d+)/(?P<shell_id>\d+)/$', zero_views.shell_create, name='shell_create'),
    url(r'zero/createCRUD/$', zero_views.zero_CRUD, name='zero_create'),
    
    url(r'zero/connect/(?P<M_connect_type>\w{1,50})/$', zero_views.zero_connect, name = 'zero_connect'),
    
    url(r'zero/search/$', zero_views.zero_search, name='zero_search'),

    url(r'zero/nav/(?P<M_nav_type>\w{1,50})/$', zero_views.zero_nav, name='zero_nav'),
    
    url(r'zero/cube/(?P<M_cube_type>\w{1,50})/(?P<target_id>\d+)/$', zero_views.zero_cube, name='zero_cube'),
    url(r'zero/shell/(?P<M_shell_type>\w{1,50})/$', zero_views.zero_shell, name='zero_shell'),
    
    url(r'zero/flow/(?P<M_flow_type>\w{1,50})/(?P<cube_id>\d+)/(?P<shell_id>\d+)/$', zero_views.zero_flow, name='zero_flow'),
    url(r'zero/hash/(?P<M_hash_type>\w{1,50})/$', zero_views.zero_hash, name='zero_hash'),

    url(r'zero/extend/(?P<M_extend_type>\w{1,50})/$', zero_views.zero_extend, name='zero_extend'),

    
    url(r'test', views.intershell_index, name='intershell_index'),
    url(r'api/retrieve/$', views.intershell_retrieve, name='intershell_retrieve'),

    url(r'zero/profile/(?P<M_profile_type>\w{1,50})/(?P<user_id>\d+)/$', zero_views.zero_profile, name='zero_profile'),
    
    url(r'zero/hoveruser/', zero_views.zero_hover_user, name='zero_hover_user'),
    
    url(r'zero/session', zero_views.zero_session, name='zero_session'),    
    
    #for test 
    url(r'zero/flowt/(?P<M_flow_type>\w{1,50})/(?P<cube_id>\d+)/(?P<shell_id>\d+)/$', zero_views.zero_flow_T, name = 'zero_flow_T'),

    url(r'zero/con', zero_views.zero_con_shell_CRUD, name='zero_con_shell_create'),
    url(r'zero/addcon', zero_views.zero_con_CRUD, name='zero_con_create'),

    #url(r'zero/cubeD/$', zero_views.zero_cube, name = 'zero_cubeD'),
    url(r'zero/usercube', zero_views.zero_user_cube, name='zero_user_cube'),
    
    url(r'html/(?P<page>\w+).html$', zero_views.serve_html),

    # url(r'api/retrieve/(?P<user_id>\d+)/$', views.intershell_retrieve, name='intershell_retrieve' ),
    # url(r'api/retrieve/?user_id=2/$', views.intershell_retrieve_test, name='intershell_retrieve_test' ),
    
    #url(r'(?P<shell_id>\d+)/$',views.intershell_CRUD, name='create'),
    #url(r'(?P<shell_id>\d+)/$',views.intershell_CRUD, name='create'),

]

"""

    cube url
    url(r'zero/cube/(?P<cube_id>\w{0,50})/$', zero_views.zero_cube, name = 'zero_cube'),
    url(r'zero/cubedetail/(?P<cube>\w{1,50})/$', zero_views.zero_cube, name = 'zero_cube'),
    
    url(r'^api/timeline/?P<num>\d+/$', message_view),
    url(r'^api/timeline/?P<num>\d+/$', message_delete_view),
    
    url(r'^api/user/(?P<method>create/$', user_view),
    url(r'^api/user/(?P<method>update/$', user_view),
    url(r'^api/user/(?P<method>list/$', user_view),
    """
