import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!CAL_COM_API_KEY) {
      console.error("CAL_COM_API_KEY is not set");
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { eventTypeId } = body;

    if (!eventTypeId) {
      return NextResponse.json(
        { error: "Event type ID is required" },
        { status: 400 },
      );
    }

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
      const errorData = await response.text();
      console.error("Cal.com bookings API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { error: "Failed to fetch bookings from Cal.com", details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    const bookings = data.data || [];

    const activeBookings = bookings.filter(
      (booking: { status: string; eventType?: { id: number } }) =>
        (booking.status === "accepted" || booking.status === "pending") &&
        booking.eventType?.id === eventTypeId,
    );

    let totalParticipants = 0;
    activeBookings.forEach(
      (booking: {
        id: number;
        status: string;
        attendees?: Array<{ email: string }>;
      }) => {
        const attendeeCount = booking.attendees?.length || 1; // Default to 1 if no attendees array
        totalParticipants += attendeeCount;
        console.log(`Booking ${booking.id}: ${attendeeCount} attendee(s)`);
      },
    );

    console.log(
      `Event type ${eventTypeId}: ${activeBookings.length} active booking(s), ${totalParticipants} total participant(s)`,
    );

    return NextResponse.json({
      bookingCount: totalParticipants,
      eventTypeId,
    });
  } catch (error) {
    console.error("Error fetching booking count:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
