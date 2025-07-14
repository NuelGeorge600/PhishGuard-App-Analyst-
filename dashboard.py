from flask import Blueprint, request, jsonify, render_template_string
import os

dashboard = Blueprint("dashboard", __name__)

@dashboard.route("/dashboard")
def show_dashboard():
    api_key = request.args.get("key")
    if api_key != os.getenv("INTERNAL_API_KEY", ""):
        return "Unauthorized", 401

    log_file = "analytics.log"
    safe_count = malicious_count = error_count = total = 0
    recent = []

    if os.path.exists(log_file):
        with open(log_file) as f:
            lines = f.readlines()[-50:]
            for line in lines:
                if '"status": "safe"' in line:
                    safe_count += 1
                elif '"status": "malicious"' in line:
                    malicious_count += 1
                elif '"status": "error"' in line:
                    error_count += 1
                total += 1
                recent.append(line.strip())

    html = f'''
    <html>
    <head><title>PhishGuard Analytics</title></head>
    <body style="font-family:sans-serif;padding:20px;">
        <h2>📊 PhishGuard Analytics</h2>
        <p><strong>Total Scans:</strong> {total}</p>
        <p><strong>Safe URLs:</strong> {safe_count}</p>
        <p><strong>Malicious URLs:</strong> {malicious_count}</p>
        <p><strong>Errors:</strong> {error_count}</p>
        <h4>Recent Scans</h4>
        <pre style="background:#f4f4f4;padding:10px;border:1px solid #ccc;max-height:400px;overflow:auto;">\n{chr(10).join(recent)}</pre>
    </body>
    </html>
    '''
    return html