"""
SRM Companion - Master WhatsApp Webhook & AI Pipeline Connector
Student: Karanam Sai Prasanth (RA2611026010283)
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

import urllib.request
import urllib.parse
import json
import webbrowser
import os

DEFAULT_HOST = "https://7107.api.greenapi.com"

def get_instance_state(host, id_instance, api_token):
    host = host.rstrip('/')
    url = f"{host}/waInstance{id_instance}/getStateInstance/{api_token}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('stateInstance')
    except Exception as e:
        print(f"Error checking state: {e}")
        return None

def setup_green_api(host, id_instance, api_token, webhook_url):
    host = host.rstrip('/')
    print(f"\n--- [1/3] Configuring Green-API ({host}) Webhook Settings ---")
    settings_url = f"{host}/waInstance{id_instance}/setSettings/{api_token}"
    payload = {
        "webhookUrl": webhook_url,
        "incomingWebhook": "yes",
        "outgoingWebhook": "no",
        "stateWebhook": "no"
    }
    
    req = urllib.request.Request(
        settings_url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print("✅ Webhook URL successfully set to:", webhook_url)
    except Exception as e:
        print("❌ Error setting webhook:", e)
        return False

    print("\n--- [2/3] Fetching WhatsApp QR Code for Device Linking ---")
    qr_url = f"{host}/waInstance{id_instance}/qr/{api_token}"
    try:
        with urllib.request.urlopen(qr_url, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get('type') == 'qrCode':
                print("📱 Opening QR Code in your browser...")
                qr_base64 = data.get('message')
                html_preview = f"""<!DOCTYPE html>
<html>
<head>
    <title>Link WhatsApp to SRM Companion</title>
    <style>
        body {{ background: #000; color: #fff; text-align: center; padding: 40px; font-family: -apple-system, sans-serif; }}
        .card {{ background: #121215; border: 1px solid #222; border-radius: 16px; display: inline-block; padding: 30px; max-width: 360px; }}
        img {{ border-radius: 12px; background: #fff; padding: 12px; max-width: 250px; }}
        p {{ color: #a1a1aa; font-size: 0.85rem; margin-top: 14px; }}
    </style>
</head>
<body>
    <div class="card">
        <h2>Link SRM WhatsApp Bot</h2>
        <img src="data:image/png;base64,{qr_base64}">
        <p>1. Open WhatsApp on phone<br>2. Go to <b>Linked Devices > Link a Device</b><br>3. Scan this QR code</p>
    </div>
</body>
</html>"""
                out_path = os.path.join(os.path.dirname(__file__), "qr_preview.html")
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(html_preview)
                webbrowser.open(out_path)
            elif data.get('type') == 'alreadyLogged':
                print("🎉 WhatsApp is ALREADY LINKED and running 24/7 in the cloud!")
    except Exception as e:
        print("QR Fetch error:", e)

    return True

if __name__ == '__main__':
    print("==========================================================")
    print("🚀 SRM COMPANION - GREEN-API CONNECTOR")
    print(f"Host: {DEFAULT_HOST}")
    print("==========================================================")
    
    if len(sys.argv) >= 3:
        id_inst = sys.argv[1].strip()
        token_inst = sys.argv[2].strip()
        host = sys.argv[3].strip() if len(sys.argv) > 3 else DEFAULT_HOST
        webhook = sys.argv[4].strip() if len(sys.argv) > 4 else "http://localhost:8000/api/webhook"
        setup_green_api(host, id_inst, token_inst, webhook)
    else:
        host = input(f"Enter Host [{DEFAULT_HOST}]: ").strip() or DEFAULT_HOST
        id_inst = input("Enter your idInstance: ").strip()
        token_inst = input("Enter your apiTokenInstance: ").strip()
        webhook = input("Enter Webhook URL [http://localhost:8000/api/webhook]: ").strip() or "http://localhost:8000/api/webhook"
        if id_inst and token_inst:
            setup_green_api(host, id_inst, token_inst, webhook)
        else:
            print("Missing idInstance or apiTokenInstance.")
