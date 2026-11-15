"""
Database module for prediction history using SQLite.
Stores user prediction records with timestamps, features, and predicted valuations.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'predictions.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prediction_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            city TEXT NOT NULL,
            area_sqft REAL NOT NULL,
            bhk INTEGER NOT NULL,
            bathrooms INTEGER NOT NULL,
            floors INTEGER NOT NULL,
            property_age INTEGER NOT NULL,
            parking TEXT NOT NULL,
            furnishing TEXT NOT NULL,
            property_type TEXT NOT NULL,
            predicted_price REAL NOT NULL,
            price_lower REAL NOT NULL,
            price_upper REAL NOT NULL,
            formatted_price TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            forwarded INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

def save_contact_inquiry(name, email, subject, message):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('''
        INSERT INTO contact_inquiries (timestamp, name, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ''', (now_iso, name, email, subject, message))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_contact_inquiries(limit=50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contact_inquiries ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    inquiries = [dict(row) for row in rows]
    conn.close()
    return inquiries

def save_prediction(record):
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('''
        INSERT INTO prediction_history (
            timestamp, city, area_sqft, bhk, bathrooms, floors,
            property_age, parking, furnishing, property_type,
            predicted_price, price_lower, price_upper, formatted_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        now_iso,
        record['city'],
        float(record['area_sqft']),
        int(record['bhk']),
        int(record['bathrooms']),
        int(record['floors']),
        int(record['property_age']),
        record['parking'],
        record['furnishing'],
        record['property_type'],
        float(record['predicted_price']),
        float(record['price_lower']),
        float(record['price_upper']),
        record['formatted_price']
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_all_history(limit=100):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM prediction_history 
        ORDER BY id DESC 
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    history = [dict(row) for row in rows]
    conn.close()
    return history

def delete_single_history(record_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM prediction_history WHERE id = ?', (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM prediction_history')
    conn.commit()
    conn.close()
    return True
