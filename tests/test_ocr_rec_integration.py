from recommend.recommendation import predict_times
from scanner.model import extract_text_from_label
import pytest
import os

TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")


def test_recommendation_from_text():
    # read the text from the image
    image_path = os.path.join(TEST_ASSETS_DIR, "prescription.jpg")
    
    detected_text = extract_text_from_label(image_path)
    
    assert isinstance(detected_text, str)
    assert len(detected_text) > 0
    
    times = predict_times(detected_text)
    
    assert isinstance(times, list)
    assert len(times) > 0
    
@pytest.fixture
def create_corrupted_image():
    """Fixture to create and clean up a corrupted image file."""
    corrupted_image_path = os.path.join(TEST_ASSETS_DIR, "corrupted_image.jpg")
    os.makedirs(TEST_ASSETS_DIR, exist_ok=True)

    with open(corrupted_image_path, "wb") as f:
        f.write(b"This is not a valid image, despite having the img file extension")
    
    yield corrupted_image_path  # Provide the path to the test

    os.remove(corrupted_image_path)  # Cleanup after the test

def test_recommendation_error_handling(create_corrupted_image):
    """Test error handling for invalid image input and empty text"""
    
    # Case 1: Non-existent image
    with pytest.raises(FileNotFoundError):
        extract_text_from_label(os.path.join(TEST_ASSETS_DIR, "non_existent.jpg"))

    # Case 2: Corrupted or invalid image
    invalid_image_path = create_corrupted_image  # Use fixture-provided path
    
    with pytest.raises(ValueError, match="could not be read"):
        extract_text_from_label(invalid_image_path)

    # Case 3: Passing empty text to predict_times
    predicted_times = predict_times("")
    assert predicted_times == ["No matching times found"], "Should return 'No matching times found' for empty input"

