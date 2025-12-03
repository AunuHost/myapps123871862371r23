
export async function sendDiscordWebhook(payload: {
  title: string;
  description: string;
  color?: number;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: payload.title,
          description: payload.description,
          color: payload.color ?? 0x22d3ee
        }
      ]
    })
  });
}
