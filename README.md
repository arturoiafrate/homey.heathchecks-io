# Healthchecks

Unofficial [Healthchecks.io](https://healthchecks.io/) integration for Homey Pro.
This integration allows you to verify internet connectivity by periodically invoking the ping (or heartbeat) URL provided by the [Healthchecks.io](https://healthchecks.io/) service.

## How does the service works?
- Healthchecks.io monitors your scheduled tasks by providing unique URLs (also known as "ping" or "heartbeat" URLs) for each task. When your task runs successfully, it sends an HTTP request (a "ping") to the corresponding URL. Healthchecks.io then records the time and date of the received ping.
- If Healthchecks.io does not receive a ping within the expected time frame, it considers the task as potentially failed or delayed. The service can send alerts to various channels, such as email, Slack, SMS, Telegram, etc. to notify you about the issue.

## How does the integration works?
- Register to the healthchecks.io website, create a new project and setup integrations (eg. email or telegram). Then click "Add check", give a name (eg. Homey) and a schedule (for example, 30 mins period with 5 mins of grace time).
- A new URL should appear, take a note of the uuid (the second part of the url)
- Install the app on the Homey Pro, then add a new device. "HealthChecks" device sensor should appear.
- Click on the added device, then go to settings. Configure the uuid and the polling interval. You can also "press the button" to do an instant connectivity check. The sensor will be active if the connectivity isn't working.

### Attributions
- [Network icons created by Kiranshastry - Flaticon](https://www.flaticon.com/free-icons/network)
- [App Images from vecstock - Freepik](https://it.freepik.com/foto-gratuito/design-futuristico-della-tecnologia-del-circuito-blu-incandescente-generato-dall-intelligenza-artificiale_42191578.htm#query=internet&position=19&from_view=search&track=ais_ai_generated)
- [Driver Images from Freepik](https://it.freepik.com/vettori-gratuito/i-dispositivi-collegati-al-cloud_759905.htm#page=4&query=pc%20to%20cloud&position=45&from_view=search&track=ais)