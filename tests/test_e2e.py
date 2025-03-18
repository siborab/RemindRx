from recommend.recommendation import predict_times
from scanner.model import extract_text_from_label
import pytest
import os
import sys

TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

# the end to end test will be more backend focused, testing the cv model extracting text, passing it to the recommendation model for what times
# and then finally to be sent to the database to be stored. 

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))) #add the parent directory to the path
from scanner.e2e_scanner2db import scan_and_recommend

def test_scan_and_recommend():
    file_path = os.path.join(os.path.dirname(__file__), "..", "scanner", "images", "test_description.png") #file path for the test image
    recommended_times = scan_and_recommend(file_path)
    assert recommended_times == [["06:00", "18:00"]]  # Replace with the expected output
