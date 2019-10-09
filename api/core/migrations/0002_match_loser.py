# Generated by Django 2.2.6 on 2019-10-09 21:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [("core", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="match",
            name="loser",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="match_losses",
                to="core.Player",
            ),
            preserve_default=False,
        )
    ]
