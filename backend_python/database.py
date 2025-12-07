"""
Database initialization module
Separates database setup from app to avoid circular imports
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
