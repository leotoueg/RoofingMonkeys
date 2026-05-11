"""Backend API tests for Roofing Monkeys landing page."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://roofing-gta.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health ----
class TestHealth:
    def test_health_endpoint(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "healthy"
        assert data["service"] == "roofing-monkeys"

    def test_root_api(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        assert "message" in r.json()


# ---- Lead endpoint ----
class TestLead:
    def test_lead_valid_payload(self, api_client):
        payload = {
            "name": "TEST_John Doe",
            "phone": "+1 (416) 555-1234",
            "email": "test@example.com",
            "address": "123 Main St, Toronto, ON",
            "projectType": "shingles",
        }
        r = api_client.post(f"{BASE_URL}/api/lead", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True
        assert "message" in data
        assert data["data"]["name"] == payload["name"]
        assert data["data"]["projectType"] == payload["projectType"]

    def test_lead_no_webhook_url(self, api_client):
        # Empty webhookUrl is fine
        payload = {
            "name": "TEST_NoWebhook",
            "phone": "+14165550000",
            "email": "nw@example.com",
            "address": "1 Bay St",
            "projectType": "metal-roof",
            "webhookUrl": "",
        }
        r = api_client.post(f"{BASE_URL}/api/lead", json=payload, timeout=15)
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_lead_missing_required_field(self, api_client):
        payload = {"name": "TEST_Bad", "phone": "x"}  # missing fields
        r = api_client.post(f"{BASE_URL}/api/lead", json=payload, timeout=15)
        assert r.status_code == 422

    @pytest.mark.parametrize("project_type", ["shingles", "roof-repair", "flat-roof", "metal-roof", "emergency"])
    def test_lead_all_project_types(self, api_client, project_type):
        payload = {
            "name": f"TEST_{project_type}",
            "phone": "+14165550000",
            "email": "p@example.com",
            "address": "1 Bay St",
            "projectType": project_type,
        }
        r = api_client.post(f"{BASE_URL}/api/lead", json=payload, timeout=15)
        assert r.status_code == 200
        assert r.json()["success"] is True


# ---- Booking endpoint ----
class TestBooking:
    def test_booking_valid_payload(self, api_client):
        payload = {
            "name": "TEST_Jane",
            "phone": "+14165550000",
            "email": "jane@example.com",
            "address": "1 Bay St, Toronto",
            "projectType": "shingles",
            "appointmentDate": "Friday, January 17, 2026",
            "appointmentTime": "10:00 AM",
        }
        r = api_client.post(f"{BASE_URL}/api/booking", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True
        assert data["data"]["name"] == payload["name"]
        assert data["data"]["appointmentDate"] == payload["appointmentDate"]
        assert data["data"]["appointmentTime"] == payload["appointmentTime"]

    def test_booking_missing_fields(self, api_client):
        payload = {"name": "TEST_X"}
        r = api_client.post(f"{BASE_URL}/api/booking", json=payload, timeout=15)
        assert r.status_code == 422
