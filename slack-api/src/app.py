import os
from slack_bolt import App

app = App(
    token=os.environ.get("SLACK_BOT_TOKEN"),
    signing_secret=os.environ.get("SLACK_SIGNING_SECRET"),
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


# Start your app
if __name__ == "__main__":
    app.start(port=int(os.environ.get("PORT", 3000)))
