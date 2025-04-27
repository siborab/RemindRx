import os
import pytest
import io
from tests.model_utils import create_high_quality_test_image
from PIL import Image, ImageDraw, ImageFont
from scanner.model import extract_text_from_label

def test_valid_label():
    image_file = create_high_quality_test_image("Nothing")    
    detected_text = extract_text_from_label(image_file)
    
    assert isinstance(detected_text, str)
    assert detected_text.lower() == "nothing"

def test_empty_image():
    image_file = create_high_quality_test_image()
    detected_text = extract_text_from_label(image_file)
    assert detected_text == ""

def test_invalid_image_format():
    bad_bytes = io.BytesIO(b"This is not an image")
    with pytest.raises(ValueError):
        extract_text_from_label(bad_bytes)