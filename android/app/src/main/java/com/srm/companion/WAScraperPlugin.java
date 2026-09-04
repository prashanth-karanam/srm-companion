package com.srm.companion;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(name = "WAScraper")
public class WAScraperPlugin extends Plugin {
    private static final String TAG = "WAScraperPlugin";
    private static WAScraperPlugin instance;
    private static JSObject pendingSharedData = null;

    @Override
    public void load() {
        super.load();
        instance = this;
        Log.d(TAG, "🟢 WAScraperPlugin initialized");

        // Inspect initial intent for shared WhatsApp text/files
        if (getActivity() != null && getActivity().getIntent() != null) {
            handleIncomingIntent(getActivity().getIntent());
        }
    }

    public static synchronized void onIncomingMessage(JSONObject msgObj) {
        if (instance == null || msgObj == null) return;
        try {
            final JSObject jsObj = JSObject.fromJSONObject(msgObj);
            new Handler(Looper.getMainLooper()).post(() -> {
                try {
                    instance.notifyListeners("onWAMessage", jsObj);
                } catch (Exception e) {
                    Log.e(TAG, "Error emitting onWAMessage", e);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error converting message JSON", e);
        }
    }

    @PluginMethod
    public void checkStatus(PluginCall call) {
        Context ctx = getContext();
        boolean isEnabled = isNotificationAccessGranted(ctx);
        JSONArray msgs = WAScraperStore.getMessages(ctx);
        Set<String> kws = WAScraperStore.getMonitoredKeywords(ctx);

        JSObject res = new JSObject();
        res.put("enabled", isEnabled);
        res.put("messageCount", msgs.length());

        JSArray kwArray = new JSArray();
        for (String kw : kws) {
            kwArray.put(kw);
        }
        res.put("monitoredKeywords", kwArray);

        call.resolve(res);
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject res = new JSObject();
            res.put("opened", true);
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to open notification listener settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getMessages(PluginCall call) {
        try {
            JSONArray arr = WAScraperStore.getMessages(getContext());
            JSObject res = new JSObject();
            res.put("messages", new JSArray(arr.toString()));
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to read messages: " + e.getMessage());
        }
    }

    @PluginMethod
    public void clearMessages(PluginCall call) {
        WAScraperStore.clearMessages(getContext());
        JSObject res = new JSObject();
        res.put("cleared", true);
        call.resolve(res);
    }

    @PluginMethod
    public void setMonitoredKeywords(PluginCall call) {
        JSArray arr = call.getArray("keywords");
        List<String> list = new ArrayList<>();
        if (arr != null) {
            for (int i = 0; i < arr.length(); i++) {
                try {
                    list.add(arr.getString(i));
                } catch (Exception ignored) {}
            }
        }
        WAScraperStore.setMonitoredKeywords(getContext(), list);
        JSObject res = new JSObject();
        res.put("success", true);
        call.resolve(res);
    }

    @PluginMethod
    public void getPendingShare(PluginCall call) {
        JSObject res = new JSObject();
        if (pendingSharedData != null) {
            res = pendingSharedData;
            pendingSharedData = null; // consume
        } else {
            res.put("hasShare", false);
        }
        call.resolve(res);
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (!Intent.ACTION_SEND.equals(action)) return;

        try {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            String title = intent.getStringExtra(Intent.EXTRA_SUBJECT);

            // Check if a file stream (.txt exported chat) was shared
            Uri streamUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
            if (streamUri != null && (sharedText == null || sharedText.isEmpty())) {
                sharedText = readTextFromUri(streamUri);
            }

            if (sharedText != null && !sharedText.trim().isEmpty()) {
                JSObject data = new JSObject();
                data.put("hasShare", true);
                data.put("text", sharedText);
                data.put("title", title != null ? title : "Shared WhatsApp Chat");
                data.put("timestamp", System.currentTimeMillis());

                pendingSharedData = data;
                notifyListeners("onWAShareReceived", data);
                Log.d(TAG, "📥 Ingested WhatsApp Share Intent (" + sharedText.length() + " chars)");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error handling share intent", e);
        }
    }

    private String readTextFromUri(Uri uri) {
        try {
            InputStream is = getContext().getContentResolver().openInputStream(uri);
            if (is == null) return null;
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append('\n');
            }
            reader.close();
            is.close();
            return sb.toString();
        } catch (Exception e) {
            Log.e(TAG, "Error reading shared URI: " + uri, e);
            return null;
        }
    }

    private boolean isNotificationAccessGranted(Context context) {
        if (context == null) return false;
        String pkgName = context.getPackageName();
        final String flat = Settings.Secure.getString(context.getContentResolver(), "enabled_notification_listeners");
        if (!TextUtils.isEmpty(flat)) {
            final String[] names = flat.split(":");
            for (String name : names) {
                final ComponentName cn = ComponentName.unflattenFromString(name);
                if (cn != null && TextUtils.equals(pkgName, cn.getPackageName())) {
                    return true;
                }
            }
        }
        return false;
    }
}
