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
    
    name = request.form.get("name", "")
    refill_time = request.form.get("refillTime", "")
    refills = request.form.get("refills", "")
    amount = request.form.get("amount", "")
    
    try:
        extracted_text = extract_text_from_label(image)
        times = recommend2db(extracted_text, name, refill_time, refills, amount)
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
#since the helpers already check for valid and invalid output, we can just use exception handling to catch any errors that might occur in the api route
@models_api.route("/get_morning", methods=["GET"])
def get_morning():
    try:
        db = get_db()
        patient_id = request.args.get('patient_id', default=6, type=int) 
        response= get_morning_medications(db, patient_id) #get the patient with a given patient_id
        return response #return the response from the helper function, which is a list of the medications for the given patient_id

    except ValueError as e:
       return jsonify({"error": str(e)}), 500 
    except Exception as e:
       return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
@models_api.route("/get_afternoon", methods=["GET"])
def get_afternoon():
    try:
        db = get_db()
        patient_id = request.args.get('patient_id', default=6, type=int) #get the patient_id from the request args, default to 6 if not provided
        response = get_afternoon_medications(db, patient_id) #get the afternoon medications for a given patient_id
        return response
    except ValueError as e:
       return jsonify({"error": str(e)}), 500 
    #note from jawad- if you want to test this out in postman, use localhost:5000/api/models/get_afternoon?patient_id=5
    #should raise patient id error 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
@models_api.route("/get_evening", methods=["GET"])
def get_evening():
    try:
        db = get_db()
        patient_id = request.args.get('patient_id', default=6, type=int)
        response = get_evening_medications(db, patient_id)
        return response
    except ValueError as e:
       return jsonify({"error": str(e)}), 500 
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500