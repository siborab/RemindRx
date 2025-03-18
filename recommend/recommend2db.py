from supabase import create_client, Client
import os
from dotenv import load_dotenv
from recommend.recommendation import predict_times

def recommend2db(text):

    load_dotenv('.env') #pathing for my env in root
    url= os.getenv("SUPABASE_URL")
    key= os.getenv("SUPABASE_KEY")
    supabase = create_client(url, key)
    response= supabase.table("prescriptions").select("recommended_times").execute()
    #print(response.data)
    #print("Inserting a new prescription into the database hopefully...")
    supabase.table("prescriptions").insert({"recommended_times": predict_times(text)}).execute() # try text for "Take one tablet twice daily"
    response= supabase.table("prescriptions").select("recommended_times").execute()
    all_lists = [row["recommended_times"] for row in response.data]
    return all_lists[-1:] #return the last entry in the list of prescriptions. this is a hacky way to do it but it works for now
    #print(all_lists)

def delete(time):

    load_dotenv('../.env') #pathing for my env in root

    url= os.getenv("SUPABASE_URL")
    key= os.getenv("SUPABASE_KEY")
    supabase = create_client(url, key)
    response = supabase.table("prescriptions").delete().eq("recommended_times", ["06:00", "18:00"]).execute() #if the insert works it'll delete this from the database
    return response