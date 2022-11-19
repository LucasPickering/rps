# Slack API listeners
# This is where the magic happens

import logging
from typing import Any, Dict
from core.models import LiveMatch, MatchConfig, Player
from core.util import Move
from rps import settings
from slack_bolt import Ack, App, Respond
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
    CREATE_MATCH = "create_match"
    JOIN_MATCH = "join_match"
    APPLY_MOVE = "apply_move"


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
def action_create_match(ack: Ack, respond: Respond, body: Dict[str, Any]):
    ack()

    # Create the match
    try:
        player = Player.objects.get_player(body["user"])
        # TODO make this configurable
        config = MatchConfig.objects.create(
            best_of=3,
            extended_mode=False,
        )
        live_match = LiveMatch.objects.create(config=config)
        live_match.player_join(player)

        respond(
            text="TODO",
            blocks=[
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Who wants to throw down with"
                        f" {player.slack_mention()}?",
                    },
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "style": "primary",
                            "action_id": Action.JOIN_MATCH,
                            # Action value is the ID of the match to join
                            "value": live_match.id,
                            "text": {
                                "type": "plain_text",
                                "text": "Join Match",
                            },
                        }
                    ],
                },
            ],
            response_type="in_channel",
            # Replacing original doesn't work with in_channel
            delete_original=True,
            replace_original=False,
        )
    except Exception as e:
        logger.error("Error creating match:", e)


@app.action(Action.JOIN_MATCH)
def action_join_match(
    ack: Ack, respond: Respond, body: Dict[str, Any], payload: Dict[str, Any]
):
    ack()
    try:
        player = Player.objects.get_player(body["user"])
        # Action value should be the ID of the match we're joining
        live_match = LiveMatch.objects.get(id=payload["value"])
        live_match.player_join(player)

        respond(
            text="TODO",
            blocks=[
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "What do you want to throw against "
                        f"{player.slack_mention()}?",
                    },
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "action_id": Action.APPLY_MOVE,
                            "text": {"type": "plain_text", "text": "🪨"},
                            "value": Move.ROCK.value,
                        },
                        {
                            "type": "button",
                            "action_id": Action.APPLY_MOVE,
                            "text": {"type": "plain_text", "text": "📄"},
                            "value": Move.PAPER.value,
                        },
                        {
                            "type": "button",
                            "action_id": Action.APPLY_MOVE,
                            "text": {"type": "plain_text", "text": "✂️"},
                            "value": Move.SCISSORS.value,
                        },
                    ],
                },
            ],
        )
    except Exception as e:
        logger.error("Error joining match:", e)


@app.action(Action.APPLY_MOVE)
def action_apply_move(
    ack: Ack, respond: Respond, body: Dict[str, Any], payload: Dict[str, Any]
):
    ack()
    try:
        player = Player.objects.get_player(body["user"])
        move = payload["value"]
        respond(text=f"{player.slack_mention()} threw {move}")
    except Exception as e:
        logger.error("Error applying move:", e)
