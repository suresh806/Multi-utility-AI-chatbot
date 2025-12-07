#!/bin/bash
cd /opt/render/project/src
exec gunicorn wsgi:app --bind 0.0.0.0:$PORT
