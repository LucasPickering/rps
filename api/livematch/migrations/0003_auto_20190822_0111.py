# Generated by Django 2.2.4 on 2019-08-22 01:11

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('livematch', '0002_liveplayermatch_is_ready'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='liveplayermatch',
            name='connections',
        ),
        migrations.AddField(
            model_name='liveplayermatch',
            name='last_activity',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]