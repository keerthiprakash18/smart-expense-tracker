import re
import easyocr


reader = easyocr.Reader(["en"], gpu=False)


def extract_receipt_text(image_path):
    results = reader.readtext(image_path)

    text_lines = []

    for result in results:
        text_lines.append(result[1])

    return "\n".join(text_lines)


def extract_amount(text):
    patterns = [
        r"(?:total|amount|grand total|net total)\s*[:\-]?\s*[₹$]?\s*(\d+(?:\.\d{1,2})?)",
        r"[₹$]\s*(\d+(?:\.\d{1,2})?)",
    ]

    for pattern in patterns:
        matches = re.findall(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        if matches:
            try:
                values = [
                    float(value)
                    for value in matches
                ]

                return max(values)

            except ValueError:
                pass

    return None


def extract_date(text):
    patterns = [
        r"\b\d{2}[/-]\d{2}[/-]\d{4}\b",
        r"\b\d{4}[/-]\d{2}[/-]\d{2}\b",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            return match.group(0)

    return None


def extract_merchant(text):
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return None

    return lines[0]
    # Function alias: unga existing function edhuvaga irundhalum idhukku map aagidum
if "extract_receipt_data" not in globals():
    if "extract_receipt_info" in globals():
        extract_receipt_data = extract_receipt_info
    elif "scan_receipt" in globals():
        extract_receipt_data = scan_receipt
    elif "extract_text" in globals():
        extract_receipt_data = extract_text