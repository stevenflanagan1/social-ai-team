@echo off
REM Install Social AI Team skills into Claude Code

SET SKILLS_DIR=%USERPROFILE%\.claude\skills
SET SCRIPT_DIR=%~dp0

echo Installing Social AI Team skills...

FOR %%S IN (social-media-manager brand-onboarding content-calendar caption-writer social-creative-designer social-performance-review linkedin-writer threads-writer x-writer xquik publisher) DO (
    IF NOT EXIST "%SKILLS_DIR%\%%S" MKDIR "%SKILLS_DIR%\%%S"
    XCOPY /E /Y /Q "%SCRIPT_DIR%skills\%%S\*" "%SKILLS_DIR%\%%S\" >nul
    echo   OK  %%S
)

WHERE npm >nul 2>&1
IF ERRORLEVEL 1 (
    echo   WARNING  Xquik validator skipped. Other skills remain installed.
    echo            Install Node.js and npm, then rerun this installer before using /xquik.
) ELSE (
    CALL :INSTALL_XQUIK_VALIDATOR
)

echo.
echo Done. All 11 skills installed to %SKILLS_DIR%
echo Open Claude Code and run /social-media-manager to get started.
pause
GOTO :EOF

:INSTALL_XQUIK_VALIDATOR
SETLOCAL
SET "XQUIK_DIR=%SKILLS_DIR%\xquik"
SET "VALIDATOR_STAGE=%SKILLS_DIR%\xquik\.validator-install-%RANDOM%-%RANDOM%"
SET "VALIDATOR_BACKUP=%VALIDATOR_STAGE%\previous-node_modules"

MKDIR "%VALIDATOR_STAGE%" >nul 2>&1
IF ERRORLEVEL 1 GOTO :VALIDATOR_FAILED

COPY /Y "%XQUIK_DIR%\package.json" "%VALIDATOR_STAGE%\package.json" >nul
IF ERRORLEVEL 1 GOTO :VALIDATOR_FAILED
COPY /Y "%XQUIK_DIR%\package-lock.json" "%VALIDATOR_STAGE%\package-lock.json" >nul
IF ERRORLEVEL 1 GOTO :VALIDATOR_FAILED

PUSHD "%VALIDATOR_STAGE%"
CALL npm ci --omit=dev --ignore-scripts --no-audit --no-fund
SET "NPM_RESULT=%ERRORLEVEL%"
POPD
IF NOT "%NPM_RESULT%"=="0" GOTO :VALIDATOR_FAILED

IF EXIST "%XQUIK_DIR%\node_modules" (
    MOVE "%XQUIK_DIR%\node_modules" "%VALIDATOR_BACKUP%" >nul
    IF ERRORLEVEL 1 GOTO :VALIDATOR_FAILED
)

MOVE "%VALIDATOR_STAGE%\node_modules" "%XQUIK_DIR%\node_modules" >nul
IF ERRORLEVEL 1 (
    IF EXIST "%VALIDATOR_BACKUP%" (
        MOVE "%VALIDATOR_BACKUP%" "%XQUIK_DIR%\node_modules" >nul
        IF ERRORLEVEL 1 GOTO :VALIDATOR_RECOVERY_FAILED
    )
    GOTO :VALIDATOR_FAILED
)

IF EXIST "%VALIDATOR_STAGE%" RMDIR /S /Q "%VALIDATOR_STAGE%"
echo   OK  Xquik weighted-length validator
ENDLOCAL
EXIT /B 0

:VALIDATOR_RECOVERY_FAILED
echo   WARNING  Xquik validator update and restore failed.
echo            The previous validator remains at %VALIDATOR_BACKUP%.
ENDLOCAL
EXIT /B 0

:VALIDATOR_FAILED
IF EXIST "%VALIDATOR_STAGE%" RMDIR /S /Q "%VALIDATOR_STAGE%"
echo   WARNING  Xquik validator update failed. Any previous validator remains installed.
echo            Fix npm, then rerun this installer before using /xquik.
ENDLOCAL
EXIT /B 0
