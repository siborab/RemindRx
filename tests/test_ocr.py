import pytest
import os
from scanner.model import extract_text_from_label

# Get the absolute path to the tests directory
TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def test_valid_label():
    image_path = os.path.join(TEST_ASSETS_DIR, "nothing.jpg")
    detected_text = extract_text_from_label(image_path)
    assert isinstance(detected_text, str)
    assert detected_text.lower() == "nothing"

def test_empty_image():
    image_path = os.path.join(TEST_ASSETS_DIR, "black.jpg")
    detected_text = extract_text_from_label(image_path)
    assert detected_text == ""

def test_non_existant_file():
    image_path = os.path.join(TEST_ASSETS_DIR, "doesnotexist.jpg")
    with pytest.raises(FileNotFoundError):
        extract_text_from_label(image_path)

def test_invalid_image_format():
    invalid_file = os.path.join(TEST_ASSETS_DIR, "not_an_image.txt")
    
    with open(invalid_file, "w+") as f:
        f.write("This is not an image")

    with pytest.raises(ValueError):
        extract_text_from_label(invalid_file)

    os.remove(invalid_file)
