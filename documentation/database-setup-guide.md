# Database Setup and Migration Guide

This document explains how to set up the project's database schema automatically. Whether you are setting up your local development environment for the first time or deploying the application to a new production server, this guide will walk you through the process.

The key takeaway is that you **never need to write SQL manually** to create the tables. The entire database structure is managed automatically by Django's migration system.

---

## Core Concept: Where Does the Structure Come From?
* This gets done automatically when you run `docker compose up --build`.

The "master plan" or "blueprint" for our database structure lives inside our Django project's code.

1.  **The Models (`models.py`):** In files like `platform/backend/api/models.py`, we define our database tables using Python classes (e.g., `class Challenge(...)`).

2.  **The Migrations (e.g., `0001_initial.py`):** When we change our models, we run a command (`makemigrations`) that looks at our changes and generates a "blueprint" file. These blueprint files are stored in the `migrations/` directory of each app (e.g., `platform/backend/api/migrations/`). They contain the step-by-step instructions needed to apply our changes to the database.

3.  **The `migrate` Command:** This is the command that reads all the blueprint files in the correct order and translates them into SQL commands (`CREATE TABLE`, `ALTER TABLE`, etc.) that the database understands.

When you run `migrate` on an empty database, it builds the entire structure from scratch. When you run it on an existing database, it intelligently applies only the new blueprints that haven't been applied yet.

---

## Scenario 1: Setting Up or Updating a Local Database (Windows + Docker)

This scenario is for ensuring your local database has the correct, up-to-date structure. This is the most common task you will perform.

**Use the `rebuild_database.bat` script.**

This script is **safe to run** at any time. It **will not delete any data**.
- If you run it on an empty database, it will create the entire table structure.
- If you run it on an existing database, it will apply any new migrations that have been added to the code.
- If your database is already up-to-date, it will do nothing.

### Steps:

1.  Make sure Docker Desktop is running on your Windows machine.
2.  Navigate to the project's root directory in your terminal.
3.  Run the script:
    ```sh
    .\rebuild_database.bat
    ```

### What This Script Does:

-   `docker exec exact-backend-1 python /app/manage.py migrate`: Executes the `migrate` command inside the backend container. This reads all the migration blueprints and updates your database schema to match the latest version of the code.

After the script finishes, your local database will have the correct schema without affecting any of your existing data.

---

## Scenario 2: Deploying to a New Production Server (Linux)

This is the workflow for setting up the database on a new, empty production server (e.g., a cloud server running Linux).

**Use the `deploy.sh` script.**

### Workflow:

1.  **Connect to Your Server:** First, you need to connect to your live server, usually via SSH.
    ```sh
    ssh your_username@your_server_ip
    ```

2.  **Make the Script Executable (One-Time Step):** The first time you use the script on the server, you must give it permission to be executed.
    ```sh
    chmod +x deploy.sh
    ```

3.  **Run the Deployment Script:**
    ```sh
    ./deploy.sh
    ```

### What This Script Does:

-   `git pull origin main`: Pulls the latest version of your code (including all the migration blueprints) from your repository.
-   `pip install -r ...`: Installs or updates any necessary Python packages.
-   `python3 platform/backend/manage.py migrate`: This is the key command. It connects to the database defined in your server's environment variables and applies all the migrations, building the schema from scratch.

After the script runs, your live database will have the correct structure, ready for users.

---

## (Optional) Populating a New Database with Initial Data

If you want your new database (either local or production) to have some initial data (like your test challenges), follow this two-step process:

1.  **Create a Backup:** On your local machine (which has the data), run the `backup_and_restore.bat` script. This will create a `db_backup.json` file.
2.  **Restore the Data:**
    -   Copy the `db_backup.json` file to your new environment (e.g., using `scp` for a production server).
    -   Run the Django `loaddata` command on the new machine:
        ```sh
        # On a Linux server
        python3 platform/backend/manage.py loaddata db_backup.json

        # Or, if using the local Docker setup
        docker exec exact-backend-1 python /app/manage.py loaddata db_backup.json
        ```

This will load all the data from the JSON file into your newly structured database.