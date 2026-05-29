from flask import Flask, render_template, request, jsonify
import resend
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

resend.api_key = os.environ.get('RESEND_API_KEY')

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/request-resume", methods=['POST'])
def request_resume():
    try:
        data = request.json
        visitor_info = {
            'ip': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', 'Unknown'),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'email': data.get('email', 'Not provided'),
            'name': data.get('name', 'Anonymous')
        }

        resend.Emails.send({
            "from": "Portfolio <onboarding@resend.dev>",
            "to": "richardkurtramirez@gmail.com",
            "subject": "Resume Request from Your Portfolio",
            "text": f"""
You have received a resume request!

Name: {visitor_info['name']}
Email: {visitor_info['email']}
IP Address: {visitor_info['ip']}
Time: {visitor_info['timestamp']}
User Agent: {visitor_info['user_agent']}
            """
        })

        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route("/send-message", methods=['POST'])
def send_message():
    try:
        data = request.json

        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        resend.Emails.send({
            "from": "Portfolio Inquiry <onboarding@resend.dev>",
            "to": "richardkurtramirez@gmail.com",
            "subject": f"Portfolio Inquiry: {subject}",
            "reply_to": email,
            "text": f"""
New message from your portfolio website

Name: {name}
Email: {email}

Subject:
{subject}

Message:
{message}
            """
        })

        return jsonify({
            'success': True,
            'message': 'Message sent successfully!'
        }), 200

    except Exception as e:
        print(f"Error sending message: {str(e)}")

        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)