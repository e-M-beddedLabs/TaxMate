from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class TaxRecord(Base):
    __tablename__ = "tax_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    source = Column(String)  # manual | upload | csv
    date = Column(Date)
    description = Column(String)

    category = Column(String)
    transaction_type = Column(String)  # income | expense

    taxable_amount = Column(Float)
    tax_type = Column(String)  # GST | NONE
    tax_amount = Column(Float)
    total_amount = Column(Float)

    confidence_score = Column(Float, nullable=False, default=1.0)
    created_at = Column(DateTime, server_default=func.now())