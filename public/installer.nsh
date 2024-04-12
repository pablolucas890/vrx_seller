RequestExecutionLevel admin
!macro customUnInstall
    ExecWait '"$TEMP\clean.bat"  /S'
!macroend
