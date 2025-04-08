# Documenting the System Architecture

## Component Diagram
!(SystemArchitecture.md)

The streamlit UI inputs an image file to the OCR model which extracts the text and inputs it to the Scikit-Learn model that parses the information. From this, it creates recommended times for the medication to be taken and inserts into the Supabase DB. 
The Next.js UI (frontend) allows the user to login and authorize their login credentials. Once authorized through the Node.js server, it pulls the user’s prescription info from the db.

## Entity Diagram
!(EntityDiagram.png)

User authentication is handled by the Supabase auth.users table, which stores each user's email and password securely. The users table stores profile information like first name, last name, and auth_id, which references the id field in auth.users. The prescriptions table records individual medication schedules and is linked to the users table through a foreign key called patient. The prescriptions table has fields like the medication name, dosage amount, next scheduled time for taking the medication, and the last time a reminder email was sent. This db structure allows a one-to-many relationship where a single user can have multiple prescriptions.

## Sequence Diagram - Send Email Flow
!(EmailReminderSequenceDiagram.png)

The script will log when it begins. It will check the database every minute to see which prescriptions have a [ next_scheduled_time ] value that is <= the current time and more recent than the [ last_sent_time ] value (a medication is due and the notification hasn’t been sent since it’s been due). If no medication is due, that is logged. If medications are due, for each due medication connect to SMTP Server and send a request to send a reminder email. The SMTP Server will deliver the email to the user and the time and recipient of the sent reminder will be logged. The table will then be updated to indicate the most recent time the user was notified and the log will be updated accordingly. 
