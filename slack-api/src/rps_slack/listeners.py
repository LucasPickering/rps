# Slack API listeners
# This is where the magic happens

import logging
from rps import settings
from slack_bolt import Ack, App, Respond
from slack_bolt.oauth.oauth_settings import OAuthSettings
from .datastores import DjangoInstallationStore, DjangoOAuthStateStore
from pprint import pprint

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
    CREATE_MATCH = "create_match"
    JOIN_MATCH = "join_match"


state = {"kind": "none"}


@app.command("/rps")
def command_rps(ack: Ack, respond: Respond):
    ack()
    respond(
        text="TODO",
        blocks=[
            # TODO add match config
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action_id": Action.CREATE_MATCH,
                        "text": {"type": "plain_text", "text": "Create Match"},
                    }
                ],
            },
        ],
    )


@app.action(Action.CREATE_MATCH)
def action_create_match(ack: Ack, respond: Respond, body):
    pprint(body)
    ack()
    global state
    sender_id = body["user"]["id"]
    state = {"kind": "waiting_for_opponent", "player": sender_id}
    respond(
        text="TODO",
        blocks=[
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"Who wants to throw down with <@{sender_id}>?",
                },
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action_id": Action.JOIN_MATCH,
                        "text": {
                            "type": "plain_text",
                            "text": "Join Match",
                        },
                    }
                ],
            },
        ],
        response_type="in_channel",
        # Replacing original doesn't work with in_channel, so we have to delete
        delete_original=True,
        replace_original=False,
    )


@app.action(Action.JOIN_MATCH)
def action_join_match(ack: Ack, respond: Respond):
    ack()
    respond(text="")
