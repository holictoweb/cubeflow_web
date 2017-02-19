# -*- coding: utf-8 -*-

from django.db import models

#user 정보를 가져 오기 위한 
from django.contrib.auth.models import User

# Create your models here.

#django form class
from django import forms

"""
class ShellForm(forms.Form):
    shell = forms.TextField(label='Shell')
"""


class core (models.Model):
    shell_id = models.IntegerField(null=False, primary_key=True, default=0 , db_index = True)
    shell_type = models.CharField(max_length=10, null=False , default='' )
    shell = models.TextField(default='')
    user = models.ForeignKey(User)
    create_dt = models.DateTimeField(auto_now_add=True,null=False)
    
    #admin display 
    def __unicode__(self):
        return "%s"%(self.shell_id,)
    

class cube ( models.Model):
    cube_id = models.IntegerField(null=False, primary_key=True, default=0 , db_index = True)
    cube_type = models.CharField(max_length=10, null=False , default='' )
    cube = models.TextField(default='', null=True)
    user = models.ForeignKey(User) 
    create_dt = models.DateTimeField(auto_now_add=True, null=False)

    
class con (models.Model):
    con_id = models.IntegerField (null=False, primary_key=True, db_index = True)
    con_type = models.CharField ( max_length = 10, null=False )
    pre_con_id = models.IntegerField(null = True)
    next_con_id = models.IntegerField(null = True)
    target_id = models.IntegerField(default = 0, null = True)
    cube_id = models.IntegerField(default = 0, null = True) 
    user = models.ForeignKey(User)
    create_dt = models.DateTimeField(auto_now_add=True, null=False)
    
    def __unicode__(self):
        return "%s"%(self.con_id,)

class sum (models.Model):
    sum_id = models.IntegerField (null=False, primary_key=True, db_index = True)
    sum_type = models.CharField ( max_length = 10, null=False )
    summary = models.CharField ( max_length = 20, null=False )
    target_id = models.IntegerField(default = 0, null = True)
    target_type = models.CharField ( max_length = 10, null=False )
    update_dt = models.DateTimeField(auto_now_add=True, null=False)

class ex (models.Model):
    extend = models.CharField(primary_key = True, null=False, db_index = True, max_length = 100)
    ex_type = models.CharField(primary_key = True, null=False, db_index = True, max_length = 10)
    ex_id = models.IntegerField(primary_key = True, null=False, db_index = True)
    cube_id = models.IntegerField(default = 0, null = True)
    con_id = models.IntegerField(default = 0, null = True)
    shell_id = models.IntegerField(default = 0, null = True)
    user_id = models.IntegerField(default = 0, null = True)
    create_dt = models.DateTimeField(auto_now_add=True, null=False)
    
    def __unicode__(self):
        return "%s"%(self.ex_id,)

class profile (models.Model):
    user_id = models.IntegerField(primary_key = True, null=False, db_index = True)
    profile_id = models.IntegerField(primary_key = True, null=False, db_index = True)
    con_count = models.IntegerField(default = 0, null = True)
    cube_count = models.IntegerField(default = 0, null = True)
    flow_count = models.IntegerField(default = 0, null = True)
    update_dt = models.DateTimeField(auto_now_add=True, null=False)

class connect (models.Model):
    source_id = models.IntegerField(primary_key = True, null=False)
    connect_id = models.IntegerField(primary_key = True, null=False)
    connect_type = models.CharField(max_length = 10)
    target_id = models.IntegerField(default = 0, null = True)
    create_dt = models.DateTimeField(auto_now_add=True, null=False)
    
class sequence (models.Model):
    seq_id = models.IntegerField(primary_key = True, null=False)
    seq_type = models.CharField(max_length = 10 )
    seq = models.IntegerField()
    
    def __unicode__(self):
        return "%s"%(self.seq_type,)
    
class TVP_shell_con_list (models.Model):
    con_id = models.IntegerField (null=True)
    shell_id = models.IntegerField (null=True)
    list_type = models.CharField(null=True, max_length = 10 )
    
    
class TVP_shell_list (models.Model):
    shell = models.TextField(default='', null=True)
