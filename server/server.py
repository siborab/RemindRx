import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.factory import create_app

app = create_app()
if __name__ == "__main__":
    app.config['DEBUG'] = True
    app.run(port=8080)