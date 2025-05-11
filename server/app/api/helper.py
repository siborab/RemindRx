from supabase import Client
from flask import jsonify

from .utils import get_db

def get_recommended_time_prescriptions(patient_id: int):
    supabase: Client = get_db()

    try: 
        res = (
            supabase
            .from_("recommended_times")
            .select("recommended_time,isTaken,prescription:prescriptions(*)")
            .eq("patient_id", patient_id)
            .execute()
        )
        if res.data[0]:
            return jsonify(res.data), 200
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

def mark_prescription_taken(recommended_time_id: int):
    supabase: Client = get_db()

    try:
        res = (
            supabase
            .from_("recommended_times")
            .update({"isTaken": True})
            .eq("id", recommended_time_id)
            .execute()
        )

        if res.error:
            return {"error": res.error.message}, 500
    
        return jsonify(res.data), 200

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
