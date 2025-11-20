import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;
const CAL_COM_USERNAME = process.env.CAL_COM_USERNAME;

export async function POST(req: NextRequest) {
  try {
    const { eventTypeId, date, duration } = await req.json();

    if (!eventTypeId || !date || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Convert duration to minutes (1h = 60, 2h = 120)
    const durationInMinutes = duration === "1h" ? 60 : 120;

    // Format date for Cal.com API with Europe/Athens timezone
    const timeZone = "Europe/Athens";
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    // Call Cal.com API to get availability
    // Cal.com v1 API uses query parameter authentication, not Bearer token
    // Endpoint is /v1/slots not /v1/slots/available
    const apiUrl = `https://api.cal.com/v1/slots?apiKey=${CAL_COM_API_KEY}&eventTypeId=${eventTypeId}&startTime=${startOfDay.toISOString()}&endTime=${endOfDay.toISOString()}&timeZone=${encodeURIComponent(timeZone)}`;

    console.log("Fetching availability:", { eventTypeId, date, duration, url: apiUrl });

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com availability API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { error: "Failed to fetch availability from Cal.com", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Cal.com availability response:", JSON.stringify(data, null, 2));

    // Extract available time slots - handle different response formats
    let slots = [];

    if (data.slots) {
      // Check if slots is an object with dates as keys
      if (typeof data.slots === 'object' && !Array.isArray(data.slots)) {
        // Format: { "2025-11-19": [{ time: "..." }] }
        const dateSlots = data.slots[date];
        slots = Array.isArray(dateSlots) ? dateSlots : [];
      } else if (Array.isArray(data.slots)) {
        // Format: [{ time: "..." }]
        slots = data.slots;
      }
    }

    // Ensure all slots have a 'time' property
    const formattedSlots = slots.map((slot: any) => ({
      time: slot.time || slot,
    }));

    console.log(`Found ${formattedSlots.length} available slots for ${date}`);
    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
