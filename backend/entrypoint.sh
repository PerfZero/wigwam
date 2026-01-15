#!/bin/sh
set -e

until python manage.py migrate; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Collecting static files"
python manage.py collectstatic --noinput

echo "Starting gunicorn"
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
