#!/bin/bash
pip install -r requirements.txt

cd affordable-housing
python manage.py makemigrations
python manage.py migrate

python manage.py runserver