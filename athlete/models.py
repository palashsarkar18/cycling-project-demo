from __future__ import unicode_literals
from django.contrib.postgres.fields import JSONField
from django.db import models

# Create your models here.

class gpx_file(models.Model):
	docfile = models.FileField(upload_to='gpx/')

class gpx_dataObj(models.Model):
	filename = models.CharField(max_length=50, null = True)
	data_json = JSONField()

class geoLocation(models.Model):
	latitude = models.DecimalField(max_digits=9, decimal_places=6) 
	longitude = models.DecimalField(max_digits=9, decimal_places=6)

class csvData(models.Model):
	filename = models.CharField(max_length=50, null = True)
	data_json = JSONField()