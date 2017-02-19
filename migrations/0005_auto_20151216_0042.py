# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('intershell', '0004_auto_20151028_1429'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cube',
            name='cube',
            field=models.TextField(default=b'', null=True),
        ),
    ]
