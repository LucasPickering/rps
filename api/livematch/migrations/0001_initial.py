# Generated by Django 2.2.3 on 2019-07-30 01:39

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
            name='LiveMatch',
            fields=[
                ('id', models.CharField(max_length=32, primary_key=True, serialize=False)),
                ('start_time', models.DateField(auto_now=True)),
                ('move1', models.CharField(choices=[('ROCK', 'ROCK'), ('PAPER', 'PAPER'), ('SCISSORS', 'SCISSORS'), ('LIZARD', 'LIZARD'), ('SPOCK', 'SPOCK')], max_length=20, null=True)),
                ('move2', models.CharField(choices=[('ROCK', 'ROCK'), ('PAPER', 'PAPER'), ('SCISSORS', 'SCISSORS'), ('LIZARD', 'LIZARD'), ('SPOCK', 'SPOCK')], max_length=20, null=True)),
                ('player1', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='games_as_p1', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='games_as_p2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
