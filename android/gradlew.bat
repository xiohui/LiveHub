@rem LiveHub Android Gradle wrapper
@if "%DEBUG%"=="" @echo off
setlocal enabledelayedexpansion

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

set GRADLE_VERSION=8.4
set WRAPPER_JAR=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar
set WRAPPER_PROPS=%APP_HOME%\gradle\wrapper\gradle-wrapper.properties

if not exist "%WRAPPER_JAR%" (
    echo Downloading Gradle %GRADLE_VERSION% wrapper...
    powershell -Command "& { Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-%GRADLE_VERSION%-bin.zip' -OutFile '%TEMP%\gradle-%GRADLE_VERSION%-bin.zip' -UseBasicParsing; Expand-Archive '%TEMP%\gradle-%GRADLE_VERSION%-bin.zip' -DestinationPath '%TEMP%'; & '%TEMP%\gradle-%GRADLE_VERSION%\bin\gradle.bat' wrapper --gradle-version %GRADLE_VERSION% --distribution-type bin -p '%APP_HOME%'; rmdir /s /q '%TEMP%\gradle-%GRADLE_VERSION%'; del '%TEMP%\gradle-%GRADLE_VERSION%-bin.zip' }"
    if errorlevel 1 (
        echo Gradle wrapper download failed. Please install Gradle manually:
        echo 1. Download from https://gradle.org/releases/
        echo 2. Run: gradle wrapper --gradle-version %GRADLE_VERSION%
        exit /b 1
    )
)

if exist "%JAVA_HOME%" goto findJavaFromJavaHome
set JAVA_EXE=java.exe
where "%JAVA_EXE%" >nul 2>nul
if errorlevel 1 (
    echo Java not found. Please install JDK 17+ and set JAVA_HOME.
    exit /b 1
)
goto run

:findJavaFromJavaHome
set JAVA_EXE=%JAVA_HOME%\bin\java.exe
if not exist "%JAVA_EXE%" (
    echo JAVA_HOME is set but java.exe not found at %%JAVA_HOME%%\bin\java.exe
    exit /b 1
)

:run
"%JAVA_EXE%" -jar "%WRAPPER_JAR%" %*
