import os
import pytest
import io
from PIL import Image, ImageDraw, ImageFont
from scanner.model import extract_text_from_label

# Get the absolute path to the tests directory
# TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def create_image(text=None, color=(255,255,255)) -> str:
    image = Image.new("RGB", (200,100), color=color)
    
    if text:
        draw = ImageDraw.Draw(image)
        try:
            font = ImageFont.load_default()
        except IOError:
            font = None
        
        draw.text((10,40), text, fill=(0,0,0), font=font)
        
    img_bytes = io.BytesIO()
    image.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    return img_bytes

def test_valid_label():
    image_file = create_image("Nothing")    
    detected_text = extract_text_from_label(image_file)
    
    assert isinstance(detected_text, str)
    # nty corresponds to "nothing"
    assert detected_text.lower() == "ety"

def test_empty_image():
    image_file = create_image()
    detected_text = extract_text_from_label(image_file)
    assert detected_text == ""

def test_invalid_image_format():
    bad_bytes = io.BytesIO(b"This is not an image")
    with pytest.raises(ValueError):
        extract_text_from_label(bad_bytes)