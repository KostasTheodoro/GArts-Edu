import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

// Helper function to get next available slot for group sessions
async function getNextAvailableSlot(eventTypeId: number, durationInMinutes: number): Promise<string | null> {
  try {
    // Get slots for the next 30 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const response = await fetch(
      `https://api.cal.com/v1/slots?apiKey=${CAL_COM_API_KEY}&eventTypeId=${eventTypeId}&startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}&timeZone=Europe/Athens&duration=${durationInMinutes}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch slots for group session");
      return null;
    }

    const data = await response.json();
    const slots = data.slots || {};

    // Get the first available slot
    for (const dateKey of Object.keys(slots).sort()) {
      if (slots[dateKey] && slots[dateKey].length > 0) {
        return slots[dateKey][0].time;
      }
    }

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
          receivedData: body
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
      // For group sessions, get the next available slot
      const nextSlot = await getNextAvailableSlot(eventTypeId, durationInMinutes);
      if (!nextSlot) {
        return NextResponse.json(
          { error: "No available slots for this group session" },
          { status: 400 }
        );
      }
      startDateTime = new Date(nextSlot).toISOString();
      console.log("Group session - using next available slot:", startDateTime);
    } else {
      // Combine date and time to create start datetime in local timezone
      // Then convert to ISO for Cal.com API
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
      },
      metadata: {
        phone: phone || "",
        notes: notes || "",
        duration: durationInMinutes.toString(), // Cal.com expects string, not number
      },
      timeZone: "Europe/Athens",
      language: "en",
    };

    console.log("Creating booking with data:", JSON.stringify(bookingData, null, 2));

    // Call Cal.com API to create booking
    // Cal.com v1 API uses query parameter authentication, not Bearer token
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
      return NextResponse.json(
        { error: "Failed to create booking on Cal.com", details: errorData },
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
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
