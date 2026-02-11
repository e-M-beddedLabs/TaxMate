def merge_confidence(*scores):
    valid = [s for s in scores if s is not None]
    return round(sum(valid) / len(valid), 2) if valid else 0.0