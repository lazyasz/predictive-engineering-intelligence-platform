# PowerShell 1-Click Unified Launcher
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   PREDICTIVE ENGINEERING INTELLIGENCE PLATFORM - 1-CLICK LAUNCHER" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

py scripts\run_full_stack.py
