import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import pytz
import time
import logging
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

# hide supabase internal HTTP logs from being shown in output
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

LOG_PATH = os.path.join(os.path.dirname(__file__), 'medication_reminder.log')
logging.basicConfig(filename=LOG_PATH, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_due_medications():
    """Fetch prescriptions that are due for a reminder email."""
    now = datetime.now(pytz.utc).isoformat()

    try:
        response = supabase.table("prescriptions").select(
            "id, medication, amount, description, next_scheduled_time, last_sent_time, users (id, email, first_name)"
        ).lte("next_scheduled_time", now).execute()
    except Exception as e:
        logging.error(f"Error fetching prescriptions: {e}")
        return []

    prescriptions = response.data or []

    due_list = []
    for p in prescriptions:
        user = p.get("users") 
        if not user:
            continue
        email = user.get("email")
        first_name = user.get("first_name")
        if email is None:
            continue
        last_sent_time = p.get("last_sent_time")
        next_scheduled_time = p.get("next_scheduled_time")

        if last_sent_time is None or last_sent_time < next_scheduled_time:
            due_list.append({
                "email": email,
                "first_name": first_name,
                "medication": p.get("medication"),
                "amount": p.get("amount"),
                "description": p.get("description"),
                "id": p.get("id"),
            })

    return due_list

 #Update the prescription's last_sent_time to now
def mark_email_sent(prescription_id):
    now = datetime.now(pytz.utc).isoformat()

    try:
        update_response = supabase.table("prescriptions").update({
            "last_sent_time": now
        }).eq("id", prescription_id).execute()
    except Exception as e:
        logging.error(f"Error updating last_sent_time for prescription ID {prescription_id}: {e}")
        return

    logging.info(f"Updated last_sent_time for prescription ID {prescription_id}.")

# send email reminder for due medication
def send_email(to_email, first_name, medication, amount, description, prescription_id):
    subject = f"Time for your {medication} medication"
    body = f"Hi {first_name},\n\nIt's time to take your {medication} medication. Take {amount} pill(s)."

    if description:
        body += f"\n\nMedication Description: {description}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        server.quit()
        logging.info(f"Email sent to {to_email} for medication {medication}.")

        # Mark as sent in db
        mark_email_sent(prescription_id)
    except Exception as e:
        logging.error(f"Error sending email to {to_email}: {e}")

# check for due perscription and send reminders every 60s
def main():
    while True:
        due_medications = get_due_medications()
        if due_medications:
            for item in due_medications:
                send_email(
                    item['email'],
                    item['first_name'],
                    item['medication'],
                    item['amount'],
                    item.get('description'),
                    item['id']
                )
        else:
            logging.info("No medications are due at this time.")
        time.sleep(60)

if __name__ == "__main__":
    logging.info("Starting medication reminder script.")
    main()
