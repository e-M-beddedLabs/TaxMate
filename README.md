# Taxmate v0

Minimal tax tracking backend.

## Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Auth
- OCR via Tesseract

## Run

uvicorn app.main:app --reload

## Rules

- All inputs normalize into TaxRecord
- Confidence score is mandatory
- No bypass paths
