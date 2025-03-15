from pytesseract.pytesseract import string
import pytest
import os
from model import extract_text_from_label

def test_valid_label():
    """
    Test if our model correctly extracts known text from a sample image
    """
    image_path = "./label.jpg"
    detected_text = extract_text_from_label(image_path)

    assert isinstance(detected_text, str) # we know that our output has to be a string
    assert "Nothing" in detected_text # we know what the text in this image should be

def test_empty_image():

