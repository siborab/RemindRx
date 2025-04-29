import io
import os
from PIL import Image, ImageDraw, ImageFont

def create_high_quality_test_image(text=None, color=(255,255,255)) -> io.BytesIO:
    """Creates a higher-quality in-memory image with optional text."""
    image = Image.new("RGB", (600, 200), color=color)
    draw = ImageDraw.Draw(image)

    try:
        # Use a real font
        font_path = os.path.join(os.path.dirname(__file__), "assets", "DejaVuSans-Bold.ttf")
        font = ImageFont.truetype(font_path, size=48)  # Large font size
    except IOError:
        print("Failed to load font:", e)
        font = ImageFont.load_default()

    if text:
        draw.text((10, 80), text, fill=(0, 0, 0), font=font)

    img_bytes = io.BytesIO()
    image.save(img_bytes, format="JPEG", dpi=(300,300))  # 300 DPI for better OCR
    img_bytes.seek(0)
    return img_bytes
