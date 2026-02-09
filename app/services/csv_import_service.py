from sqlalchemy.orm import Session
from app.schemas.tax_record import TaxRecordCreate
from app.models.tax_record import TaxRecord
from app.services.tax_calculator import compute_tax_for_record


def parse_csv_rows(
    db: Session,
    user_id: int,
    rows: list[TaxRecordCreate],
) -> int:
    """
    Takes validated CSV rows from preview,
    deduplicates them, computes tax,
    and inserts safely into DB.
    """

    seen = set()
    objects = []

    for row in rows:
        fingerprint = (
            row.date,
            row.description.strip().lower(),
            row.taxable_amount,
            user_id,
        )

        if fingerprint in seen:
            continue

        seen.add(fingerprint)

        tax_amount, total_amount = compute_tax_for_record(row)

        db_record = TaxRecord(
            user_id=user_id,
            source="csv",
            date=row.date,
            description=row.description,
            category=row.category,
            transaction_type=row.transaction_type,
            taxable_amount=row.taxable_amount,
            tax_type=row.tax_type,
            tax_amount=tax_amount,
            total_amount=total_amount,
            confidence_score=1.0,
        )

        objects.append(db_record)

    if objects:
        db.bulk_save_objects(objects)
        db.commit()

    return len(objects)