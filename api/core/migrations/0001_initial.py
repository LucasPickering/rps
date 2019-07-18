# Generated by Django 2.2.3 on 2019-07-18 01:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='UserMove',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('move', models.CharField(choices=[('rock', 'rock'), ('paper', 'paper'), ('scissors', 'scissors'), ('lizard', 'lizard'), ('spock', 'spock')], max_length=20)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Game')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('duration', models.PositiveIntegerField()),
                ('best_of', models.PositiveSmallIntegerField()),
                ('players', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='match_wins', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='match',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Match'),
        ),
        migrations.AddField(
            model_name='game',
            name='players',
            field=models.ManyToManyField(through='core.UserMove', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='game',
            name='winner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='game_wins', to=settings.AUTH_USER_MODEL),
        ),
    ]
