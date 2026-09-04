package com.srm.companion;

import android.app.Notification;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import org.json.JSONObject;

import java.util.UUID;

public class WANotificationScraperService extends NotificationListenerService {
    private static final String TAG = "WANotificationScraper";

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        Log.d(TAG, "🟢 OneSRM WhatsApp Notification Scraper Service Connected");
    }

    @Override
    public void onListenerDisconnected() {
        super.onListenerDisconnected();
        Log.d(TAG, "🔴 OneSRM WhatsApp Notification Scraper Service Disconnected");
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;
        String pkg = sbn.getPackageName();
        if (!"com.whatsapp".equals(pkg) && !"com.whatsapp.w4b".equals(pkg)) {
            return;
        }

        Notification notification = sbn.getNotification();
        if (notification == null) return;

        Bundle extras = notification.extras;
        if (extras == null) return;

        try {
            // Extract fields
            CharSequence convTitle = extras.getCharSequence(Notification.EXTRA_CONVERSATION_TITLE);
            CharSequence title = extras.getCharSequence(Notification.EXTRA_TITLE);
            CharSequence subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT);
            CharSequence text = extras.getCharSequence(Notification.EXTRA_TEXT);
            CharSequence bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT);
            CharSequence[] textLines = extras.getCharSequenceArray(Notification.EXTRA_TEXT_LINES);

            // Filter out system or call notifications
            if (extras.containsKey(Notification.EXTRA_CALL_TYPE)) return;

            String groupName = "";
            String sender = "";
            String messageText = "";

            if (bigText != null && bigText.length() > 0) {
                messageText = bigText.toString();
            } else if (text != null && text.length() > 0) {
                messageText = text.toString();
            }

            // Identify Group vs Direct Chat
            if (convTitle != null && convTitle.length() > 0) {
                // Typical WhatsApp Group structure:
                // EXTRA_CONVERSATION_TITLE = "Group Name"
                // EXTRA_TITLE = "Sender Name"
                groupName = convTitle.toString();
                sender = (title != null) ? title.toString() : "Member";
            } else if (subText != null && subText.length() > 0) {
                groupName = subText.toString();
                sender = (title != null) ? title.toString() : "Member";
            } else {
                // Could be group or direct message
                String tStr = (title != null) ? title.toString() : "WhatsApp";
                if (tStr.contains(":")) {
                    String[] parts = tStr.split(":", 2);
                    groupName = parts[0].trim();
                    sender = parts[1].trim();
                } else {
                    groupName = tStr;
                    sender = tStr;
                }
            }

            // Check if text has "Sender: Message" prefix format (common in Android multi-message bundles)
            if (messageText.contains(":") && messageText.indexOf(':') < 28) {
                int colonIdx = messageText.indexOf(':');
                String possibleSender = messageText.substring(0, colonIdx).trim();
                String actualMsg = messageText.substring(colonIdx + 1).trim();
                if (!possibleSender.isEmpty() && actualMsg.length() > 0) {
                    if (sender.equals(groupName) || sender.equals("Member")) {
                        sender = possibleSender;
                    }
                    messageText = actualMsg;
                }
            }

            // Clean message formatting
            messageText = messageText.replaceAll("[\\u200B-\\u200D\\uFEFF]", "").trim();
            if (messageText.isEmpty() || messageText.length() < 2) return;

            // Filter out spam / uninformative noise
            if (messageText.matches("(?i).*(\\d+\\s+new\\s+messages?|messages?\\s+and\\s+calls?\\s+are\\s+end-to-end|deleted\\s+this\\s+message|<media omitted>).*")) {
                return;
            }

            // Check if group is monitored or has academic keywords
            if (!WAScraperStore.isGroupMonitored(this, groupName, messageText)) {
                return;
            }

            long postTime = sbn.getPostTime() > 0 ? sbn.getPostTime() : System.currentTimeMillis();
            String academicCategory = WAScraperStore.classifyAcademicIntent(messageText);

            JSONObject msgObj = new JSONObject();
            msgObj.put("id", "wa_" + UUID.randomUUID().toString().substring(0, 8));
            msgObj.put("group", groupName);
            msgObj.put("sender", sender);
            msgObj.put("text", messageText);
            msgObj.put("timestamp", postTime);
            msgObj.put("academicCategory", academicCategory);
            msgObj.put("source", "native_notification");

            Log.d(TAG, " Captured WA Academic Message from [" + groupName + "] by [" + sender + "]: " + messageText);

            // 1. Store in SharedPreferences
            WAScraperStore.addMessage(this, msgObj);

            // 2. Dispatch live to WebView via Plugin if app is open
            WAScraperPlugin.onIncomingMessage(msgObj);

        } catch (Exception e) {
            Log.e(TAG, "Error parsing WhatsApp notification", e);
        }
    }
}
