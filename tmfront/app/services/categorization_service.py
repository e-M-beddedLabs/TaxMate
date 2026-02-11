KEYWORDS = {
    "food": ["zomato", "swiggy", "restaurant"],
    "shopping": ["amazon", "flipkart"],
    "travel": ["uber", "ola", "flight"]
}

def suggest_category(text: str):
    text = text.lower()
    for category, words in KEYWORDS.items():
        if any(word in text for word in words):
            return category, 0.8
    return "uncategorized", 0.4