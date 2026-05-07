import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime } from "date-fns-tz";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

interface CalSlot {
  start?: string;
  time?: string;
}

interface CalBookingLocation {
  type: "integration" | "phone" | "attendeeAddress";
  integration?: string;
  value?: string;
}

interface CalBookingData {
  eventTypeId: number;
  start: string;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
    language: string;
    phoneNumber?: string;
  };
  metadata: {
    duration: string;
  };
  lengthInMinutes?: number;
  location?: CalBookingLocation;
  bookingFieldsResponses?: {
    notes?: string;
  };
}

async function getEventTypeDetails(eventTypeId: number): Promise<{
  seatsPerTimeSlot: number | null;
  scheduledTime: string | null;
} | null> {
  try {
    const response = await fetch(
      `https://api.cal.com/v2/event-types/${eventTypeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CAL_COM_API_KEY}`,
          "cal-api-version": "2024-06-14",
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch event type details:", response.status);
      return null;
    }

    const data = await response.json();

    const eventType = data.data;

    console.log("Event type details:", {
      id: eventType?.id,
      seatsPerTimeSlot: eventType?.seatsPerTimeSlot,
      schedule: eventType?.schedule,
      availability: eventType?.availability,
    });

    return {
      seatsPerTimeSlot: eventType?.seatsPerTimeSlot || null,
      scheduledTime: null,
    };
  } catch (error) {
    console.error("Error fetching event type details:", error);
    return null;
  }
}

