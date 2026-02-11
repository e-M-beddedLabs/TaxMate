from app.core.database import Base, engine
from app.models.user import User
from app.models.tax_record import TaxRecord

print("ENGINE:", engine.url)
Base.metadata.create_all(bind=engine)
print("DONE")