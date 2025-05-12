import sys
import os
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.app.factory import create_app
from server.app.api.utils import get_db, send_summary_email

app = create_app()  # ✅ This must be top-level so it can be imported

if __name__ == "__main__":
    try:
        db = get_db()
        send_summary_email(db, 6)
    except Exception as e:
        print(f"Error sending summary email: {e}")

    app.run(port=8080, debug=True, use_reloader=False)
