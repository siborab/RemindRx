import cv2
import pytesseract
import numpy as np

def preprocess_image(image_path):
    # Load image
    image = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian Blur (helps reduce noise)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply Adaptive Thresholding to enhance contrast
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    return thresh

def extract_text_from_label(image_path):
    # Preprocess the image
    processed_image = preprocess_image(image_path)

    # Find contours of text regions
    contours, _ = cv2.findContours(
        processed_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    extracted_texts = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)

        # Ignore very small regions (likely noise)
        if w < 30 or h < 10:
            continue

        # Crop detected text area
        text_region = processed_image[y : y + h, x : x + w]

        # Apply OCR (Tesseract)
        text = pytesseract.image_to_string(text_region, config="--psm 6").strip()

        if text:  # Ignore empty results
            extracted_texts.append(text)

    return extracted_texts

# Example usage
image_path = "label4.jpg"
detected_text = extract_text_from_label(image_path)
print("Extracted Text:", detected_text)

