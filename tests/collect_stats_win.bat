@echo off
setlocal

set "SYSFILE=system_stats.csv"
set "DOCKERFILE=docker_stats.csv"
set "CONTAINER=mqtt-broker"

REM Write headers if files do not exist
if not exist "%SYSFILE%" (
    echo Timestamp,CPU_Load,Free_Mem_KB,Total_Mem_KB,Free_Disk_Bytes > "%SYSFILE%"
)
if not exist "%DOCKERFILE%" (
    echo Timestamp,Docker_Name,Container_CPU,Container_Mem,Container_NetIO,Container_BlockIO > "%DOCKERFILE%"
)

set /a "end=%time:~0,2%*3600 + %time:~3,2%*60 + %time:~6,2% + 600"

:loop
set /a "now=%time:~0,2%*3600 + %time:~3,2%*60 + %time:~6,2%"
if %now% geq %end% goto :eof

for /f "tokens=2 delims==." %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set "datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%"

for /f "skip=1 tokens=2 delims=," %%a in ('wmic cpu get loadpercentage /format:csv') do set CPU=%%a
for /f "skip=1 tokens=2 delims=," %%a in ('wmic OS get FreePhysicalMemory /format:csv') do set FreeMem=%%a
for /f "skip=1 tokens=2 delims=," %%a in ('wmic OS get TotalVisibleMemorySize /format:csv') do set TotalMem=%%a
for /f "skip=1 tokens=2 delims=," %%a in ('wmic logicaldisk where "DeviceID='C:'" get FreeSpace /format:csv') do set FreeDisk=%%a

REM Write system stats
echo %datetime%,%CPU%,%FreeMem%,%TotalMem%,%FreeDisk% >> "%SYSFILE%"

REM Get Docker stats (may be empty if container not running)
for /f "tokens=*" %%a in ('docker stats --no-stream --format "table {{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.NetIO}},{{.BlockIO}}" %CONTAINER% ^| findstr /v "NAME"') do set DOCKERSTATS=%%a

REM Write docker stats if available
if defined DOCKERSTATS (
    echo %datetime%,%DOCKERSTATS% >> "%DOCKERFILE%"
) else (
    echo %datetime%,,,,, >> "%DOCKERFILE%"
)

timeout /t 5 >nul
goto :loop