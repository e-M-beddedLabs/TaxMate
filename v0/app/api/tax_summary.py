from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user
from app.services.tax_summary_service import build_tax_summary
from app.schemas.tax_summary import TaxSummaryResponse
from app.models.user import User

router = APIRouter(prefix="/tax/summary", tags=["Tax Summary"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=TaxSummaryResponse)
def get_tax_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return build_tax_summary(db, current_user.id)