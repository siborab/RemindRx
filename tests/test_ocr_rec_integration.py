import pytest
import os
from PIL import Image, ImageDraw, ImageFont
import io
from tests.model_utils import create_high_quality_test_image
from recommend.recommendation import predict_times
from scanner.model import extract_text_from_label

#  === Integration tests ===
# def create_test_image_with_text(text: str) -> str:
#     """Creates a temporary image with given text and returns its path."""
#     image = Image.new("RGB", (300, 100), color=(255, 255, 255))
#     draw = ImageDraw.Draw(image)
#     font = ImageFont.load_default()
#     draw.text((10, 40), text, fill=(0, 0, 0), font=font)

#     img_bytes = io.BytesIO()
#     image.save(img_bytes, format="PNG")
#     img_bytes.seek(0)
#     return img_bytes

def test_recommendation_from_text():
    """Integration test for extract_text_from_label + predict_times."""
    test_image = create_high_quality_test_image("Take twice a day")
    detected_text = extract_text_from_label(test_image)

    assert isinstance(detected_text, str)
    assert len(detected_text) > 0

    times = predict_times(detected_text)
    assert isinstance(times, list)
    assert len(times) > 0

# === Individual behavior tests ===
def test_corrupted_image_raises():
    """Test that a corrupted image raises a ValueError."""
    bad_bytes = io.BytesIO(b"This is not a valid image")
    
    with pytest.raises(ValueError, match="Invalid image"):
        extract_text_from_label(bad_bytes)

def test_predict_times_with_empty_text():
    """Test that predict_times handles empty text gracefully."""
    predicted_times = predict_times("")
    assert predicted_times == ["No matching times found"], "Expected fallback message for empty input"
