import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

// Helper function to get event type details including schedule configuration
async function getEventTypeDetails(eventTypeId: number): Promise<{
  seatsPerTimeSlot: number | null;
  scheduledTime: string | null;
} | null> {
  try {
    const response = await fetch(
      `https://api.cal.com/v1/event-types/${eventTypeId}?apiKey=${CAL_COM_API_KEY}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch event type details:", response.status);
      return null;
    }

    const data = await response.json();
    const eventType = data.event_type;

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
  eventTypeId: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${CAL_COM_API_KEY}&eventTypeId=${eventTypeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch bookings for group:", response.status);
      return null;
    }

    const data = await response.json();
    const bookings = data.bookings || [];

    const activeBookings = bookings.filter(
      (booking: { status: string; eventTypeId?: number }) =>
        (booking.status === "ACCEPTED" || booking.status === "PENDING") &&
        booking.eventTypeId === eventTypeId
    );

    console.log("Found existing bookings for group:", {
      eventTypeId,
      total: bookings.length,
      active: activeBookings.length,
    });

    if (activeBookings.length > 0) {
      const firstBooking = activeBookings[0];
      console.log("Using existing booking time:", firstBooking.startTime);
      return firstBooking.startTime;
    }

    return null;
  } catch (error) {
    console.error("Error finding existing group booking:", error);
    return null;
  }
}

async function getNextAvailableSlot(
  eventTypeId: number,
  durationInMinutes: number
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
      `https://api.cal.com/v1/slots?apiKey=${CAL_COM_API_KEY}&eventTypeId=${eventTypeId}&startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}&timeZone=Europe/Athens&duration=${durationInMinutes}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch slots for group session:",
        response.status,
        errorText
      );
      return null;
    }

    const data = await response.json();
    const slots = data.slots || {};

    console.log("Group slots response:", {
      eventTypeId,
      availableDates: Object.keys(slots),
      totalSlots: Object.values(slots).flat().length,
    });

    for (const dateKey of Object.keys(slots).sort()) {
      if (slots[dateKey] && slots[dateKey].length > 0) {
        console.log("Found slot for group:", slots[dateKey][0].time);
        return slots[dateKey][0].time;
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

    // Check if this is a group session (placeholder date/time)
    const isGroupSession = date === "group-session" || time === "scheduled";

    // Validate required fields with detailed error messages
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
        { status: 400 }
      );
    }

    // Validate API key
    if (!CAL_COM_API_KEY) {
      console.error("CAL_COM_API_KEY is not set");
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 }
      );
    }

    // Convert duration to minutes
    const durationInMinutes = duration === "1h" ? 60 : 120;

    let startDateTime: string;

    if (isGroupSession) {
      // For group sessions with seats, first try to find an existing booking
      // This allows multiple people to book the same group session
      const eventDetails = await getEventTypeDetails(eventTypeId);
      const hasSeats =
        eventDetails?.seatsPerTimeSlot && eventDetails.seatsPerTimeSlot > 1;

      console.log("Group session booking:", {
        eventTypeId,
        hasSeats,
        seatsPerTimeSlot: eventDetails?.seatsPerTimeSlot,
      });

      if (hasSeats) {
        // Check if there's already a booking for this group - use that time
        const existingBookingTime = await findExistingGroupBooking(eventTypeId);

        if (existingBookingTime) {
          // Use the same time as the existing booking (join the group)
          startDateTime = new Date(existingBookingTime).toISOString();
          console.log(
            "Group session - joining existing booking at:",
            startDateTime
          );
        } else {
          // No existing booking, get the first available slot
          const nextSlot = await getNextAvailableSlot(
            eventTypeId,
            durationInMinutes
          );
          if (!nextSlot) {
            return NextResponse.json(
              { error: "No available slots for this group session" },
              { status: 400 }
            );
          }
          startDateTime = new Date(nextSlot).toISOString();
          console.log(
            "Group session - creating new booking at:",
            startDateTime
          );
        }
      } else {
        // No seats feature, use slots API
        const nextSlot = await getNextAvailableSlot(
          eventTypeId,
          durationInMinutes
        );
        if (!nextSlot) {
          return NextResponse.json(
            { error: "No available slots for this group session" },
            { status: 400 }
          );
        }
        startDateTime = new Date(nextSlot).toISOString();
        console.log("Group session (no seats) - using slot:", startDateTime);
      }
    } else {
      startDateTime = new Date(`${date}T${time}:00`).toISOString();
    }

    // Prepare booking data for Cal.com API
    const bookingData = {
      eventTypeId: eventTypeId,
      start: startDateTime,
      responses: {
        name: `${firstName} ${lastName}`,
        email: email,
        location: location,
        ...(phone && { attendeePhoneNumber: phone }),
        ...(notes && { notes: notes }),
      },
      metadata: {
        duration: durationInMinutes.toString(), // Cal.com expects string, not number
      },
      timeZone: "Europe/Athens",
      language: "en",
    };

    console.log(
      "Creating booking with data:",
      JSON.stringify(bookingData, null, 2)
    );

    const response = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${CAL_COM_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com booking API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestData: bookingData,
      });

      // Parse the error for better user feedback
      let userMessage = "Failed to create booking on Cal.com";
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
        } else if (errorJson.message) {
          userMessage = errorJson.message;
        }
      } catch {
        // Keep default message if parsing fails
      }

      return NextResponse.json(
        { error: userMessage, details: errorData },
        { status: response.status }
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
      { status: 500 }
    );
  }
}
