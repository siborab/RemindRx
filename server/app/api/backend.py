from flask import Blueprint, request, jsonify
from flask_cors import CORS
from .helper import get_recommended_time_prescriptions, mark_prescription_taken

backend_api = Blueprint("backend_api", "backend_api", url_prefix="/api")

CORS(backend_api)


@backend_api.route("/", methods=["GET"])
def index():
    return jsonify("Backend API is working!")

@backend_api.route("/prescriptions", methods=["POST"])
def prescriptions():
    data = request.get_json()
    patient_id = data.get("patient_id")

    if not patient_id:
        return {"error": "Patient ID not valid"}, 400
    
    return get_recommended_time_prescriptions(patient_id)

@backend_api.route("/make-prescription-taken", methods=["POST"])
def mark_prescription():
    data = request.get_json()
    recommended_time_id = data.get("recommended_time_id")

    if not recommended_time_id:
        return {"error": "Recommended Time ID not valid or not provided"}, 400
    
    return mark_prescription_taken(recommended_time_id)


