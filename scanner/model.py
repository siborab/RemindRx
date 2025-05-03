import cv2
import os
import pytesseract
import numpy as np
from PIL import Image,ImageOps

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
    """
    Accepts an in-memory file (BytesIO) or a file-like object.
    """
    try:
        img = Image.open(image_file).convert("RGB")
        img_array = np.array(img)
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)  # Convert to BGR for OpenCV
    except Exception as e:
        print(f"Error opening image: {e}")
        raise ValueError(f"Invalid image: {e}")

    processed_image = preprocess_image_array(img_array)

    # Optional: Uncomment this if you want to skip blank images
    # if is_blank_image(processed_image):
    #     return ""

    # Find contours of text regions
    contours, _ = cv2.findContours(
        processed_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    extracted_texts = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)

        if w < 30 or h < 10:
            continue

        text_region = processed_image[y:y + h, x:x + w]

        # Apply OCR (Tesseract)
        text = pytesseract.image_to_string(text_region, config="--psm 6").strip()

        if text:
            extracted_texts.append(text)

    return "".join(extracted_texts)


# def extract_text_from_label(image_file) -> str:
#     """
#     Reads a BytesIO / file-like object or a file path,
#     runs a quick pre-process, then OCRs it with Tesseract.
#     """
#     # 1) rewind if it’s a BytesIO / open file handle
#     if hasattr(image_file, "seek"):
#         image_file.seek(0)

#     # 2) load & validate
#     try:
#         img = Image.open(image_file)
#     except Exception as e:
#         raise ValueError("Invalid image") from e

#     # 3) make the text pop (grayscale → upscale → autocontrast)
#     img = (
#         img.convert("L")                                   # to gray
#            .resize((img.width * 2, img.height * 2), Image.BICUBIC)
#     )
#     img = ImageOps.autocontrast(img)

#     # 4) OCR – psm 7 = “single text line”, good for labels
#     text = pytesseract.image_to_string(
#         img,
#         config="--psm 7 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
#     ).strip()

#     return text
# Example usage
# image_path = "./images/hi.txt"
# detected_text = extract_text_from_label(image_path)
# print("Extracted Text:", detected_text)

