import cv2
import pytesseract
import re

# Define all selected signature regions
signature_regions = [
    (1873, 1405, 367, 197),
    (1886, 1764, 394, 196),
    (1878, 2077, 368, 253)
]

def detect_signature(image, region):
    """
    Detects whether a real signature is present in the given region of the image.

    Args:
        image (numpy.ndarray): Loaded OpenCV image.
        region (tuple): (x, y, width, height) to check.

    Returns:
        bool: True if signature is detected, False otherwise.
    """
    x, y, w, h = region
    cropped = image[y:y+h, x:x+w]

    # Preprocess
    gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # OCR
    text = pytesseract.image_to_string(thresh, config='--psm 6')
    cleaned = text.strip()
    print(cleaned)

    # Filter out placeholder lines like "...................."
    if re.fullmatch(r'[.\-_\s]+', cleaned):
        return False

    return len(cleaned) == 0

def check_all_signature_regions(image_path):
    """
    Check all signature regions in the given image and return results.
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        dict: Dictionary containing results for each region
    """
    image = cv2.imread(image_path)
    results = {}

    for idx, region in enumerate(signature_regions, start=1):
        result = detect_signature(image, region)
        status = "Signature DETECTED" if result else "No signature"
        results[f"region_{idx}"] = {
            "region": region,
            "status": status,
            "has_signature": result
        }

        # Optional: visualize region
        x, y, w, h = region
        color = (0, 255, 0) if result else (0, 0, 255)
        cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
        cv2.putText(image, f"R{idx}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    # Save annotated image
    output_path = image_path.replace('.jpg', '_annotated.jpg')
    cv2.imwrite(output_path, image)
    
    return results

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python setup.py <path_to_image>")
        sys.exit(1)
        
    image_path = sys.argv[1]
    results = check_all_signature_regions(image_path)
    print(results)
