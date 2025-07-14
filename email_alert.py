import smtplib
from email.mime.text import MIMEText
from os import getenv

def send_email_alert(url, vendor_data):
    sender = getenv("ALERT_EMAIL_USER")
    password = getenv("ALERT_EMAIL_PASS")
    recipient = getenv("ALERT_EMAIL_TO")

    if not sender or not password or not recipient:
        print("Email alert skipped due to missing environment variables.")
        return

    subject = "PhishGuard Alert: Malicious URL Detected"
    body = f"A URL was flagged as suspicious:\n\n{url}\n\nDetails:\n{vendor_data}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, recipient, msg.as_string())
        print("Alert email sent.")
    except Exception as e:
        print("Failed to send email:", e)