from supabase import create_client, Client
import os
from dotenv import load_dotenv
from recommend.recommendation import predict_times

def recommend2db(text: str, name: str, refill_time: str, refills: str, amount: str):
    load_dotenv(dotenv_path='.env', override=True)   #pathing for my env in root
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")


    #exception handling for bad input text
    #we DO NOT want to insert "No matching times found" into the database

     
    if not url or not key: #supabase connection check
        raise EnvironmentError("Missing or invalid Supabase URL or key. Please check thee .env file.")
    supabase= create_client(url, key)
    predicted_times = predict_times(text)

    # if model can’t match, quit early
    if "No matching times found" in predicted_times:
        return []
    
    insert_response = supabase.table("prescriptions").insert({
        "patient_id": 6,  #set to patient 6 just for demo purposes
        "description": text,
        "medication": name,
        "amount": amount,
        "refill_time": refill_time,
        "refills": refills
    }).execute()


    prescription_id = insert_response.data[0]['id'] #supabase assigns an id to the prescription when it is inserted, we wanna grab that for later

    #insert each recommended time into recommended_times table
    inserted_times = []
    for time in predicted_times:
        supabase.table("recommended_times").insert({
            "recommended_time": time,
            "prescription_id": prescription_id,
            "patient_id": 6, #again, use patient 6 for demo purposes
            "isTaken": None  # optional
        }).execute()
        inserted_times.append(time)

    return inserted_times

def delete(time):

    load_dotenv(dotenv_path='.env', override=True)   #pathing for my env in root

    url= os.getenv("SUPABASE_URL")
    key= os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise EnvironmentError("Missing or invalid Supabase URL or key. Please check thee .env file.")

    supabase = create_client(url, key)
    response = supabase.table("prescriptions").delete().eq("recommended_times", ["06:00", "18:00"]).execute() #if the insert works it'll delete this from the database
    return response