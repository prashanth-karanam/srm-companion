@echo off
title SRM Companion - WhatsApp Virtual Bridge
color 0A
echo ========================================================
echo  Starting SRM Companion WhatsApp Multi-User Bridge (Port 8001)
echo ========================================================
cd /d %~dp0
node wa_bridge.js
pause
