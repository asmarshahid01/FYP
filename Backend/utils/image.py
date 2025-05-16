import cv2
import numpy as np
import pytesseract
from PIL import Image
import sys

def is_image_inside_sift(in1_path, in2_path, good_match_ratio=0.7, min_inliers=10):
    img1 = cv2.imread(in1_path, cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imread(in2_path, cv2.IMREAD_GRAYSCALE)

    if img1 is None or img2 is None:
        raise ValueError("Could not load one of the images.")

    # Use SIFT from opencv-contrib
    sift = cv2.SIFT_create()
    kp1, des1 = sift.detectAndCompute(img1, None)
    kp2, des2 = sift.detectAndCompute(img2, None)

    if des1 is None or des2 is None:
        return False

    # FLANN-based matcher
    index_params = dict(algorithm=1, trees=5)  # FLANN_INDEX_KDTREE = 1
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)

    matches = flann.knnMatch(des1, des2, k=2)

    # Apply Lowe's ratio test
    good = []
    for m_n in matches:
        if len(m_n) < 2:
            continue
        m, n = m_n
        if m.distance < good_match_ratio * n.distance:
            good.append(m)

    if len(good) < min_inliers:
        return False

    src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

    M, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

    if M is None:
        return False

    inliers = mask.ravel().sum()
    print(f"Inliers: {inliers} / {len(good)}")

    return inliers >= min_inliers

def detect_text_in_image(image_path, target_text="fast school of computing"):
    """
    Detect if a specific text is present in an image using OCR.
    
    Args:
        image_path (str): Path to the image file
        target_text (str): Text to search for (case insensitive)
        
    Returns:
        bool: True if target text is found, False otherwise
    """
    try:
        # Read the image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Could not load the image.")
            
        # Convert to RGB (Tesseract expects RGB)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Perform OCR
        text = pytesseract.image_to_string(image_rgb)
        
        # Check if target text is present (case insensitive)
        return target_text.lower() in text.lower()
        
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python image.py <template_image_path> <target_image_path>")
        sys.exit(1)
        
    template_path = sys.argv[1]
    target_path = sys.argv[2]
    
    # Check image matching
    if is_image_inside_sift(template_path, target_path):
        print("✅ Image detected inside")
    else:
        print("❌ Image NOT detected")
        
    # Check text
    if detect_text_in_image(target_path):
        print("✅ Text 'fast school of computing' found in image")
    else:
        print("❌ Text 'fast school of computing' not found in image")