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
    PUSHD "%SKILLS_DIR%\xquik"
    CALL npm ci --omit=dev --ignore-scripts --no-audit --no-fund
    IF ERRORLEVEL 1 (
        echo   WARNING  Xquik validator setup failed. Other skills remain installed.
        echo            Fix npm, then rerun this installer before using /xquik.
    ) ELSE (
        echo   OK  Xquik weighted-length validator
    )
    POPD
)

echo.
echo Done. All 11 skills installed to %SKILLS_DIR%
echo Open Claude Code and run /social-media-manager to get started.
pause
