from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.services.dashboard_service import build_dashboard
from app.schemas.dashboard import DashboardResponse
from app.models.user import User
from app.services.dashboard_cache import get_cached_dashboard, warm_dashboard_cache
from fastapi import BackgroundTasks

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

'''
@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return build_dashboard(db, current_user.id)
    '''

from typing import Optional
from datetime import date

@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    background_tasks: BackgroundTasks,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only use cache if NO date filtering is applied
    if not start_date and not end_date:
        cached = get_cached_dashboard(current_user.id)
        if cached:
            return cached

    # If no dates, we can warm cache for next time
    if not start_date and not end_date:
        background_tasks.add_task(
            warm_dashboard_cache,
            db,
            current_user.id,
        )

    return build_dashboard(db, current_user.id, start_date, end_date)