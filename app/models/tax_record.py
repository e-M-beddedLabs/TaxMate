from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class TaxRecord(Base):
    __tablename__ = "tax_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    source = Column(String, nullable=False)
    date = Column(Date, nullable=False, index=True)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)

    transaction_type = Column(String, nullable=False)  # income | expense

    taxable_amount = Column(Float, nullable=False)

    # 🔑 NEW — REQUIRED
    tax_type = Column(String, nullable=False, default="NONE")
    tax_rate = Column(Float, nullable=False, default=0.0)

    tax_amount = Column(Float, nullable=False, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)

    confidence_score = Column(Float, nullable=False, default=1.0)

    user = relationship("User", back_populates="records")