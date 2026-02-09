from typing import Dict
from app.services.dashboard_service import build_dashboard

_dashboard_cache: Dict[int, dict] = {}


def warm_dashboard_cache(db, user_id: int):
    _dashboard_cache[user_id] = build_dashboard(db, user_id)


def get_cached_dashboard(user_id: int):
    return _dashboard_cache.get(user_id)