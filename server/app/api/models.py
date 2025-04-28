import os
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from scanner.model import extract_text_from_label
import tempfile


models_api = Blueprint("models_api", "models_api", url_prefix="/api/models")

CORS(models_api)


@models_api.route("/", methods=["GET"])
def index():
    return jsonify("Models API is working!")

# TODO: Modify this function to save data to database with user_id. Return the recommended times.
@models_api.route("/scan", methods=["POST"])
def scan():
    if "image" not in request.files:
        return jsonify({"error": "No image part in request"}), 400
    
    image  = request.files["image"]
    
    if image.filename == '':
        return jsonify({"error": "No file was selected"}), 400
    
    try:
        extracted_text = extract_text_from_label(image)
        
        return jsonify({"text": extracted_text})

    except FileNotFoundError as e:
       return jsonify({"error": str(e)}), 500 
   
    except ValueError as e:
       return jsonify({"error": str(e)}), 500 
    
    except Exception as e:
       return jsonify({"error": f"Unexpected error: {str(e)}"}), 500 