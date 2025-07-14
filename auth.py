
import bcrypt
import json
import os

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

def register_user(email, password):
    users = load_users()
    if email in users:
        return False
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    users[email] = {"password": hashed}
    save_users(users)
    return True

def authenticate_user(email, password):
    users = load_users()
    if email not in users:
        return False
    return bcrypt.checkpw(password.encode(), users[email]["password"].encode())
