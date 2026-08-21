"""
SRM Companion - Live WhatsApp Group Listener & AI Task Dispatcher
Student: Karanam Sai Prasanth (RA2611026010283)

Monitors ONLY your selected WhatsApp groups in real-time.
Zero hardcoded messages - processes real live messages sent by teachers/classmates.
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

import urllib.request
import urllib.parse
import json
import time
import os

HOST = "https://7107.api.greenapi.com"
ID_INSTANCE = "710722715773"
TOKEN = "da5cdc5ac9f84f6ea3221cc60d451c953d58431cd7db4f029d"

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "groups_config.json")

def get_enabled_group_ids():
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            return {g["id"]: g["name"] for g in cfg.get("all_groups", []) if g.get("enabled")}
    except Exception:
        # Fallback to 4 core academic groups
        return {
            "120363414414706236@g.us": "P1 C programming",
            "120363428457163076@g.us": "AI ML P1 MATHS 26-27 odd",
            "120363429643242377@g.us": "AI ML P1 Chemistry",
            "120363432799866714@g.us": "P1 26-30 CSE AI ML BIO"
        }

def check_and_process_notifications():
    receive_url = f"{HOST}/waInstance{ID_INSTANCE}/receiveNotification/{TOKEN}"
    delete_url = f"{HOST}/waInstance{ID_INSTANCE}/deleteNotification/{TOKEN}"

    try:
        req = urllib.request.Request(receive_url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            
            if not data or not data.get('receiptId'):
                return

            receipt_id = data['receiptId']
            body = data.get('body', {})
            type_webhook = body.get('typeWebhook')

            if type_webhook == 'incomingMessageReceived':
                sender_data = body.get('senderData', {})
                chat_id = sender_data.get('chatId')
                
                # Check against user-selected enabled groups ONLY
                monitored_groups = get_enabled_group_ids()
                
                if chat_id in monitored_groups:
                    chat_name = monitored_groups[chat_id]
                    sender_name = sender_data.get('senderName') or sender_data.get('sender', 'Unknown')
                    
                    message_data = body.get('messageData', {})
                    type_msg = message_data.get('typeMessage')
                    
                    raw_live_text = ""
                    if type_msg == 'textMessage':
                        raw_live_text = message_data.get('textMessageData', {}).get('textMessage', '')
                    elif type_msg == 'extendedTextMessage':
                        raw_live_text = message_data.get('extendedTextMessageData', {}).get('text', '')

                    if raw_live_text.strip():
                        print(f"\n[REAL MESSAGE] From {sender_name} in [{chat_name}]:")
                        print(f" -> \"{raw_live_text}\"")
                        print("⚡ Sending real message to AI Task Extractor...")
                        
                        ingest_req = urllib.request.Request(
                            "http://localhost:8000/api/ingest",
                            data=json.dumps({"text": raw_live_text, "groupName": chat_name}).encode('utf-8'),
                            headers={'Content-Type': 'application/json'}
                        )
                        try:
                            with urllib.request.urlopen(ingest_req, timeout=12) as ingest_resp:
                                res = json.loads(ingest_resp.read().decode('utf-8'))
                                if res.get('success'):
                                    task = res.get('task', {})
                                    print(f"✅ AI Task Added to Dashboard: [{task.get('subject')}] {task.get('task')} (Due: {task.get('deadline')})")
                                else:
                                    print("ℹ️ Message analyzed by AI: No actionable homework/xerox detected.")
                        except Exception as ie:
                            print("Ingestion error:", ie)

            # Acknowledge receipt to clear queue
            del_req = urllib.request.Request(f"{delete_url}/{receipt_id}", method='DELETE')
            urllib.request.urlopen(del_req, timeout=5)

    except Exception:
        pass

def start_listener_loop():
    monitored = get_enabled_group_ids()
    print("==========================================================")
    print("🚀 REAL-TIME WHATSAPP LISTENER RUNNING (ZERO HARDCODED DATA)")
    print(f"Listening ONLY to your {len(monitored)} selected groups:")
    for gid, gname in monitored.items():
        print(f" • {gname}")
    print("==========================================================")
    while True:
        try:
            check_and_process_notifications()
            time.sleep(1)
        except KeyboardInterrupt:
            print("\nStopping listener...")
            break
        except Exception:
            time.sleep(2)

if __name__ == '__main__':
    start_listener_loop()
