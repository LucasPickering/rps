# Slack API listeners
# This is where the magic happens

import logging
from rps import settings
from slack_bolt import App
from slack_bolt.oauth.oauth_settings import OAuthSettings
from .datastores import DjangoInstallationStore, DjangoOAuthStateStore

logger = logging.getLogger(__name__)
app = App(
    signing_secret=settings.SLACK_SIGNING_SECRET,
    oauth_settings=OAuthSettings(
        client_id=settings.SLACK_CLIENT_ID,
        client_secret=settings.SLACK_CLIENT_SECRET,
        scopes=settings.SLACK_SCOPES,
        user_scopes=settings.SLACK_USER_SCOPES,
        installation_store=DjangoInstallationStore(
            client_id=settings.SLACK_CLIENT_ID,
            logger=logger,
        ),
        state_store=DjangoOAuthStateStore(
            expiration_seconds=120,
            logger=logger,
        ),
    ),
)


class Action:
    JOIN_MATCH = "join_match"


@app.command("/rps")
def command_rps(ack, respond, command):
    ack()
    print(command)
    respond(
        text="TODO",
        blocks=[
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": "Do you wanna throw down?"},
            },
            {"type": "divider"},
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action_id": Action.JOIN_MATCH,
                        "text": {"type": "plain_text", "text": "Join"},
                    }
                ],
            },
        ],
    )


@app.action(Action.JOIN_MATCH)
def action_join_match(ack, body, logger):
    ack()
    print(body)
