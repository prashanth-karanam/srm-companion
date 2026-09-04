package com.srm.companion;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class WAScraperStore {
    private static final String PREF_NAME = "srm_wa_scraped_store";
    private static final String KEY_MESSAGES = "scraped_messages_json";
    private static final String KEY_KEYWORDS = "monitored_keywords";
    private static final int MAX_STORED_MESSAGES = 120;

    private static final String[] DEFAULT_KEYWORDS = {
        "p1", "p-1", "ah1", "section", "class", "srm", "official",
        "pps", "calculus", "physics", "chemistry", "matlab", "lab",
        "notice", "announcement", "cr", "coordinator"
    };

    public static synchronized void addMessage(Context context, JSONObject message) {
        if (context == null || message == null) return;
        try {
            JSONArray arr = getMessages(context);
            String newText = message.optString("text", "").trim().toLowerCase();
            String newSender = message.optString("sender", "").trim().toLowerCase();
            String newGroup = message.optString("group", "").trim().toLowerCase();

            // Deduplication: prevent duplicate alerts for same message in 10 minutes
            for (int i = 0; i < arr.length(); i++) {
                JSONObject existing = arr.optJSONObject(i);
                if (existing != null) {
                    String exText = existing.optString("text", "").trim().toLowerCase();
                    String exGroup = existing.optString("group", "").trim().toLowerCase();
                    long timeDiff = Math.abs(message.optLong("timestamp", 0) - existing.optLong("timestamp", 0));
                    if (exText.equals(newText) && exGroup.equals(newGroup) && timeDiff < 600000) {
                        return; // Already recorded
                    }
                }
            }

            // Prepend newest message
            JSONArray updated = new JSONArray();
            updated.put(message);
            int count = Math.min(arr.length(), MAX_STORED_MESSAGES - 1);
            for (int i = 0; i < count; i++) {
                updated.put(arr.get(i));
            }

            SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
            sp.edit().putString(KEY_MESSAGES, updated.toString()).apply();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static synchronized JSONArray getMessages(Context context) {
        if (context == null) return new JSONArray();
        SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String raw = sp.getString(KEY_MESSAGES, "[]");
        try {
            return new JSONArray(raw);
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    public static synchronized void clearMessages(Context context) {
        if (context == null) return;
        SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        sp.edit().putString(KEY_MESSAGES, "[]").apply();
    }

    public static Set<String> getMonitoredKeywords(Context context) {
        if (context == null) return new HashSet<>(Arrays.asList(DEFAULT_KEYWORDS));
        SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        Set<String> saved = sp.getStringSet(KEY_KEYWORDS, null);
        if (saved == null || saved.isEmpty()) {
            return new HashSet<>(Arrays.asList(DEFAULT_KEYWORDS));
        }
        return saved;
    }

    public static void setMonitoredKeywords(Context context, List<String> keywords) {
        if (context == null || keywords == null) return;
        SharedPreferences sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        Set<String> set = new HashSet<>();
        for (String kw : keywords) {
            if (kw != null && !kw.trim().isEmpty()) {
                set.add(kw.trim().toLowerCase());
            }
        }
        sp.edit().putStringSet(KEY_KEYWORDS, set).apply();
    }

    public static boolean isGroupMonitored(Context context, String groupName, String messageText) {
        if (groupName == null) groupName = "";
        if (messageText == null) messageText = "";
        String gLow = groupName.toLowerCase();
        String mLow = messageText.toLowerCase();

        Set<String> keywords = getMonitoredKeywords(context);
        for (String kw : keywords) {
            if (gLow.contains(kw)) {
                return true;
            }
        }

        // Always capture if it clearly contains high-priority academic instructions
        if (mLow.contains("day order") || mLow.contains("day 1") || mLow.contains("day 2") ||
            mLow.contains("day 3") || mLow.contains("day 4") || mLow.contains("day 5") ||
            mLow.contains("holiday declared") || mLow.contains("class cancelled") ||
            mLow.contains("lab cancelled") || mLow.contains("free hour") ||
            mLow.contains("assignment submission") || mLow.contains("cla portion")) {
            return true;
        }

        return false;
    }

    public static String classifyAcademicIntent(String text) {
        if (text == null) return "General";
        String low = text.toLowerCase();
        if (low.contains("day order") || low.contains("follow day") || low.contains("tomorrow is day") || low.contains("holiday")) {
            return "DayOrder";
        }
        if (low.contains("cancel") || low.contains("no class") || low.contains("free hour") || low.contains("postponed") || low.contains("rescheduled")) {
            return "Cancelled";
        }
        if (low.contains("assignment") || low.contains("submit") || low.contains("deadline") || low.contains("homework") || low.contains("record") || low.contains("observation")) {
            return "Assignment";
        }
        if (low.contains("cla") || low.contains("exam") || low.contains("portion") || low.contains("quiz") || low.contains("syllabus") || low.contains("unit")) {
            return "Exam";
        }
        if (low.contains("ub") || low.contains("tp") || low.contains("room") || low.contains("venue") || low.contains("lab")) {
            return "Venue";
        }
        return "General";
    }
}
