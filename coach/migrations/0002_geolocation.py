# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-19 15:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coach', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='geoLocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
            ],
        ),
    ]
