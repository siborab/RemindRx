import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))) #add the parent directory to the path
from scanner.e2e_scanner2db import scan_and_recommend

def test_scan_and_recommend():
    file_path = os.path.join(os.path.dirname(__file__), "..", "scanner", "images", "test_description.png") #file path for the test image
    recommended_times = scan_and_recommend(file_path)
    assert recommended_times == [["06:00", "18:00"]]  # Replace with the expected output
