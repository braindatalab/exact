#!/bin/bash
sudo docker compose down
sudo docker compose up -d --build
sudo docker compose exec backend python manage.py migrate