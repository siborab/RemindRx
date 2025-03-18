from recommend.recommend2db import recommend2db
from recommend.recommendation import predict_times
from supabase import create_client, Client
import os
from dotenv import load_dotenv

def test_good():
    assert recommend2db("Take one tablet twice daily") == [["06:00", "18:00"]]
    assert recommend2db("Take one tablet once daily") == [["13:00"]]

def test_bad():
    assert recommend2db("") == [["No matching times found"]]
    assert recommend2db("this is a meme input") == [["No matching times found"]]