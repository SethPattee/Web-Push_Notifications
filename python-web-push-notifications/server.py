from flask import Flask, request, jsonify, send_from_directory
from pywebpush import webpush, WebPushException
import json
import os

app = Flask(__name__, static_url_path='', static_folder='static')

# Replace with your VAPID keys
public_vapid_key = 'BBhBkM0W8x3qpogVpX6S4x40zDi_BosKA7gwr7lsH13PhgYi0FpUvXE8Ut4zYVgoeTHp9HP3Y3JEnzHeet8W3lw'
private_vapid_key = 'S7cmw0VY70Ym7UyOJP-9G5BZQL0PwQhAxjHxTdLpJ98'

vapid_claims = {
    "sub": "mailto:seth.pattee@students.snow.edu"  # Replace with your email
}

subscriptions = []  # List to store subscription details

# Serve the index.html file
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files
@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(app.static_folder, path)

@app.route('/register', methods=['POST'])
def register():
    subscription = request.json
    subscriptions.append(subscription)
    return '', 201

@app.route('/sendNotification', methods=['POST'])
def send_notification():
    data = request.json
    payload = {
        "title": data['title'],
        "icon": data['icon'],
        "body": data['body'],
        "url": data['link']
    }

    for subscription in subscriptions:
        try:
            webpush(
                subscription_info=subscription,
                data=json.dumps(payload),
                vapid_private_key=private_vapid_key,
                vapid_claims=vapid_claims
            )
            print("Push notification sent successfully")
        except WebPushException as ex:
            print('Error sending push notification:', repr(ex))
            return jsonify({"error": repr(ex)}), 500

    return '', 201

if __name__ == '__main__':
    app.run(port=5000, debug=True)


#to run
#conda create -n push-notification-env python=3.9
#conda activate push-notification-env
#pip install flask pywebpush
#python path/to/your/server.py
#Now open http://localhost:5000
