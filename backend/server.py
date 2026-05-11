from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Roofing Monkeys API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Models
class LeadSubmission(BaseModel):
    name: str
    phone: str
    email: str
    address: str
    projectType: str
    webhookUrl: Optional[str] = None


class BookingSubmission(BaseModel):
    name: str
    phone: str
    email: str
    address: str
    projectType: str
    appointmentDate: str
    appointmentTime: str
    webhookUrl: Optional[str] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "Roofing Monkeys API"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "roofing-monkeys"}


@api_router.post("/lead")
async def submit_lead(lead: LeadSubmission):
    """Submit a lead form. Optionally forwards to a webhook URL if provided."""
    lead_data = lead.model_dump()

    if lead.webhookUrl:
        try:
            async with httpx.AsyncClient() as http_client:
                webhook_payload = {
                    "name": lead.name,
                    "phone": lead.phone,
                    "email": lead.email,
                    "address": lead.address,
                    "projectType": lead.projectType,
                    "source": "roofing-monkeys-landing-page",
                    "formType": "lead_capture",
                }
                response = await http_client.post(
                    lead.webhookUrl,
                    json=webhook_payload,
                    timeout=10.0,
                )
                lead_data["webhook_status"] = response.status_code
        except Exception as e:
            logging.error(f"Webhook error: {str(e)}")
            lead_data["webhook_status"] = "error"
            lead_data["webhook_error"] = str(e)

    return {
        "success": True,
        "message": "Lead submitted successfully",
        "data": {
            "name": lead.name,
            "projectType": lead.projectType,
        },
    }


@api_router.post("/booking")
async def submit_booking(booking: BookingSubmission):
    """Submit a booking request. Optionally forwards to a webhook URL if provided."""
    booking_data = booking.model_dump()

    if booking.webhookUrl:
        try:
            async with httpx.AsyncClient() as http_client:
                webhook_payload = {
                    "name": booking.name,
                    "phone": booking.phone,
                    "email": booking.email,
                    "address": booking.address,
                    "projectType": booking.projectType,
                    "appointmentDate": booking.appointmentDate,
                    "appointmentTime": booking.appointmentTime,
                    "source": "roofing-monkeys-landing-page",
                    "formType": "booking",
                }
                response = await http_client.post(
                    booking.webhookUrl,
                    json=webhook_payload,
                    timeout=10.0,
                )
                booking_data["webhook_status"] = response.status_code
        except Exception as e:
            logging.error(f"Webhook error: {str(e)}")
            booking_data["webhook_status"] = "error"
            booking_data["webhook_error"] = str(e)

    return {
        "success": True,
        "message": "Booking submitted successfully",
        "data": {
            "name": booking.name,
            "appointmentDate": booking.appointmentDate,
            "appointmentTime": booking.appointmentTime,
        },
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
