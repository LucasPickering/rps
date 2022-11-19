# Generated by Django 4.1.3 on 2022-11-19 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SlackBot",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("client_id", models.CharField(max_length=32)),
                ("app_id", models.CharField(max_length=32)),
                ("enterprise_id", models.CharField(max_length=32, null=True)),
                ("enterprise_name", models.TextField(null=True)),
                ("team_id", models.CharField(max_length=32, null=True)),
                ("team_name", models.TextField(null=True)),
                ("bot_token", models.TextField(null=True)),
                ("bot_refresh_token", models.TextField(null=True)),
                ("bot_token_expires_at", models.DateTimeField(null=True)),
                ("bot_id", models.CharField(max_length=32, null=True)),
                ("bot_user_id", models.CharField(max_length=32, null=True)),
                ("bot_scopes", models.TextField(null=True)),
                ("is_enterprise_install", models.BooleanField(null=True)),
                ("installed_at", models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name="SlackInstallation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("client_id", models.CharField(max_length=32)),
                ("app_id", models.CharField(max_length=32)),
                ("enterprise_id", models.CharField(max_length=32, null=True)),
                ("enterprise_name", models.TextField(null=True)),
                ("enterprise_url", models.TextField(null=True)),
                ("team_id", models.CharField(max_length=32, null=True)),
                ("team_name", models.TextField(null=True)),
                ("bot_token", models.TextField(null=True)),
                ("bot_refresh_token", models.TextField(null=True)),
                ("bot_token_expires_at", models.DateTimeField(null=True)),
                ("bot_id", models.CharField(max_length=32, null=True)),
                ("bot_user_id", models.TextField(null=True)),
                ("bot_scopes", models.TextField(null=True)),
                ("user_id", models.CharField(max_length=32)),
                ("user_token", models.TextField(null=True)),
                ("user_refresh_token", models.TextField(null=True)),
                ("user_token_expires_at", models.DateTimeField(null=True)),
                ("user_scopes", models.TextField(null=True)),
                ("incoming_webhook_url", models.TextField(null=True)),
                ("incoming_webhook_channel", models.TextField(null=True)),
                ("incoming_webhook_channel_id", models.TextField(null=True)),
                (
                    "incoming_webhook_configuration_url",
                    models.TextField(null=True),
                ),
                ("is_enterprise_install", models.BooleanField(null=True)),
                ("token_type", models.CharField(max_length=32, null=True)),
                ("installed_at", models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name="SlackOAuthState",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("state", models.CharField(max_length=64)),
                ("expire_at", models.DateTimeField()),
            ],
        ),
        migrations.AddIndex(
            model_name="slackinstallation",
            index=models.Index(
                fields=[
                    "client_id",
                    "enterprise_id",
                    "team_id",
                    "user_id",
                    "installed_at",
                ],
                name="rps_slack_s_client__8e3166_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="slackbot",
            index=models.Index(
                fields=[
                    "client_id",
                    "enterprise_id",
                    "team_id",
                    "installed_at",
                ],
                name="rps_slack_s_client__d5302d_idx",
            ),
        ),
    ]
