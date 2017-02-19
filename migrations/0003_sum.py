# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('intershell', '0002_auto_20151028_1339'),
    ]

    operations = [
        migrations.CreateModel(
            name='sum',
            fields=[
                ('sum_id', models.IntegerField(serialize=False, primary_key=True, db_index=True)),
                ('target_id', models.IntegerField(default=0, null=True)),
                ('sum_type', models.CharField(max_length=10)),
                ('summary', models.IntegerField(default=0, null=True)),
                ('update_dt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
