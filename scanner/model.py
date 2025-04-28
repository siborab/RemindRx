import cv2
import os
import pytesseract
import numpy as np
from PIL import Image

VALID_IMG_TYPES = {'.jpg', '.jpeg', '.png', 'bmp', '.tiff'}

def is_blank_image(image):
    mean_intensity = np.mean(image)
    print(mean_intensity)
    return mean_intensity > 250 # if the intensity is closer to 255, we know there is not much variation in the image, i.e., things are the same color with no text on it 

def preprocess_image_array(image_array): 
    gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian Blur (helps reduce noise)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply Adaptive Thresholding to enhance contrast
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    return thresh


def extract_text_from_label(image_file):
    try:
        img = Image.open(image_file).convert("RGB")
        img_array = np.array(img)
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    except Exception as e:
        print(f"Error opening image: {e}")
        raise ValueError(f"Invalid image: {e}")


    processed_image = preprocess_image_array(img_array)   
    
    # Find contours of text regions
    contours, _ = cv2.findContours(
        processed_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    extracted_texts = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)

        if w < 30 or h < 10:
            continue

        text_region = processed_image[y : y + h, x : x + w]

        # Apply OCR (Tesseract)
        text = pytesseract.image_to_string(text_region, config="--psm 6").strip()

        if text:  # Ignore empty results
            extracted_texts.append(text)

    return "".join(extracted_texts)

# Example usage
# image_path = "./images/hi.txt"
# detected_text = extract_text_from_label(image_path)
# print("Extracted Text:", detected_text)

