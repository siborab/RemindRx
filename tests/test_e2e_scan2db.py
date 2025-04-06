import os
import sys
import tempfile
import io
from PIL import Image, ImageDraw, ImageFont, ImageOps

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))) #add the parent directory to the path
from scanner.e2e_scanner2db import scan_and_recommend

 
def create_test_image(text): #function to create a test image with text
    image = Image.new("RGB", (1200, 400), color="white")
    draw = ImageDraw.Draw(image)
    
    try:
        font = ImageFont.truetype("arial.ttf", 60) #using a truetype font and big font size
    except IOError:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((image.width - text_width) // 2, (image.height - text_height) // 2) #center the text to improve OCR accuracy

    draw.text(position, text, font=font, fill="black") #draw the text on the image
    
    image = image.convert("L") #convert to grayscale to improve OCR accuracy
    image = ImageOps.autocontrast(image)

    #savse the image into a BytesIO buffer
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)
    return img_byte_arr #return the buffer in bytes

def test_scan_and_recommend():
    image_bytes = create_test_image("take one tablet twice a day")
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file: #using temp file instead of hard disk
        tmp_file.write(image_bytes.read())
        tmp_file_path = tmp_file.name

    try: 
        # call the function with the temporary file's path
        recommended_times = scan_and_recommend(tmp_file_path)
        assert recommended_times == [["06:00", "18:00"]]
    finally:
        os.remove(tmp_file_path) #cleanup the temporary file out of memory

