from sqlalchemy.orm import Session
from app.schemas.tax_record import TaxRecordCreate
from app.models.tax_record import TaxRecord



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

        # Calculate tax locally since row is Pydantic model, not SQLAlchemy
        tax_rate = row.tax_rate
        if tax_rate is None:
             if row.tax_type == "GST":
                 tax_rate = 18.0
             else:
                 tax_rate = 0.0
        
        taxable = row.taxable_amount or 0.0
        tax_amount = round((taxable * tax_rate) / 100, 2)
        total_amount = round(taxable + tax_amount, 2)

        db_record = TaxRecord(
            user_id=user_id,
            source="csv",
            date=row.date,
            description=row.description,
            category=row.category,
            transaction_type=row.transaction_type,
            taxable_amount=row.taxable_amount,
            tax_type=row.tax_type,
            tax_rate=tax_rate,
            tax_amount=tax_amount,
            total_amount=total_amount,
            confidence_score=1.0,
        )

        objects.append(db_record)

    if objects:
        db.bulk_save_objects(objects)
        db.commit()

    return len(objects)