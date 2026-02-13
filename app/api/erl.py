from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.models.user import User
from app.services.erl_service import calculate_economic_metrics
from app.schemas.erl import ERLInsights

router = APIRouter(prefix="/erl", tags=["Economic Reality Layer"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/insights", response_model=ERLInsights)
def get_erl_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get Economic Reality Layer insights for the current user.
    """
    return calculate_economic_metrics(db, current_user.id)
