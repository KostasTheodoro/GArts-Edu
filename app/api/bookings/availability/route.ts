import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

interface CalSlot {
  start?: string;
  time?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { eventTypeId, date, duration } = await req.json();

    if (!eventTypeId || !date || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const timeZone = "Europe/Athens";
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const apiUrl = `https://api.cal.com/v2/slots?eventTypeId=${eventTypeId}&start=${startOfDay.toISOString()}&end=${endOfDay.toISOString()}&timeZone=${encodeURIComponent(timeZone)}&duration=${durationInMinutes}`;

    console.log("Fetching availability:", {
      eventTypeId,
      date,
      duration,
      durationInMinutes,
      url: apiUrl,
    });

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CAL_COM_API_KEY}`,
        "cal-api-version": "2024-09-04",
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
        {
          error: "Failed to fetch availability from Cal.com",
          details: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log(
      "Cal.com availability response:",
      JSON.stringify(data, null, 2),
    );

    let slots: CalSlot[] = [];

    const slotsData: Record<string, CalSlot[]> | CalSlot[] | undefined =
      data.data || data.slots;

    if (slotsData) {
      if (typeof slotsData === "object" && !Array.isArray(slotsData)) {
        const dateSlots = slotsData[date];
        slots = Array.isArray(dateSlots) ? dateSlots : [];
      } else if (Array.isArray(slotsData)) {
        slots = slotsData;
      }
    }

    const formattedSlots = slots.map((slot) => ({
      time: slot.start || slot.time || "",
    }));

    console.log(`Found ${formattedSlots.length} available slots for ${date}`);
    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
