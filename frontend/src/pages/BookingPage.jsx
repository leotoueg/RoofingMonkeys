import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Calendar, Clock, CheckCircle, ArrowLeft, MapPin, CalendarCheck, Search, FileCheck, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { initTracking, getTrackingContext, pushDataLayerEvent, newEventId, fbqTrack } from "../lib/tracking";

const PHONE_NUMBER = "+1 (647) 954-1671";
const PHONE_HREF = "tel:+16479541671";
// Appointment booking webhook (LeadConnector)
const BOOKING_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/wNdMd0x1lxovpPbrakSW/webhook-trigger/8ceeffea-ae53-4aea-aa15-324089d9b91c";

// GTM helper (delegates to shared tracking module)
const pushToDataLayer = (event, data = {}) => pushDataLayerEvent(event, data);

// Available time slots — 9 AM to 6 PM, hourly
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

// Generate next available booking days (Mon–Sat, up to 7 days out, skip Sundays)
const getAvailableDays = () => {
  const days = [];
  const today = new Date();

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dayOfWeek = date.getDay();

    // Skip Sunday (0)
    if (dayOfWeek === 0) continue;

    days.push({
      date: date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("en-US", { month: "short" }),
      fullDate: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    });
  }

  return days;
};

export default function BookingPage() {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [availableDays] = useState(getAvailableDays());

  useEffect(() => {
    const data = sessionStorage.getItem("leadData");
    if (data) {
      setLeadData(JSON.parse(data));
    }
  }, []);

  const handleCallClick = (sourceLocation = "header") => {
    pushToDataLayer("click_call_button", {
      event_category: "Engagement",
      event_label: "Click to Call",
      phone_number: PHONE_NUMBER,
      page: "booking",
      location: sourceLocation,
    });
    pushToDataLayer("phone_call_click", {
      phone_number: PHONE_NUMBER,
      page: "booking",
      location: sourceLocation,
    });
    window.location.href = PHONE_HREF;
  };

  const handleBookAppointment = async () => {
    if (!selectedDay || !selectedTime) {
      toast.error("Please select a day and time slot");
      return;
    }

    setIsBooking(true);

    const eventId = newEventId();
    const tracking = getTrackingContext();

    try {
      if (BOOKING_WEBHOOK_URL) {
        await fetch(BOOKING_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: leadData?.name || "",
            phone: leadData?.phone || "",
            email: leadData?.email || "",
            address: leadData?.address || "",
            projectType: leadData?.projectType || "",
            appointmentDate: selectedDay.fullDate,
            appointmentTime: selectedTime,
            source: "roofing-monkeys-landing-page",
            formType: "booking",
            event_id: eventId,
            timestamp: new Date().toISOString(),
            page_url: typeof window !== "undefined" ? window.location.href : "",
            ...tracking,
          }),
        });
      }

      pushToDataLayer("book_appointment", {
        event_category: "Conversion",
        event_label: "Appointment Booked",
        appointment_date: selectedDay.fullDate,
        appointment_time: selectedTime,
        project_type: leadData?.projectType || "unknown",
        page: "booking",
        event_id: eventId,
      });
      pushToDataLayer("schedule", {
        currency: "CAD",
        value: 0,
        appointment_date: selectedDay.fullDate,
        appointment_time: selectedTime,
        project_type: leadData?.projectType || "unknown",
        event_id: eventId,
      });

      // Meta Pixel — standard "Schedule" event (fires on appointment request)
      fbqTrack(
        "Schedule",
        {
          content_name: "appointment_request",
          content_category: leadData?.projectType || "unknown",
          currency: "CAD",
          value: 0,
        },
        eventId
      );

      setIsBooked(true);
      toast.success("Appointment requested!");

      sessionStorage.removeItem("leadData");
    } catch (error) {
      console.error("Webhook error:", error);
      pushToDataLayer("book_appointment", {
        event_category: "Conversion",
        event_label: "Appointment Booked",
        appointment_date: selectedDay.fullDate,
        appointment_time: selectedTime,
        project_type: leadData?.projectType || "unknown",
        page: "booking",
        event_id: eventId,
      });
      pushToDataLayer("schedule", {
        currency: "CAD",
        value: 0,
        appointment_date: selectedDay.fullDate,
        appointment_time: selectedTime,
        project_type: leadData?.projectType || "unknown",
        event_id: eventId,
      });
      setIsBooked(true);
      toast.success("Appointment requested!");
      sessionStorage.removeItem("leadData");
    } finally {
      setIsBooking(false);
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-[#F9F8FD] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F4A9C] mb-4">Appointment requested!</h1>
          <p className="text-[#475569] mb-6">
            Your inspection is requested for <strong>{selectedDay?.fullDate}</strong> at <strong>{selectedTime}</strong>.
          </p>
          <p className="text-[#475569] mb-8">
            A member of our team will reach out shortly to confirm your appointment request. It is important you confirm your appointment due to high volume of requests.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => handleCallClick("booked_success")}
              data-testid="booked-call-button"
              className="w-full h-12 bg-[#1D67CD] hover:bg-[#1854A8] text-white font-semibold rounded-full flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Questions? Call {PHONE_NUMBER}
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              data-testid="back-home-button"
              className="w-full h-12 border-[#0F4A9C] text-[#0F4A9C] hover:bg-[#0F4A9C] hover:text-white font-semibold rounded-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8FD]" data-testid="booking-page">
      {/* Header */}
      <header className="bg-[#043061] py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h2 className="text-white text-lg font-bold">Roofing Monkeys</h2>
          <button
            onClick={() => handleCallClick("booking_header")}
            className="flex items-center gap-2 text-[#59C8EE] hover:text-white transition-colors font-semibold"
            data-testid="header-call-booking"
          >
            <Phone className="w-5 h-5" />
            <span className="hidden sm:inline">{PHONE_NUMBER}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Page Title */}
        <div className="text-center mb-5 md:mb-7">
          <div className="inline-flex items-center gap-2 bg-[#1D67CD]/10 text-[#1D67CD] px-3 py-1 rounded-full text-xs md:text-sm font-semibold mb-3">
            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Information Received!</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-[#043061] mb-1 md:mb-2">
            Book Your Free Inspection
          </h1>
          <p className="text-sm md:text-base text-[#475569]">
            Pick a time that works for you.
          </p>
        </div>

        {/* Lead Summary */}
        {leadData && (
          <div className="bg-white rounded-xl px-3 py-2 md:p-4 mb-4 border border-slate-200 text-center md:text-left">
            <p className="text-xs text-[#94A3B8] mb-0.5">Booking inspection for:</p>
            <p className="text-sm md:text-base font-semibold text-[#0F172A]">{leadData.name} • {leadData.phone}</p>
          </div>
        )}

        {/* 3-step horizontal process flow */}
        <div className="mb-6 md:mb-8" data-testid="process-infographic">
          <div className="text-center mb-3 md:mb-5">
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#1D67CD] font-semibold">How It Works</span>
          </div>
          <div className="process-flow">
            {[
              { n: 1, Icon: CalendarCheck, title: "Schedule",   body: "Pick a day and time below." },
              { n: 2, Icon: Search,        title: "We Inspect", body: "Our crew inspects your roof on-site." },
              { n: 3, Icon: FileCheck,     title: "Same-Day Quote", body: "Written no-obligation quote the same day." },
            ].map((s, i, arr) => (
              <React.Fragment key={s.n}>
                <div className="process-step-item" data-testid={`process-step-${i}`}>
                  <div className="process-badge">
                    <span className="step-num">{s.n}</span>
                    <s.Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={2} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight
                    className="process-arrow w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-[#0F4A9C]" />
            <h2 className="text-xl font-bold text-[#0F4A9C]">Select a Day</h2>
          </div>

          {/* Day Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {availableDays.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay({ ...day, _idx: i })}
                data-testid={`day-slot-${i}`}
                className={`calendar-day text-center ${
                  selectedDay?._idx === i ? "selected" : ""
                }`}
              >
                <p className={`text-xs font-medium ${selectedDay?._idx === i ? "text-white/80" : "text-[#94A3B8]"}`}>
                  {day.dayName}
                </p>
                <p className={`text-xl font-bold ${selectedDay?._idx === i ? "text-white" : "text-[#0F172A]"}`}>
                  {day.dayNumber}
                </p>
                <p className={`text-xs ${selectedDay?._idx === i ? "text-white/80" : "text-[#94A3B8]"}`}>
                  {day.monthName}
                </p>
              </button>
            ))}
          </div>

          {/* Time Selection */}
          {selectedDay && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[#0F4A9C]" />
                <h3 className="text-lg font-bold text-[#0F4A9C]">
                  Available Times for {selectedDay.fullDate}
                </h3>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
                {TIME_SLOTS.map((time, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(time)}
                    data-testid={`time-slot-${i}`}
                    className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedDay && selectedTime && (
            <div className="bg-[#EAF3FC] rounded-xl p-4 mb-6 animate-fade-in">
              <p className="font-semibold text-[#0F4A9C]">Your Selected Appointment:</p>
              <p className="text-[#475569]">{selectedDay.fullDate} at {selectedTime}</p>
            </div>
          )}

          {/* Book Button */}
          <Button
            onClick={handleBookAppointment}
            disabled={!selectedDay || !selectedTime || isBooking}
            data-testid="book-appointment-button"
            className="w-full h-14 text-lg font-semibold bg-[#1D67CD] hover:bg-[#1854A8] disabled:bg-slate-300 text-white rounded-full shadow-lg transition-all duration-200"
          >
            {isBooking ? "Booking..." : "Confirm My Appointment"}
          </Button>

          <p className="text-center text-sm text-[#94A3B8] mt-4">
            A team member will confirm your appointment via phone or text.
          </p>
        </div>

        {/* Location Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#475569]">
            <MapPin className="w-5 h-5 text-[#1D67CD]" />
            <span>Proudly serving Toronto &amp; the Greater Toronto Area</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#043061] py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/70 text-sm">© {new Date().getFullYear()} Roofing Monkeys. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
