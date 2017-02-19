# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('intershell', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='con',
            old_name='shell_id',
            new_name='target_id',
        ),
        migrations.AddField(
            model_name='cube',
            name='user',
            field=models.ForeignKey(default=1, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
