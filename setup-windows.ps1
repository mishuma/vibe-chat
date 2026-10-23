<#
  Vibe Chat workshop setup - WINDOWS.
  Run it by double-clicking setup-windows.cmd (same folder), or from PowerShell:
      powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-windows.ps1

  What it does: checks the laptop, makes a working folder you choose, copies vibe-chat.html into it,
  and writes a short report (setup-report.txt) you can send back if anything fails.
  What it does NOT do: install software, change system settings, set environment variables, or copy any API key.
  vibe-chat.html is one file that runs in a browser. It needs no packages.
  Safe to run again: an existing folder is reused, an unchanged file is left alone.
#>
[CmdletBinding()]
param(
  [string]$WorkDir,          # skip the question and use this folder
  [switch]$NoOpen,           # do not open the app in the browser at the end
  [switch]$NonInteractive    # never wait for a keypress (for testing)
)
$ErrorActionPreference = 'Stop'
$AppFile    = 'vibe-chat.html'
$AppTitle   = '<title>Vibe Coding Chat</title>'
$KeyPattern = 'sk-(or|ant)-[A-Za-z0-9_-]{16,}'     # OpenRouter / Anthropic style keys
$Results = New-Object System.Collections.ArrayList
$Fails = 0; $Warns = 0

function Add-Result([string]$Level, [string]$Msg, [string]$Fix) {
  [void]$Results.Add([pscustomobject]@{Level=$Level; Msg=$Msg; Fix=$Fix})
  $color = @{PASS='Green'; WARN='Yellow'; FAIL='Red'; INFO='Gray'}[$Level]
  Write-Host ('[{0}] {1}' -f $Level, $Msg) -ForegroundColor $color
  if ($Fix) { Write-Host ('       Fix: {0}' -f $Fix) -ForegroundColor $color }
  if ($Level -eq 'FAIL') { $script:Fails++ }
  if ($Level -eq 'WARN') { $script:Warns++ }
}
function Finish([string]$ReportDir) {
  Write-Host ''
  if ($Fails -gt 0) { Write-Host ("RESULT: {0} problem(s) must be fixed before the workshop. Warnings: {1}." -f $Fails, $Warns) -ForegroundColor Red }
  elseif ($Warns -gt 0) { Write-Host ("RESULT: ready, with {0} warning(s). Read the lines marked WARN." -f $Warns) -ForegroundColor Yellow }
  else { Write-Host 'RESULT: all checks passed. You are ready for the workshop.' -ForegroundColor Green }
  try {
    if (-not $ReportDir -or -not (Test-Path -LiteralPath $ReportDir -PathType Container)) { $ReportDir = Split-Path -Parent $ScriptPath }
    $lines = @("Vibe Chat setup report - " + (Get-Date -Format 'yyyy-MM-dd HH:mm'), "Computer: $env:COMPUTERNAME  Windows $([Environment]::OSVersion.Version)  PowerShell $($PSVersionTable.PSVersion)", '')
    foreach ($r in $Results) { $lines += ('[{0}] {1}' -f $r.Level, $r.Msg); if ($r.Fix) { $lines += ('       Fix: {0}' -f $r.Fix) } }
    $rp = Join-Path $ReportDir 'setup-report.txt'
    Set-Content -LiteralPath $rp -Value $lines -Encoding ASCII
    Write-Host ("A copy of this report is in: {0}" -f $rp)
    if ($Fails -gt 0) { Write-Host 'If you cannot fix a problem, email that file to the workshop organizer.' }
  } catch { Write-Host ('(Could not write the report file: {0})' -f $_.Exception.Message) -ForegroundColor Yellow }
  if (-not $NonInteractive) { Read-Host 'Press Enter to close this window' | Out-Null }
  if ($Fails -gt 0) { exit 1 } else { exit 0 }
}

$ScriptPath = $MyInvocation.MyCommand.Path
$ScriptDir  = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $ScriptPath }

Write-Host 'Vibe Chat - workshop setup (Windows)' -ForegroundColor Cyan
Write-Host ''

