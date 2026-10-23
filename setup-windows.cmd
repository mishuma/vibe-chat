@echo off
rem Double-click this file to run the Windows setup. It only starts setup-windows.ps1 in this folder.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-windows.ps1" %*
