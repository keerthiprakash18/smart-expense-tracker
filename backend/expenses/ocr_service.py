import re
from datetime import datetime
from decimal import Decimal

class IndiaReceiptExtractor:
    """
    Modular Indian Receipt Parser supporting INR (₹), GST/CGST/SGST/IGST,
    UPI references, merchant normalization, and confidence estimation.
    """
    MERCHANT_PATTERNS = {
        'Food & Dining': [
            'swiggy', 'zomato', 'starbucks', 'mcdonald', 'kfc', 'domino', 'pizza', 
            'burger king', 'cafe', 'restaurant', 'bhavan', 'anandha', 'biryani', 'chai'
        ],
        'Groceries': [
            'blinkit', 'zepto', 'instamart', 'bigbasket', 'dmart', 'reliance fresh', 
            'supermarket', 'spencer', 'more retail', 'kirana', 'provision'
        ],
        'Travel & Fuel': [
            'uber', 'ola', 'rapido', 'irctc', 'indigo', 'air india', 'fuel', 
            'petrol', 'hpcl', 'iocl', 'bpcl', 'shell', 'toll', 'metro'
        ],
        'Shopping': [
            'amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'trends', 'croma', 
            'reliance digital', 'apple', 'uniqlo', 'westside', 'decathlon'
        ],
        'Bills & Utilities': [
            'bescom', 'tneb', 'airtel', 'jio', 'vi', 'act fibernet', 'electricity', 
            'water supply', 'gas', 'indane', 'bharat gas', 'tatasky'
        ],
        'Health': [
            'apollo', 'medplus', 'pharmeasy', '1mg', 'pharmacy', 'hospital', 
            'clinic', 'diagnostic', 'dr.'
        ],
        'Entertainment': [
            'bookmyshow', 'pvr', 'inox', 'netflix', 'spotify', 'hotstar', 'prime video'
        ]
    }

    @classmethod
    def parse_document(cls, raw_text: str, filename: str = ""):
        text = raw_text.replace('\r', ' ')
        text_lower = (text + " " + filename).lower()

        # 1. Indian Currency & Amount Parsing
        # Matches: Total: 450.00 | Net Amount: 1,200.50 | ₹ 850 | INR 250
        amount_patterns = [
            r'(?:grand\s*total|net\s*amount|total\s*payable|bill\s*amount|total|amount|amt|due)\s*[:=]?\s*(?:rs\.?|inr|₹)?\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2}))',
            r'(?:rs\.?|inr|₹)\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2}))',
            r'([0-9]+(?:\.[0-9]{2}))\s*(?:total|paid)'
        ]
        
        detected_amount = None
        for pattern in amount_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                try:
                    candidates = [float(m.replace(',', '')) for m in matches if float(m.replace(',', '')) > 0]
                    if candidates:
                        detected_amount = max(candidates)
                        break
                except ValueError:
                    continue

        # 2. Indian Tax Parsing (GST / CGST / SGST / IGST)
        tax_amount = 0.0
        gst_match = re.search(r'(?:gst|cgst\s*\+\s*sgst|tax)\s*[:=]?\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]{2}))', text, re.IGNORECASE)
        if gst_match:
            try:
                tax_amount = float(gst_match.group(1))
            except ValueError:
                tax_amount = 0.0

        gstin_match = re.search(r'\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b', text)
        gstin = gstin_match.group(0) if gstin_match else None

        # 3. Date & Time Parsing (DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
        detected_date = datetime.now().strftime('%Y-%m-%d')
        date_patterns = [
            r'\b(0?[1-9]|[12][0-9]|3[01])[-/.](0?[1-9]|1[012])[-/.](20\d\d)\b',
            r'\b(20\d\d)[-/.](0?[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])\b'
        ]
        for dp in date_patterns:
            dm = re.search(dp, text)
            if dm:
                try:
                    parts = dm.groups()
                    if len(parts[0]) == 4:
                        detected_date = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
                    else:
                        detected_date = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                    break
                except Exception:
                    pass

        # 4. Payment Method & UPI Reference
        payment_method = "Cash"
        upi_ref = None
        if "upi" in text_lower or "gpay" in text_lower or "phonepe" in text_lower or "paytm" in text_lower:
            payment_method = "UPI"
            upi_match = re.search(r'(?:upi\s*ref|rrn|txn\s*id)\s*[:=]?\s*([0-9]{9,12})', text, re.IGNORECASE)
            if upi_match:
                upi_ref = upi_match.group(1)
        elif any(k in text_lower for k in ['card', 'visa', 'mastercard', 'pos', 'debit', 'credit']):
            payment_method = "Card"
        elif "net banking" in text_lower or "neft" in text_lower:
            payment_method = "NetBanking"

        # 5. Merchant Identification & Categorization
        merchant_name = "Retail Merchant"
        suggested_category = "General"
        category_confidence = 0.70

        for cat, keywords in cls.MERCHANT_PATTERNS.items():
            for kw in keywords:
                if kw in text_lower:
                    suggested_category = cat
                    # Merchant name formatting
                    merchant_name = kw.title()
                    category_confidence = 0.95
                    break
            if category_confidence > 0.8:
                break

        # Fallback if merchant not found from keywords: use first non-empty line
        if merchant_name == "Retail Merchant":
            lines = [l.strip() for l in text.split('\n') if len(l.strip()) > 3]
            if lines:
                candidate = re.sub(r'[^a-zA-Z0-9\s&.-]', '', lines[0])[:35].strip()
                if candidate:
                    merchant_name = candidate

        # 6. Confidence Scoring
        confidence = {
            'amount': 0.95 if detected_amount else 0.40,
            'date': 0.90 if detected_date else 0.50,
            'merchant': category_confidence,
            'category': category_confidence,
            'overall': round((category_confidence + (0.95 if detected_amount else 0.40)) / 2, 2)
        }

        return {
            'merchant': merchant_name,
            'amount': detected_amount or 0.0,
            'tax_amount': tax_amount,
            'gstin': gstin,
            'category': suggested_category,
            'payment_method': payment_method,
            'upi_ref': upi_ref,
            'date': detected_date,
            'confidence': confidence,
            'raw_text_preview': text[:300]
        }