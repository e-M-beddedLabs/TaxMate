from sqlalchemy.orm import Session
from app.models.tax_record import TaxRecord
from app.schemas.tax_record import TaxRecordCreate
from app.services.tax_calculator import compute_tax_for_record


def create_tax_record(
    db: Session,
    user_id: int,
    data: TaxRecordCreate,
):
    tax_amount, total_amount = compute_tax_for_record(data)

    record = TaxRecord(
        user_id=user_id,
        source="manual",
        date=data.date,
        description=data.description,
        category=data.category,
        transaction_type=data.transaction_type,
        taxable_amount=data.taxable_amount,
        tax_type=data.tax_type,
        tax_amount=tax_amount,
        total_amount=total_amount,
        confidence_score=0.8,
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_user_tax_records(
    db: Session,
    user_id: int,
):
    return (
        db.query(TaxRecord)
        .filter(TaxRecord.user_id == user_id)
        .order_by(TaxRecord.date.desc())
        .all()
    )