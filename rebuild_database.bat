@echo off
REM This script sets up the database schema on a new, empty database.
REM It runs Django migrations to create all necessary tables and relationships.
REM It is safe to run and will not delete any data.

REM Set your Django backend container name here:
set CONTAINER=exact-backend-1

echo.
echo Applying all migrations to build the database schema in container %CONTAINER%...
docker exec %CONTAINER% python /app/manage.py migrate

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Migration failed! Check your database connection and migrations.
    pause
    exit /b 1
)

echo.
echo All done! Your database schema has been set up successfully.
pause 