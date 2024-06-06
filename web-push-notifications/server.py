from flask import Flask, request, jsonify
from pywebpush import webpush, WebPushException

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

public_vapid_key = 'BBhBkM0W8x3qpogVpX6S4x40zDi_BosKA7gwr7lsH13PhgYi0FpUvXE8Ut4zYVgoeTHp9HP3Y3JEnzHeet8W3lw'  # Replace with your public VAPID key
private_vapid_key = 'S7cmw0VY70Ym7UyOJP-9G5BZQL0PwQhAxjHxTdLpJ98'  # Replace with your private VAPID key

# VAPID claim with contact email
vapid_claims = {
    "sub": "mailto:seth.pattee@students.snow.edu"  # Replace with your email
}

@app.route('/register', methods=['POST'])
def register():
    # A real-world application would store the subscription info.
    return '', 201

@app.route('/sendNotification', methods=['POST'])
def send_notification():
    data = request.json

    subscription_info = {
        "endpoint": data['endpoint'],
        "keys": {
            "p256dh": data['key'],
            "auth": data['authSecret']
        }
    }

    payload = {
        "title": data['title'],
        "icon": data['icon'],
        "body": data['body'],
        "url": data['link']
    }

    try:
        webpush(
            subscription_info,
            json.dumps(payload),
            vapid_private_key=private_vapid_key,
            vapid_claims=vapid_claims
        )
        print("Push notification sent successfully")
        return '', 201
    except WebPushException as ex:
        print('Error sending push notification', repr(ex))
        return '', 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