# 1. Operating system
$isWin = ($env:OS -eq 'Windows_NT')
if (-not $isWin) {
  $isMac = ($PSVersionTable.PSEdition -eq 'Core') -and (Get-Variable -Name IsMacOS -ValueOnly -ErrorAction SilentlyContinue)
  if ($isMac) { Add-Result 'FAIL' 'This is a Mac, but you ran the Windows script.' 'Open Terminal and run: bash setup-mac.sh' }
  else        { Add-Result 'FAIL' 'This script supports Windows and macOS only.' 'Use a Windows or Mac laptop for the workshop.' }
  Finish $null
}
$ver = [Environment]::OSVersion.Version
if ($ver.Major -ge 10) { Add-Result 'PASS' ("Windows version {0}" -f $ver) '' }
else { Add-Result 'FAIL' ("Windows version {0} is too old for current browsers." -f $ver) 'Use a laptop with Windows 10 or 11.' }

# 2. The app file next to this script, and no API key inside it
$src = Join-Path $ScriptDir $AppFile
$srcOk = $false
if (-not (Test-Path -LiteralPath $src -PathType Leaf)) {
  Add-Result 'FAIL' ("Cannot find {0} next to this script (looked in {1})." -f $AppFile, $ScriptDir) 'Unzip the whole workshop folder first (right-click > Extract All), then run the script from inside the unzipped folder, not from inside the zip.'
} else {
  $len = (Get-Item -LiteralPath $src).Length
  $txt = [IO.File]::ReadAllText($src)
  if ($len -lt 50000 -or -not $txt.Contains($AppTitle)) {
    Add-Result 'FAIL' ("{0} looks incomplete or damaged ({1} bytes)." -f $AppFile, $len) 'Download the workshop folder again.'
  } elseif ($txt -match $KeyPattern) {
    Add-Result 'FAIL' ("{0} contains text that looks like an API key. Nothing was copied." -f $AppFile) 'Tell the workshop organizer. Do not share this file. Keys are handed out during the workshop.'
  } else {
    $srcOk = $true
    Add-Result 'PASS' ("{0} found ({1:N0} KB) and contains no API key." -f $AppFile, ($len/1KB)) ''
  }
}

# 3. Browser
$browsers = @()
foreach ($b in @(@('chrome.exe','Google Chrome'), @('msedge.exe','Microsoft Edge'))) {
  foreach ($hive in 'HKLM','HKCU') {
    if (Test-Path ("{0}:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\{1}" -f $hive, $b[0])) { $browsers += $b[1]; break }
  }
}
if ($browsers.Count -gt 0) { Add-Result 'PASS' ("Browser found: {0}." -f ($browsers -join ', ')) '' }
else { Add-Result 'WARN' 'Neither Chrome nor Edge was found. The camera QR scan may not work in other browsers.' 'Install Google Chrome (https://www.google.com/chrome) or use Microsoft Edge.' }

# 4. Camera (needed to scan the key QR code; typing the key also works)
try {
  $cams = @(Get-PnpDevice -Class Camera, Image -Status OK -ErrorAction Stop)
  if ($cams.Count -gt 0) { Add-Result 'PASS' ("Camera found: {0}." -f $cams[0].FriendlyName) '' }
  else { Add-Result 'WARN' 'No camera detected. You will not be able to scan the key QR code.' 'Check that the camera is not disabled (Settings > Privacy > Camera). Otherwise you can paste the key by hand.' }
} catch { Add-Result 'WARN' 'Could not check for a camera.' 'Open Settings > Privacy > Camera and confirm "Camera access" is on. You can paste the key by hand if it is not.' }

# 5. Internet access to OpenRouter (the one thing that most often fails on school or work networks)
try {
  try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}
  $resp = Invoke-WebRequest -Uri 'https://openrouter.ai/api/v1/models' -UseBasicParsing -TimeoutSec 15
  Add-Result 'PASS' ("Can reach openrouter.ai (HTTP {0})." -f $resp.StatusCode) ''
} catch {
  Add-Result 'FAIL' ("Cannot reach openrouter.ai: {0}" -f $_.Exception.Message) 'Connect to a network that allows it (try a phone hotspot). On a school or work network, ask IT to allow https://openrouter.ai. Also check any VPN or proxy.'
}

