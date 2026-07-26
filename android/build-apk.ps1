param(
    [switch]$Release
)

$ErrorActionPreference = "Stop"
$ANDROID_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Output "=========================================="
Write-Output "  LiveHub APK Builder"
Write-Output "=========================================="

# 1. Check Java
Write-Output "[1/4] Checking Java..."
$java = Get-Command java -ErrorAction SilentlyContinue
if (-not $java) {
    Write-Output "  Java not found. Installing Temurin JDK 17..."
    try {
        winget install "Eclipse Temurin JDK with Hotspot 17" --accept-package-agreements --accept-source-agreements
        $env:JAVA_HOME = "$env:ProgramFiles\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
    } catch {
        Write-Error "  Please install JDK 17+ manually from https://adoptium.net/ and set JAVA_HOME"
        exit 1
    }
}
Write-Output "  Java: OK"

# 2. Check Android SDK
Write-Output "[2/4] Checking Android SDK..."
$androidSdk = $env:ANDROID_HOME
if (-not $androidSdk) {
    $androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
    $env:ANDROID_HOME = $androidSdk
}

if (-not (Test-Path "$androidSdk\platforms\android-34")) {
    Write-Output "  Android SDK not found. Installing..."
    # Download commandline tools
    $toolsZip = "$env:TEMP\cmdline-tools.zip"
    $toolsDir = "$androidSdk\cmdline-tools"
    if (-not (Test-Path $toolsZip)) {
        Write-Output "  Downloading Android command-line tools..."
        Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile $toolsZip -UseBasicParsing
    }
    Expand-Archive -Path $toolsZip -DestinationPath "$env:TEMP\cmdline-tools" -Force
    New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
    Move-Item "$env:TEMP\cmdline-tools\cmdline-tools" "$toolsDir\latest" -Force
    # Accept licenses and install SDK
    $sdkManager = "$toolsDir\latest\bin\sdkmanager.bat"
    & $sdkManager --sdk_root=$androidSdk "platforms;android-34" "build-tools;34.0.0"
}

Write-Output "  Android SDK: OK"

# 3. Setup Gradle wrapper
Write-Output "[3/4] Setting up Gradle..."
$wrapperJar = "$ANDROID_DIR\gradle\wrapper\gradle-wrapper.jar"
if (-not (Test-Path $wrapperJar) -or (Get-Item $wrapperJar).Length -eq 0) {
    Write-Output "  Downloading Gradle wrapper..."
    Invoke-WebRequest -Uri "https://github.com/gradle/gradle/raw/v8.4.0/gradle/wrapper/gradle-wrapper.jar" -OutFile $wrapperJar -UseBasicParsing
}
Write-Output "  Gradle: OK"

# 4. Build APK
Write-Output "[4/4] Building APK..."
Set-Location $ANDROID_DIR
if ($Release) {
    .\gradlew.bat assembleRelease --no-daemon
    $apk = "app\build\outputs\apk\release\app-release-unsigned.apk"
} else {
    .\gradlew.bat assembleDebug --no-daemon
    $apk = "app\build\outputs\apk\debug\app-debug.apk"
}

if (Test-Path $apk) {
    Write-Output ""
    Write-Output "=========================================="
    Write-Output "  APK built successfully!"
    Write-Output "  Location: $apk"
    Write-Output "=========================================="
} else {
    Write-Error "  APK not found at expected path: $apk"
    exit 1
}
