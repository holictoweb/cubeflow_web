# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('intershell', '0003_sum'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='core',
            name='con_count',
        ),
        migrations.RemoveField(
            model_name='cube',
            name='shell_count',
        ),
        migrations.AddField(
            model_name='sum',
            name='target_type',
            field=models.CharField(default='C', max_length=10),
            preserve_default=False,
        ),
    ]
