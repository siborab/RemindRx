import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.app.factory import create_app

app = create_app()  # ✅ This must be top-level so it can be imported

if __name__ == "__main__":
    app.config['DEBUG'] = True
    app.run(port=8080)
