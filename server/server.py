import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.app.factory import create_app
from server.app.api.utils import get_db, send_summary_email

app = create_app()  # ✅ This must be top-level so it can be imported

if __name__ == "__main__":
    #only run on first real process not flask reloader subprocess (no double emails)
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        try:
            db = get_db()
            send_summary_email(db, 6)
        except Exception as e:
            print(f"Error sending summary email: {e}")
        
    app.config['DEBUG'] = True
    app.run(port=8080)
