import os
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from scanner.model import extract_text_from_label
from .utils import upload, get_db, get_email, get_patient, get_morning_medications, get_afternoon_medications , get_evening_medications
import tempfile
from recommend.recommend2db import recommend2db

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
        times = recommend2db(extracted_text)
        #insert email functionality here
        #make sure to use the helper function to get the email of the user with the given patient_id 6
        return jsonify({"times": times})
    
    except FileNotFoundError as e:
       return jsonify({"error": str(e)}), 500 
   
    except ValueError as e:
       return jsonify({"error": str(e)}), 500 
    
    except Exception as e:
       return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@models_api.route("/test", methods=["POST",])
def test():
    db = get_db()
    upload(db, 6, "description", "skibidi toilet")
    return jsonify({"gg": "you won"})

@models_api.route("/test2", methods=["GET"]) #should return my email
def test2():
    db = get_db()

    return jsonify({"Email":get_email(db, 6)}) #use the get_email function to get the email of the user with a given patient_id 



#note from jawad- these are methods to get the patient's medications for a given time of day. mainly just debug for the helper functions
@models_api.route("/get_morning", methods=["GET"])
def get_morning():
    db = get_db()
    patient_id = 6
    return jsonify({"Here's the following morning medications we got": get_morning_medications(db, patient_id)}) #get the morning medications for a given patient_id

@models_api.route("/get_afternoon", methods=["GET"])
def get_afternoon():
    db = get_db()
    patient_id = 6
    return jsonify({"Here's the following afternoon medications we got": get_afternoon_medications(db, patient_id)}) #get the afternoon medications for a given patient_id

@models_api.route("/get_evening", methods=["GET"])
def get_evening():
    db = get_db()
    patient_id = 6
    return jsonify({"Here's the following evening medications we got": get_evening_medications(db, patient_id)}) #get the evening medications for a given patient_id
