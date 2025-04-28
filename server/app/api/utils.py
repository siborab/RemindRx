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
    

