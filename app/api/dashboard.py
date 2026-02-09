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

@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cached = get_cached_dashboard(current_user.id)
    if cached:
        return cached

    background_tasks.add_task(
        warm_dashboard_cache,
        db,
        current_user.id,
    )

    return build_dashboard(db, current_user.id)