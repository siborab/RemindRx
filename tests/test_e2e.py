from recommend.recommendation import predict_times
from scanner.model import extract_text_from_label
import pytest
import os

TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

# the end to end test will be more backend focused, testing the cv model extracting text, passing it to the recommendation model for what times
# and then finally to be sent to the database to be stored. 