async function findExistingGroupBooking(
  eventTypeId: number,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.cal.com/v2/bookings?eventTypeId=${eventTypeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CAL_COM_API_KEY}`,
          "cal-api-version": "2024-08-13",
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch bookings for group:", response.status);
      return null;
    }

    const data = await response.json();

    const bookings = data.data || [];

    const activeBookings = bookings.filter(
      (booking: { status: string; eventType?: { id: number } }) =>
        (booking.status === "accepted" || booking.status === "pending") &&
        booking.eventType?.id === eventTypeId,
    );

    console.log("Found existing bookings for group:", {
      eventTypeId,
      total: bookings.length,
      active: activeBookings.length,
    });

    if (activeBookings.length > 0) {
      const firstBooking = activeBookings[0];

      console.log("Using existing booking time:", firstBooking.start);
      return firstBooking.start;
    }

    return null;
  } catch (error) {
    console.error("Error finding existing group booking:", error);
    return null;
  }
}

async function getNextAvailableSlot(
  eventTypeId: number,
  durationInMinutes: number,
): Promise<string | null> {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 60);

    console.log("Fetching group slots:", {
      eventTypeId,
      durationInMinutes,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    const response = await fetch(
      `https://api.cal.com/v2/slots?eventTypeId=${eventTypeId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}&timeZone=Europe/Athens&duration=${durationInMinutes}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CAL_COM_API_KEY}`,
          "cal-api-version": "2024-09-04",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch slots for group session:",
        response.status,
        errorText,
      );
      return null;
    }

    const data = await response.json();

    const slots: Record<string, CalSlot[]> = data.data || data.slots || {};

    console.log("Group slots response:", {
      eventTypeId,
      availableDates: Object.keys(slots),
      totalSlots: Object.values(slots).flat().length,
    });

    for (const dateKey of Object.keys(slots).sort()) {
      if (slots[dateKey] && slots[dateKey].length > 0) {
        const slotTime = slots[dateKey][0].start || slots[dateKey][0].time;
        console.log("Found slot for group:", slotTime);
        return slotTime || null;
      }
    }

    console.log("No slots found for group event:", eventTypeId);
    return null;
  } catch (error) {
    console.error("Error fetching slots:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventTypeId,
      date,
      time,
      duration,
      location,
      firstName,
      lastName,
      email,
      phone,
      notes,
    } = body;

    console.log("Booking request received:", body);

    const isGroupSession = date === "group-session" || time === "scheduled";

    const missingFields = [];
    if (!eventTypeId) missingFields.push("eventTypeId");
    if (!isGroupSession && !date) missingFields.push("date");
    if (!isGroupSession && !time) missingFields.push("time");
    if (!duration) missingFields.push("duration");
    if (!location) missingFields.push("location");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!email) missingFields.push("email");

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
          receivedData: body,
        },
        { status: 400 },
      );
    }

    if (!CAL_COM_API_KEY) {
      console.error("CAL_COM_API_KEY is not set");
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 },
      );
    }

    const durationInMinutes = duration === "1h" ? 60 : 120;

    let startDateTime: string;

    if (isGroupSession) {
      const eventDetails = await getEventTypeDetails(eventTypeId);
      const hasSeats =
        eventDetails?.seatsPerTimeSlot && eventDetails.seatsPerTimeSlot > 1;

      console.log("Group session booking:", {
        eventTypeId,
        hasSeats,
        seatsPerTimeSlot: eventDetails?.seatsPerTimeSlot,
      });

      if (hasSeats) {
        const existingBookingTime = await findExistingGroupBooking(eventTypeId);

        if (existingBookingTime) {
          startDateTime = new Date(existingBookingTime).toISOString();
          console.log(
            "Group session - joining existing booking at:",
            startDateTime,
          );
        } else {
          const nextSlot = await getNextAvailableSlot(
            eventTypeId,
            durationInMinutes,
          );
          if (!nextSlot) {
            return NextResponse.json(
              { error: "No available slots for this group session" },
              { status: 400 },
            );
          }
          startDateTime = new Date(nextSlot).toISOString();
          console.log(
            "Group session - creating new booking at:",
            startDateTime,
          );
        }
      } else {
        const nextSlot = await getNextAvailableSlot(
          eventTypeId,
          durationInMinutes,
        );
        if (!nextSlot) {
          return NextResponse.json(
            { error: "No available slots for this group session" },
            { status: 400 },
          );
        }
        startDateTime = new Date(nextSlot).toISOString();
        console.log("Group session (no seats) - using slot:", startDateTime);
      }
    } else {
      const dateTimeString = `${date}T${time}:00`;

      const athensTime = fromZonedTime(dateTimeString, "Europe/Athens");
      startDateTime = athensTime.toISOString();

      console.log("Individual session datetime:", {
        inputDate: date,
        inputTime: time,
        athensLocalTime: dateTimeString,
        convertedToUTC: startDateTime,
        explanation: "Athens time properly converted to UTC with DST handling",
      });
    }

    let formattedPhone = phone;
    if (phone && phone.trim()) {
      formattedPhone = phone.startsWith("+") ? phone : `+30${phone}`;
    }

    const bookingData: CalBookingData = {
      eventTypeId: eventTypeId,
      start: startDateTime,
      attendee: {
        name: `${firstName} ${lastName}`,
        email: email,
        timeZone: "Europe/Athens",
        language: "en",
        ...(formattedPhone && { phoneNumber: formattedPhone }),
      },
      metadata: {
        duration: durationInMinutes.toString(),
      },
      ...(durationInMinutes && { lengthInMinutes: durationInMinutes }),
    };

    if (location) {
      if (
        location.toLowerCase().includes("google meet") ||
        location.toLowerCase().includes("googlemeet")
      ) {
        bookingData.location = {
          type: "integration",
          integration: "google-meet",
        };
      } else if (location.toLowerCase().includes("zoom")) {
        bookingData.location = { type: "integration", integration: "zoom" };
      } else if (location.toLowerCase().includes("phone")) {
        bookingData.location = { type: "phone" };
      } else {
        bookingData.location = { type: "attendeeAddress", value: location };
      }
    }

    if (notes) {
      bookingData.bookingFieldsResponses = {
        notes: notes,
      };
    }

    console.log(
      "Creating booking with data:",
      JSON.stringify(bookingData, null, 2),
    );

    const response = await fetch(`https://api.cal.com/v2/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CAL_COM_API_KEY}`,
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com booking API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestData: bookingData,
      });

      let userMessage =
        "There was an error processing your booking. Please contact us directly to complete your reservation.";
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.message === "booker_limit_exceeded_error") {
          userMessage =
            "You have already booked this session. Each person can only book once per group session.";
        } else if (
          errorJson.message === "Attempting to book a meeting in the past."
        ) {
          userMessage =
            "This booking time is no longer available. Please try again.";
        } else if (errorJson.message === "no_available_users_found_error") {
          userMessage =
            "This time slot is no longer available. Please select a different time or contact us for assistance.";
        } else if (errorJson.message && !errorJson.message.includes("_error")) {
          userMessage = errorJson.message;
        }
      } catch {}

      return NextResponse.json(
        { error: userMessage, details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("Booking created successfully:", data);

    return NextResponse.json({
      success: true,
      booking: data,
      message: "Booking created successfully!",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
