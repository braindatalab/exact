#!/bin/bash
sudo docker compose down -v
sudo docker compose build frontend
sudo docker compose up -d
sudo docker compose exec backend python manage.py migrate