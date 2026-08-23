from flask import Blueprint, request, jsonify
import re

parser_bp = Blueprint('parser_bp', __name__)

CATEGORY_RULES = [
    {
        "pattern": re.compile(
            r"\b(grocer(?:y|ies)?|milk|bread|biscuits?|fruits?|vegetables?|eggs?|rice|flour|sugar|tea|coffee|snacks?|food|butter|cheese|cereal|juice|water|apples?|bananas?)\b",
            re.IGNORECASE
        ),
        "category": "groceries",
        "title": "Groceries",
        "cost": 300.0,
    },
    {
        "pattern": re.compile(
            r"\b(medicines?|medications?|tablets?|pills?|capsules?|syrups?|prescriptions?|pharmac(?:y|ies)?|ointments?|drops?|inhalers?|insulin|bp|pressure|painkiller|bandage)\b",
            re.IGNORECASE
        ),
        "category": "medicine",
        "title": "Medicine",
        "cost": 250.0,
    },
    {
        "pattern": re.compile(
            r"\b(rides?|drives?|cabs?|taxis?|cars?|hospitals?|doctors?|clinics?|appointments?|pickups?|drop\s*offs?|transports?|bus)\b",
            re.IGNORECASE
        ),
        "category": "ride",
        "title": "A Ride",
        "cost": 200.0,
    },
    {
        "pattern": re.compile(
            r"\b(homes?|cleans?|cleaning|repairs?|fixing|fix|plumb(?:ing|er)?|electr(?:ic|ician)?|paint(?:ing)?|help at home|house|leaks?|bulbs?|fans?|gardens?|locks?|drains?|taps?)\b",
            re.IGNORECASE
        ),
        "category": "home",
        "title": "Help at Home",
        "cost": 500.0,
    },
]

MEDICINE_PATTERN = re.compile(
    r"\b(medicines?|medications?|tablets?|pills?|capsules?|prescriptions?|syrups?|ointments?|pharmac(?:y|ies)?|inhalers?|insulin|painkiller)\b",
    re.IGNORECASE
)


def tidy_transcript(text: str) -> str:
    """Clean natural language transcript into clean description."""
    cleaned = text.strip()
    cleaned = re.sub(r"\bi\s+(need|want|would like|require)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b(please|can you get|could someone)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    if not cleaned:
        return text.strip()
    return cleaned[0].upper() + cleaned[1:]


def parse_text_request(text: str):
    """Parse text/transcript to determine category, title, cost, and safety flags."""
    raw = text.strip()
    is_med = bool(MEDICINE_PATTERN.search(raw))

    matched_category = "other"
    matched_title = "A Helping Hand"
    estimated_cost = 150.0

    for rule in CATEGORY_RULES:
        if rule["pattern"].search(raw):
            matched_category = rule["category"]
            matched_title = rule["title"]
            estimated_cost = rule["cost"]
            break

    # Look for explicit currency/number in text (e.g. "$50" or "500 rs" or "20 dollars")
    cost_match = re.search(r"(\$|₹|£|€)?\s*(\d+(?:\.\d{1,2})?)\s*(dollars|rs|rupees|bucks)?", raw, re.IGNORECASE)
    if cost_match and cost_match.group(2):
        try:
            extracted_cost = float(cost_match.group(2))
            if 0 < extracted_cost < 10000:
                estimated_cost = extracted_cost
        except ValueError:
            pass

    return {
        "category": matched_category,
        "title": matched_title,
        "description": tidy_transcript(raw),
        "raw": raw,
        "estimatedCost": estimated_cost,
        "isMedicine": is_med,
        "needsSafetyReview": is_med,
    }


@parser_bp.route('/api/parse', methods=['POST'])
def parse_request_endpoint():
    """Endpoint to parse voice or text request transcript."""
    data = request.get_json() or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = parse_text_request(text)
    return jsonify(result), 200
