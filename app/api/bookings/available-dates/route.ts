import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;
const CAL_COM_USERNAME = process.env.CAL_COM_USERNAME;

export async function POST(req: NextRequest) {
  try {
    const { eventTypeId, month, year, duration } = await req.json();

    if (!eventTypeId || month === undefined || !year || !duration) {
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

    // Format date range for Cal.com API with Europe/Athens timezone
    const timeZone = "Europe/Athens";

    // Get first and last day of the month
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0); // Last day of month

    const startTime = startOfMonth.toISOString();
    const endTime = new Date(endOfMonth.setHours(23, 59, 59, 999)).toISOString();

    // Build API URL
    const username = CAL_COM_USERNAME || "";
    let apiUrl = `https://api.cal.com/v1/slots?apiKey=${CAL_COM_API_KEY}&eventTypeId=${eventTypeId}&startTime=${startTime}&endTime=${endTime}&timeZone=${encodeURIComponent(timeZone)}&duration=${durationInMinutes}`;

    // Add username if available to ensure proper conflict checking
    if (username) {
      apiUrl += `&usernameList=${encodeURIComponent(username)}`;
    }

    console.log("Fetching available dates for month:", { eventTypeId, month, year, duration });

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

    // Extract unique dates that have available slots
    const datesWithSlots = new Set<string>();

    if (data.slots) {
      // Check if slots is an object with dates as keys
      if (typeof data.slots === 'object' && !Array.isArray(data.slots)) {
        // Format: { "2025-11-19": [{ time: "..." }] }
        Object.keys(data.slots).forEach(dateKey => {
          const dateSlots = data.slots[dateKey];
          if (Array.isArray(dateSlots) && dateSlots.length > 0) {
            datesWithSlots.add(dateKey);
          }
        });
      } else if (Array.isArray(data.slots)) {
        // Format: [{ time: "2025-11-19T10:00:00Z" }]
        data.slots.forEach((slot: any) => {
          if (slot.time) {
            const date = new Date(slot.time);
            const dateStr = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
            datesWithSlots.add(dateStr);
          }
        });
      }
    }

    const availableDates = Array.from(datesWithSlots);
    console.log(`Found ${availableDates.length} dates with availability in month ${month + 1}/${year}`);

    return NextResponse.json({ availableDates });
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
