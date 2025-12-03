
package com.aunucloud.webhook;

import java.net.*;
import java.io.*;
import org.json.JSONObject;

public class DiscordWebhookWorker {

    private final String webhookUrl;

    public DiscordWebhookWorker(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    public void sendPaymentNotification(String title, String description) throws IOException {
        if (webhookUrl == null || webhookUrl.isEmpty()) return;

        JSONObject embed = new JSONObject();
        embed.put("title", title);
        embed.put("description", description);
        embed.put("color", 0x22d3ee);

        JSONObject body = new JSONObject();
        body.put("embeds", new org.json.JSONArray().put(embed));

        HttpURLConnection conn = (HttpURLConnection) new URL(webhookUrl).openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.toString().getBytes());
        }

        int status = conn.getResponseCode();
        System.out.println("Discord webhook status: " + status);
    }
}
