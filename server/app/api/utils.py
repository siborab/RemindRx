import os
from supabase import create_client, Client
from dotenv import load_dotenv

def get_db() -> Client:
    load_dotenv(dotenv_path='.env', override=True)   #pathing for my env in root
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError("Supabase URL and/or Key not found in environment variables.")

    supabase = create_client(url, key)
    return supabase
    
# takes the auth_id, and returns the patient_id for that auth_id. 
def get_patient(db: Client, auth_id):
    pass

# takes the patient_id, and text
def upload_recs(db: Client, patient_id, text):
    pass