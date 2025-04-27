from flask import Flask, jsonify
from flask_cors import CORS
from app.api.models import models_api

def create_app():

    # APP_DIR = os.path.abspath(os.path.dirname(__file__))
    # STATIC_FOLDER = os.path.join(APP_DIR, 'build/static')
    # TEMPLATE_FOLDER = os.path.join(APP_DIR, 'build')

    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(models_api)
    
    @app.route('/')
    def welcome():
        return jsonify("api is funtional")
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Route not found"}), 404

    return app