from pydantic import BaseModel
from typing import List


class CSVBulkInsertRequest(BaseModel):
    records: List[dict]