import { NextRequest, NextResponse } from "next/server";

const CAL_COM_API_KEY = process.env.CAL_COM_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!CAL_COM_API_KEY) {
      console.error("CAL_COM_API_KEY is not set");
      return NextResponse.json(
        { error: "Cal.com API key is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { eventTypeId } = body;

    if (!eventTypeId) {
      return NextResponse.json(
        { error: "Event type ID is required" },
        { status: 400 }
      );
    }

    // Fetch bookings for this event type from Cal.com API
    // Cal.com v1 API uses query parameter authentication
    const response = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${CAL_COM_API_KEY}&eventTypeId=${eventTypeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
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
        { status: response.status }
      );
    }

    const data = await response.json();

    // Count only active bookings (not cancelled) for this specific event type
    // Cal.com API may return all bookings, so we filter by eventTypeId on our side as well
    const bookings = data.bookings || [];

    // Filter to active bookings for this event type
    const activeBookings = bookings.filter(
      (booking: { status: string; eventTypeId?: number }) =>
        (booking.status === "ACCEPTED" || booking.status === "PENDING") &&
        booking.eventTypeId === eventTypeId
    );

    // For seats-enabled events, Cal.com stores multiple attendees within a single booking
    // We need to count the total number of attendees, not just the number of bookings
    let totalParticipants = 0;
    activeBookings.forEach((booking: { id: number; status: string; attendees?: Array<{ email: string }> }) => {
      const attendeeCount = booking.attendees?.length || 1; // Default to 1 if no attendees array
      totalParticipants += attendeeCount;
      console.log(`Booking ${booking.id}: ${attendeeCount} attendee(s)`);
    });

    console.log(
      `Event type ${eventTypeId}: ${activeBookings.length} active booking(s), ${totalParticipants} total participant(s)`
    );

    return NextResponse.json({
      bookingCount: totalParticipants, // Return total participants, not booking count
      eventTypeId,
    });
  } catch (error) {
    console.error("Error fetching booking count:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
