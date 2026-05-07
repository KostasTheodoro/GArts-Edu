import { NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

interface CalEventType {
  id: number;
  slug: string;
  title: string;
  description?: string;
  lengthInMinutes?: number;
  length?: number;
  locations?: Array<{
    type?: string;
    address?: string;
    link?: string;
  }>;
  seatsPerTimeSlot?: number;
  hidden?: boolean;
  metadata?: {
    multipleDuration?: number[];
  };
}

export async function GET() {
  try {
    if (!CAL_COM_API_KEY) {
      console.error("CAL_COM_API_KEY is not set");
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(`https://api.cal.com/v2/event-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CAL_COM_API_KEY}`,
        "cal-api-version": "2024-06-14",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com event types API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        {
          error: "Failed to fetch event types from Cal.com",
          details: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("Cal.com API response:", JSON.stringify(data, null, 2));

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected Cal.com API response structure:", data);
      return NextResponse.json(
        { error: "Unexpected response format from Cal.com" },
        { status: 500 },
      );
    }

    const eventTypes = (data.data as CalEventType[])
      .filter(
        (et) =>
          (et.slug?.includes("blender") ||
            et.slug?.includes("photoshop") ||
            et.slug?.includes("premiere") ||
            et.slug?.includes("after-effects") ||
            et.slug?.includes("group")) &&
          !et.hidden,
      )
      .map((et) => ({
        id: et.id,
        slug: et.slug,
        title: et.title,
        description: et.description || "",
        length: et.lengthInMinutes || et.length,
        locations: et.locations || [],
        seatsPerTimeSlot: et.seatsPerTimeSlot || null,
        availableDurations: et.metadata?.multipleDuration || [
          et.lengthInMinutes || et.length,
        ],
      }));

    console.log(`Found ${eventTypes.length} matching event types`);
    return NextResponse.json({ eventTypes });
  } catch (error) {
    console.error("Error fetching event types:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
