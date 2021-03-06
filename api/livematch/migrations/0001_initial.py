# Generated by Django 2.2.5 on 2019-09-19 23:17

import core.util
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LiveGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_num', models.PositiveSmallIntegerField()),
            ],
            options={
                'ordering': ('match_id', 'game_num'),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LiveMatch',
            fields=[
                ('id', models.CharField(default=core.util.get_livematch_id, max_length=32, primary_key=True, serialize=False)),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('config', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.MatchConfig')),
                ('permanent_match', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Match')),
            ],
        ),
        migrations.CreateModel(
            name='LivePlayerMatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_num', models.IntegerField()),
                ('last_activity', models.DateTimeField(auto_now_add=True)),
                ('is_ready', models.BooleanField(default=False)),
                ('move', models.CharField(blank=True, choices=[('rock', 'rock'), ('paper', 'paper'), ('scissors', 'scissors'), ('lizard', 'lizard'), ('spock', 'spock')], max_length=20)),
                ('accepted_rematch', models.BooleanField(default=False)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='livematch.LiveMatch')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Player')),
            ],
            options={
                'ordering': ('player_num',),
                'abstract': False,
                'unique_together': {('player_num', 'match'), ('player', 'match')},
            },
        ),
        migrations.CreateModel(
            name='LivePlayerGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_num', models.IntegerField()),
                ('move', models.CharField(choices=[('rock', 'rock'), ('paper', 'paper'), ('scissors', 'scissors'), ('lizard', 'lizard'), ('spock', 'spock')], max_length=20)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='livematch.LiveGame')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Player')),
            ],
            options={
                'ordering': ('player_num',),
                'abstract': False,
                'unique_together': {('player_num', 'game'), ('player', 'game')},
            },
        ),
        migrations.AddField(
            model_name='livematch',
            name='players',
            field=models.ManyToManyField(related_name='live_matches', through='livematch.LivePlayerMatch', to='core.Player'),
        ),
        migrations.AddField(
            model_name='livematch',
            name='rematch',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='parent', to='livematch.LiveMatch'),
        ),
        migrations.AddField(
            model_name='livegame',
            name='match',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games', to='livematch.LiveMatch'),
        ),
        migrations.AddField(
            model_name='livegame',
            name='players',
            field=models.ManyToManyField(through='livematch.LivePlayerGame', to='core.Player'),
        ),
        migrations.AddField(
            model_name='livegame',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='livegame_wins', to='core.Player'),
        ),
        migrations.AlterUniqueTogether(
            name='livegame',
            unique_together={('game_num', 'match')},
        ),
    ]
