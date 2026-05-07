import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

interface CalSlot {
  start?: string;
  time?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { eventTypeId, month, year, duration } = await req.json();

    if (!eventTypeId || month === undefined || !year || !duration) {
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

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const startTime = startOfMonth.toISOString();
    const endTime = new Date(
      endOfMonth.setHours(23, 59, 59, 999),
    ).toISOString();

    const apiUrl = `https://api.cal.com/v2/slots?eventTypeId=${eventTypeId}&start=${startTime}&end=${endTime}&timeZone=${encodeURIComponent(timeZone)}&duration=${durationInMinutes}`;

    console.log("Fetching available dates for month:", {
      eventTypeId,
      month,
      year,
      duration,
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

    const datesWithSlots = new Set<string>();

    const slotsData: Record<string, CalSlot[]> | CalSlot[] | undefined =
      data.data || data.slots;

    if (slotsData) {
      if (typeof slotsData === "object" && !Array.isArray(slotsData)) {
        Object.keys(slotsData).forEach((dateKey) => {
          const dateSlots = slotsData[dateKey];
          if (Array.isArray(dateSlots) && dateSlots.length > 0) {
            datesWithSlots.add(dateKey);
          }
        });
      } else if (Array.isArray(slotsData)) {
        slotsData.forEach((slot) => {
          const slotTime = slot.start || slot.time;
          if (slotTime) {
            const date = new Date(slotTime);
            const dateStr = date.toISOString().split("T")[0];
            datesWithSlots.add(dateStr);
          }
        });
      }
    }

    const availableDates = Array.from(datesWithSlots);
    console.log(
      `Found ${availableDates.length} dates with availability in month ${month + 1}/${year}`,
    );

    return NextResponse.json({ availableDates });
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
