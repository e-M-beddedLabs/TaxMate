from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api import tax_records, reports, auth, uploads, dashboard, tax_summary


app = FastAPI(title="Taxmate v0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "https://taxmate-jhq.pages.dev",  # Cloudflare Pages production
        # Add your custom domain here when you set it up
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(uploads.router)
app.include_router(tax_records.router)
app.include_router(reports.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(tax_summary.router)

@app.get("/")
def root():
    return {"status": "Taxmate API running"}