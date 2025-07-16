@echo off
REM This script will create a test challenge, backup your Django database from the Docker container to db_backup.json
REM Then it will migrate and restore the backup into the database

REM Set your Django backend container name here:
set CONTAINER=exact-backend-1

REM Set the path to manage.py inside the container
set MANAGEPY=/app/manage.py

REM Log file for debugging
set LOGFILE=backup_restore.log

echo Checking if Docker is running...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running! Please start Docker and try again.
    pause
    exit /b 1
)

echo Creating test challenge 'DBTESTCHALLENGE1' in Docker container %CONTAINER%...
docker exec %CONTAINER% python %MANAGEPY% shell -c "from api.models import Challenge; Challenge.objects.get_or_create(challenge_id='dbtestchallenge1', defaults={'title':'DBTESTCHALLENGE1','description':'Test challenge for DB backup/restore'})" >> %LOGFILE% 2>&1

echo Exporting ALL database data to db_backup.json from Docker container %CONTAINER%...
docker exec %CONTAINER% python %MANAGEPY% dumpdata > db_backup.json
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backup failed! Make sure Docker is running and the container name is correct.
    pause
    exit /b 1
)

echo Backup complete! File saved as db_backup.json

echo Running migrations in Docker container %CONTAINER%...
docker exec %CONTAINER% python %MANAGEPY% migrate >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Migration failed! Check your migrations and try again.
    pause
    exit /b 1
)

echo Copying db_backup.json into the container...
docker cp db_backup.json %CONTAINER%:/app/db_backup.json
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy db_backup.json into the container. Check file paths and permissions.
    pause
    exit /b 1
)

echo Loading data from db_backup.json into the database...
docker exec %CONTAINER% python %MANAGEPY% loaddata db_backup.json >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Restore failed! Check for migration or data issues.
    pause
    exit /b 1
)

echo Verifying restored data...
docker exec %CONTAINER% python %MANAGEPY% shell -c "from api.models import Challenge; print(Challenge.objects.filter(challenge_id='dbtestchallenge1').exists())" >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Verification failed! Test challenge not found in the database.
    pause
    exit /b 1
)

echo All done! Your database has been backed up and restored.
pause