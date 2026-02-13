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

    print(f"DEBUG: Starting parse_csv_rows for user_id={user_id} with {len(rows)} rows.")
    seen = set()
    inserted_count = 0

    for row in rows:
        fingerprint = (
            row.date,
            row.description.strip().lower(),
            row.taxable_amount,
            user_id,
        )

        if fingerprint in seen:
            print(f"DEBUG: Skipping duplicate: {fingerprint}")
            continue

        seen.add(fingerprint)

        # Calculate tax locally since row is Pydantic model
        tax_rate = row.tax_rate
        if tax_rate is None:
             if row.tax_type == "GST":
                 tax_rate = 18.0
             else:
                 tax_rate = 0.0
        
        taxable = row.taxable_amount or 0.0
        tax_amount = round((taxable * tax_rate) / 100, 2)
        total_amount = round(taxable + tax_amount, 2)

        try:
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
            # Use add() instead of bulk_save for safer commit and error visibility
            db.add(db_record)
            inserted_count += 1
        except Exception as e:
            print(f"DEBUG: Error creating record object: {e}")

    if inserted_count > 0:
        try:
            print(f"DEBUG: Committing {inserted_count} records to DB...")
            db.commit()
            print("DEBUG: Commit successful.")
        except Exception as e:
            print(f"DEBUG: Commit failed: {e}")
            db.rollback()
            raise e
    else:
        print("DEBUG: No records to insert (all duplicates or empty input).")

    return inserted_count