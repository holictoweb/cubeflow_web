# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='con',
            fields=[
                ('con_id', models.IntegerField(serialize=False, primary_key=True, db_index=True)),
                ('con_type', models.CharField(max_length=10)),
                ('pre_con_id', models.IntegerField(null=True)),
                ('next_con_id', models.IntegerField(null=True)),
                ('shell_id', models.IntegerField(default=0, null=True)),
                ('cube_id', models.IntegerField(default=0, null=True)),
                ('create_dt', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='core',
            fields=[
                ('shell_id', models.IntegerField(default=0, serialize=False, primary_key=True, db_index=True)),
                ('shell_type', models.CharField(default=b'', max_length=10)),
                ('shell', models.TextField(default=b'')),
                ('con_count', models.IntegerField(default=0, null=True)),
                ('create_dt', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='cube',
            fields=[
                ('cube_id', models.IntegerField(default=0, serialize=False, primary_key=True, db_index=True)),
                ('cube_type', models.CharField(default=b'', max_length=10)),
                ('cube', models.TextField(default=b'')),
                ('shell_count', models.IntegerField(default=0, null=True)),
                ('create_dt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ex',
            fields=[
                ('ex_id', models.IntegerField(serialize=False, primary_key=True, db_index=True)),
                ('ex_type', models.CharField(max_length=10)),
                ('extend', models.CharField(max_length=100)),
                ('shell_id', models.IntegerField(default=0, null=True)),
                ('con_id', models.IntegerField(default=0, null=True)),
                ('create_dt', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='sequence',
            fields=[
                ('seq_id', models.IntegerField(serialize=False, primary_key=True)),
                ('seq_type', models.CharField(max_length=10)),
                ('seq', models.IntegerField()),
            ],
        ),
    ]
