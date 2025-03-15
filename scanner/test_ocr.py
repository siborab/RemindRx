from pytesseract.pytesseract import string
import pytest
import os
from model import extract_text_from_label

def test_valid_label():
    """
    Test if our model correctly extracts known text from a sample image
    """
    image_path = "./images/nothing.jpg"
    detected_text = extract_text_from_label(image_path)

    assert isinstance(detected_text, str) # we know that our output has to be a string
    assert detected_text == "nothing" # we know what the text in this image should be

def test_empty_image():
    """Test if our model correctly handles images with no text in it"""
    image_path = "./images/black.jpg"
    detected_text = extract_text_from_label(image_path)

    assert detected_text == ""

def test_non_existant_file():
    image_path = "./images/doesnotexist.jpg"
    with pytest.raises(FileNotFoundError):
        extract_text_from_label(image_path)


def test_invalid_image_format():
    """Test if our model can handle invalid file formats"""
    invalid_file = "./images/not_an_image.txt"

    with open(invalid_file, "w") as f:
        f.write("This is not an image")

    with pytest.raises(ValueError):
        extract_text_from_label(invalid_file)

    os.remove(invalid_file)