# 6. Working folder
if (-not $WorkDir) {
  $docs = [Environment]::GetFolderPath('MyDocuments')
  if (-not $docs) { $docs = $env:USERPROFILE }
  $default = Join-Path $docs 'vibe-chat'
  if ($NonInteractive) { $WorkDir = $default }
  else {
    Write-Host ''
    Write-Host 'Where should the Vibe Chat working folder be?'
    $ans = Read-Host ("Press Enter to use {0}, or type another folder" -f $default)
    $WorkDir = if ($ans.Trim()) { $ans.Trim().Trim('"') } else { $default }
  }
}
$WorkDir = [Environment]::ExpandEnvironmentVariables($WorkDir)
$workOk = $false
try {
  $WorkDir = [IO.Path]::GetFullPath($WorkDir)
  if (Test-Path -LiteralPath $WorkDir -PathType Leaf) {
    Add-Result 'FAIL' ("{0} is a file, not a folder." -f $WorkDir) 'Run the script again and choose a different folder name.'
  } elseif (Test-Path -LiteralPath $WorkDir -PathType Container) {
    Add-Result 'PASS' ("Working folder already exists, reusing it: {0}" -f $WorkDir) ''
    $workOk = $true
  } else {
    New-Item -ItemType Directory -Path $WorkDir -Force | Out-Null
    Add-Result 'PASS' ("Created working folder: {0}" -f $WorkDir) ''
    $workOk = $true
  }
  if ($workOk) {
    $probe = Join-Path $WorkDir ('.write-test-' + [guid]::NewGuid().ToString('N'))
    try { Set-Content -LiteralPath $probe -Value 'x'; Remove-Item -LiteralPath $probe -Force }
    catch { $workOk = $false; Add-Result 'FAIL' ("Cannot write to {0}." -f $WorkDir) 'Choose a folder you own, such as one inside Documents. Avoid Program Files and the root of C:\.' }
  }
} catch {
  Add-Result 'FAIL' ("Cannot use the folder '{0}': {1}" -f $WorkDir, $_.Exception.Message) 'Choose a normal folder path, for example C:\Users\YourName\Documents\vibe-chat.'
}

# 7. Copy the app
$dest = $null
if ($workOk -and $srcOk) {
  $dest = Join-Path $WorkDir $AppFile
  try {
    $srcHash = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash
    if (Test-Path -LiteralPath $dest -PathType Leaf) {
      if ((Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash -eq $srcHash) { Add-Result 'PASS' ("{0} is already up to date." -f $AppFile) '' }
      else {
        $bak = $dest + '.bak-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
        Move-Item -LiteralPath $dest -Destination $bak
        Copy-Item -LiteralPath $src -Destination $dest
        Add-Result 'PASS' ("Updated {0}. The previous copy was kept as {1}." -f $AppFile, (Split-Path -Leaf $bak)) ''
      }
    } else {
      Copy-Item -LiteralPath $src -Destination $dest
      Add-Result 'PASS' ("Copied {0} into the working folder." -f $AppFile) ''
    }
    try { Unblock-File -LiteralPath $dest } catch {}
    if ((Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash -ne $srcHash) { throw 'the copy does not match the original' }
  } catch {
    Add-Result 'FAIL' ("Could not copy {0}: {1}" -f $AppFile, $_.Exception.Message) 'Close any program that has the file open, check there is free disk space, and run the script again.'
    $dest = $null
  }
}

# 8. No stray API keys anywhere in the working folder (top level, small text-like files)
if ($workOk) {
  $hits = @()
  Get-ChildItem -LiteralPath $WorkDir -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Length -lt 2MB -and $_.Extension -match '^\.(html?|txt|md|json|env|js|ts|log|csv|ps1|cmd|sh)$' } |
    ForEach-Object { try { if ([IO.File]::ReadAllText($_.FullName) -match $KeyPattern) { $hits += $_.Name } } catch {} }
  if ($hits.Count -gt 0) { Add-Result 'WARN' ("These files in the working folder look like they contain an API key: {0}" -f ($hits -join ', ')) 'Delete the key from those files or delete the files. Do not share them.' }
  else { Add-Result 'PASS' 'No API keys found in the working folder.' '' }
}

# 9. Environment variables: none are needed. Say so, so nobody wonders.
Add-Result 'INFO' 'No environment variables or extra packages are needed. The key is pasted or scanned inside the app at the workshop.' ''

# 10. Open the app as a last check (a chat page should appear; it will ask for a key, which you do not have yet)
if ($dest -and -not $NoOpen -and -not $NonInteractive) {
  try { Start-Process -FilePath $dest; Add-Result 'INFO' 'Opened the app in your browser. You should see "Vibe Coding Chat" with an empty key box. Close it for now.' '' }
  catch { Add-Result 'WARN' ("Could not open the app automatically: {0}" -f $_.Exception.Message) ("Open this file by double-clicking it: {0}" -f $dest) }
}
Finish $WorkDir
