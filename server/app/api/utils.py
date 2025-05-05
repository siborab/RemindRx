import os
from datetime import datetime, timezone
from supabase import create_client, Client
from dotenv import load_dotenv
from dataclasses import dataclass, field, asdict


@dataclass
class PrescriptionData:
    def __init__(self):
        medication: str = "Unknown"
        description: str = "Unknown"
        amount: int = 0
        frequency: str = "Unknown"
        refills: int = 0
        refill_time: datetime = field(default_factory=lambda: datetime(1970, 1,1, tzinfo=timezone.utc))
        next_scheduled_time: str = "Unknown"
        last_taken_at: str = "Unknown"
        recommended_times: list = []
        last_sent_time: datetime = field(default_factory=lambda: datetime(1970, 1,1, tzinfo=timezone.utc))
        patient_id: int = 6
    
    def to_dict(self):
        data = asdict(self)
        
        for field_name in ["refill_time", "last_sent_time"]:
            if isinstance(data[field_name], datetime):
                data[field_name] = data[field_name].isoformat()
        
        return data
    
def get_db() -> Client:
    load_dotenv(dotenv_path=".env", override=True)  # pathing for my env in root

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError("Supabase URL and/or Key not found in environment variables.")

    supabase = create_client(url, key)
    return supabase


# takes the auth_id, and returns the patient_id for that auth_id.
def get_patient(db: Client, auth_id):
    response = db.table("users").select("patient_id").eq("auth_id", auth_id).execute()
    if response.data:
        return response.data[0]['id']
    else:
        raise ValueError(f"No patient found for auth_id {auth_id}")

# takes the patient_id, and text
def upload(db: Client, patient_id, prescription_data: PrescriptionData):
    response = db.table("prescriptions").insert(prescription_data.to_dict()).execute()
    
    if response.data:
        return True
    else:
        return False
    
# takes the patient_id, and text
def get_email(db: Client, patient_id: int) -> str:
    """Return the user's email by their id (a.k.a patient_id)."""
    response = (
        db.table("users")
          .select("email")
          .eq("id", patient_id)       
          .maybe_single()
          .execute()
    )

    if response.data and response.data.get("email"):
        return response.data["email"]

    raise ValueError(f"No email found for patient_id {patient_id}")
    


#the below are helper functions to get the medications for a given time of day for a given patient_id 
def get_morning_medications(db: Client, patient_id: int):
    response = (
        db.table("recommended_times")
        .select("recommended_time, prescription_id, prescriptions(medication, description, amount, refills, frequency)")
        .eq("patient_id", patient_id)
        .execute()
    ) #basic query to get the recommended times for a given patient_id

    results = [] #list to hold the results
    for row in response.data:  #the response containts every recommended time for the given patient_id, now we need to filter 
        time_str = row.get("recommended_time", "")  #for each row in the response data, we do a split on the recommended_time to get the hour and minute
        if not time_str or ":" not in time_str:
            continue
        
        hour, minute = map(int, time_str.split(":")) #note we typecast to string for easier manipulation as opposed to '00' 

        #check if after 00:00 and <= 12:00
        if hour == 0 and minute == 0:
            continue  # skip 00:00
        if hour > 12 or (hour == 12 and minute > 0):
            continue  # skip anything after 12:00

        prescription = row.get("prescriptions", {}) #now we append this to the results list, and apply default values for missing fields
        results.append({
            "name": prescription.get("medication") or "N/A",
            "time": time_str,
            "medication": prescription.get("medication") or "N/A",
            "description": prescription.get("description") or "N/A",
            "amount": prescription.get("amount") or 0,
            "refills": prescription.get("refills") or 0,
            "frequency": prescription.get("frequency") or "N/A",
        })

    return results



def get_afternoon_medications(db: Client, patient_id: int):
    response = (
        db.table("recommended_times")
        .select("recommended_time, prescription_id, prescriptions(medication, description, amount, refills, frequency)")
        .eq("patient_id", patient_id)
        .execute()
    ) #basic query to get the recommended times for a given patient_id

    results = [] #list to hold the results
    for row in response.data:  #the response containts every recommended time for the given patient_id, now we need to filter 
        time_str = row.get("recommended_time", "")  #for each row in the response data, we do a split on the recommended_time to get the hour and minute
        if not time_str or ":" not in time_str:
            continue
        
        hour, minute = map(int, time_str.split(":")) #note we typecast to string for easier manipulation as opposed to '00' 

        #check if after 12:00 and <= 15:00
        if (hour < 12) or (hour == 12 and minute == 0) or (hour > 15) or (hour == 15 and minute > 0):
            continue  

        prescription = row.get("prescriptions", {}) #now we append this to the results list, and apply default values for missing fields
        results.append({
            "name": prescription.get("medication") or "N/A",
            "time": time_str,
            "medication": prescription.get("medication") or "N/A",
            "description": prescription.get("description") or "N/A",
            "amount": prescription.get("amount") or 0,
            "refills": prescription.get("refills") or 0,
            "frequency": prescription.get("frequency") or "N/A",
        })

    return results


def get_evening_medications(db: Client, patient_id: int):
    response = (
        db.table("recommended_times")
        .select("recommended_time, prescription_id, prescriptions(medication, description, amount, refills, frequency)")
        .eq("patient_id", patient_id)
        .execute()
    ) #basic query to get the recommended times for a given patient_id

    results = [] #list to hold the results
    for row in response.data:  #the response containts every recommended time for the given patient_id, now we need to filter 
        time_str = row.get("recommended_time", "")  #for each row in the response data, we do a split on the recommended_time to get the hour and minute
        if not time_str or ":" not in time_str:
            continue
        
        hour, minute = map(int, time_str.split(":")) #note we typecast to string for easier manipulation as opposed to '00' 

        #check if after 15:00 and <= 24:00
        if (hour < 15) or (hour == 15 and minute == 0) or (hour > 24) or (hour == 24 and minute > 0):
            continue  
        
        prescription = row.get("prescriptions", {}) #now we append this to the results list, and apply default values for missing fields
        results.append({
            "name": prescription.get("medication") or "N/A",
            "time": time_str,
            "medication": prescription.get("medication") or "N/A",
            "description": prescription.get("description") or "N/A",
            "amount": prescription.get("amount") or 0,
            "refills": prescription.get("refills") or 0,
            "frequency": prescription.get("frequency") or "N/A",
        })

    return results