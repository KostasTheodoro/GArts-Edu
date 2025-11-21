import { NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

export async function GET() {
  try {
    // Validate API key
    if (!CAL_COM_API_KEY) {
      console.error("CAL_COM_API_KEY is not set");
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 }
      );
    }

    // Fetch event types from Cal.com API
    // Cal.com v1 API uses query parameter authentication, not Bearer token
    const response = await fetch(
      `https://api.cal.com/v1/event-types?apiKey=${CAL_COM_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cal.com event types API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { error: "Failed to fetch event types from Cal.com", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Cal.com API response:", JSON.stringify(data, null, 2));

    // Validate response structure
    if (!data.event_types || !Array.isArray(data.event_types)) {
      console.error("Unexpected Cal.com API response structure:", data);
      return NextResponse.json(
        { error: "Unexpected response format from Cal.com" },
        { status: 500 }
      );
    }

    // Filter to our event types (private lessons and group sessions)
    const eventTypes = data.event_types
      .filter(
        (et: any) =>
          et.slug?.includes("blender") ||
          et.slug?.includes("photoshop") ||
          et.slug?.includes("premiere") ||
          et.slug?.includes("after-effects") ||
          et.slug?.includes("group") // Include group sessions
      )
      .map((et: any) => ({
        id: et.id,
        slug: et.slug,
        title: et.title,
        description: et.description || "",
        length: et.length,
        locations: et.locations || [],
        seatsPerTimeSlot: et.seatsPerTimeSlot || null,
        // Get available durations from metadata, or use length as single option
        availableDurations: et.metadata?.multipleDuration || [et.length],
      }));

    console.log(`Found ${eventTypes.length} matching event types`);
    return NextResponse.json({ eventTypes });
  } catch (error) {
    console.error("Error fetching event types:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
