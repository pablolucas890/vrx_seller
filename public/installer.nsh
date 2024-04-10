RequestExecutionLevel admin
!macro customUnInstall
    ExecWait '"$TEMP\clean.bat" > "$TEMP\clean_output.txt" 2>&1'
!macroend
