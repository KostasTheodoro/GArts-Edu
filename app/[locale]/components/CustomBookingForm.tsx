"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Package,
  Calendar,
  User,
  FileText,
  Check,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarComponent from "./Calendar";
import CustomSelect from "./CustomSelect";

type SessionType = "individual" | "group";
type SoftwareType = "blender" | "photoshop" | "premierePro" | "afterEffects";
type DurationType = "1h" | "2h";
type LocationType = "online" | "offline";

interface Location {
  type?: string;
  address?: string;
  link?: string;
}

interface BookingData {
  sessionType: SessionType;
  software: SoftwareType | null;
  groupEventId: number | null;
  duration: DurationType | null;
  location: LocationType | null;
  locationAddress: string | null;
  date: string | null;
  time: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

interface EventType {
  id: number;
  slug: string;
  title: string;
  description: string;
  length: number;
  locations: Location[];
  seatsPerTimeSlot: number | null;
  availableDurations: number[]; // Array of available durations in minutes
}

const softwareOptions: SoftwareType[] = [
  "blender",
  "photoshop",
  "premierePro",
  "afterEffects",
];

export default function CustomBookingForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("bookings.form");
  const tSoftware = useTranslations("bookings.software");

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    sessionType: "individual",
    software: null,
    groupEventId: null,
    duration: null,
    location: null,
    locationAddress: null,
    date: null,
    time: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoadingEventTypes, setIsLoadingEventTypes] = useState(true);
  const [emailError, setEmailError] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [groupBookingCount, setGroupBookingCount] = useState<number | null>(
    null
  );
  const [isLoadingBookingCount, setIsLoadingBookingCount] = useState(false);

  // Fetch event types on mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/bookings/event-types");
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch event types:", errorData);
          throw new Error(errorData.error || "Failed to fetch event types");
        }
        const data = await response.json();
        console.log("Event types fetched:", data.eventTypes);
        setEventTypes(data.eventTypes || []);
      } catch (error) {
        console.error("Error fetching event types:", error);
        setNotification({
          type: "error",
          message:
            "Failed to load available courses. Please refresh the page and try again.",
        });
      } finally {
        setIsLoadingEventTypes(false);
      }
    };

    fetchEventTypes();
  }, []);

  // Filter event types into group events
  const groupEventTypes = useMemo(() => {
    return eventTypes.filter((et) => et.slug.includes("group"));
  }, [eventTypes]);

  // Derive selectedEventType based on session type
  const selectedEventType = useMemo(() => {
    if (eventTypes.length === 0) return null;

    if (bookingData.sessionType === "individual") {
      // For individual sessions, derive from software selection
      if (!bookingData.software) return null;

      const slugMap: Record<SoftwareType, string> = {
        blender: "blender-private",
        photoshop: "photoshop-private",
        premierePro: "premiere-pro-private",
        afterEffects: "after-effects-private",
      };

      const slug = slugMap[bookingData.software];
      return eventTypes.find((et) => et.slug === slug) || null;
    } else {
      // For group sessions, find by groupEventId
      if (!bookingData.groupEventId) return null;
      return (
        eventTypes.find((et) => et.id === bookingData.groupEventId) || null
      );
    }
  }, [
    bookingData.sessionType,
    bookingData.software,
    bookingData.groupEventId,
    eventTypes,
  ]);

  // Fetch available time slots when date changes (only for individual sessions)
  useEffect(() => {
    const fetchAvailability = async () => {
      // Skip fetching for group sessions - they don't need time slot selection
      if (bookingData.sessionType === "group") {
        return;
      }

      if (!bookingData.date || !selectedEventType) {
        setAvailableTimeSlots([]);
        return;
      }

      // For individual sessions, require software and duration
      if (!bookingData.software || !bookingData.duration) {
        setAvailableTimeSlots([]);
        return;
      }

      const durationValue = bookingData.duration;

      setIsLoadingSlots(true);
      try {
        const response = await fetch("/api/bookings/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventTypeId: selectedEventType.id,
            date: bookingData.date,
            duration: durationValue,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch availability:", errorData);
          throw new Error(errorData.error || "Failed to fetch availability");
        }

        const data = await response.json();
        console.log("Availability data received:", data);

        const slots = data.slots
          .filter((slot: { time: string }) => slot.time)
          .map((slot: { time: string }) => {
            const date = new Date(slot.time);
            return date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          });

        console.log(`Processed ${slots.length} time slots`);
        setAvailableTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setAvailableTimeSlots([]);
        // Only show error notification for individual sessions
        if (bookingData.sessionType === "individual") {
          setNotification({
            type: "error",
            message: "Failed to load available time slots. Please try again.",
          });
        }
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [
    bookingData.date,
    bookingData.sessionType,
    bookingData.software,
    bookingData.duration,
    bookingData.groupEventId,
    selectedEventType,
  ]);

  // Fetch available dates for the current month (only for individual sessions)
  useEffect(() => {
    const fetchAvailableDates = async () => {
      // Skip fetching for group sessions - they don't use calendar selection
      if (bookingData.sessionType === "group") {
        return;
      }

      if (!selectedEventType) {
        setAvailableDates([]);
        return;
      }

      // For individual sessions, require software and duration
      if (!bookingData.software || !bookingData.duration) {
        setAvailableDates([]);
        return;
      }

      const durationValue = bookingData.duration;

      try {
        const response = await fetch("/api/bookings/available-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventTypeId: selectedEventType.id,
            month: calendarMonth,
            year: calendarYear,
            duration: durationValue,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch available dates:", errorData);
          throw new Error(errorData.error || "Failed to fetch available dates");
        }

        const data = await response.json();
        console.log(
          `Available dates for ${calendarMonth + 1}/${calendarYear}:`,
          data.availableDates
        );
        setAvailableDates(data.availableDates || []);
      } catch (error) {
        console.error("Error fetching available dates:", error);
        setAvailableDates([]);
      }
    };

    fetchAvailableDates();
  }, [
    bookingData.sessionType,
    bookingData.software,
    bookingData.duration,
    bookingData.groupEventId,
    selectedEventType,
    calendarMonth,
    calendarYear,
  ]);

  // Auto-select duration if only one option is available
  useEffect(() => {
    if (!selectedEventType || bookingData.duration) return;

    const availableDurations = selectedEventType.availableDurations;
    if (availableDurations && availableDurations.length === 1) {
      const singleDuration = minutesToDurationType(availableDurations[0]);
      setBookingData((prev) => ({
        ...prev,
        duration: singleDuration,
      }));
    }
  }, [selectedEventType, bookingData.duration]);

  // Auto-select location if only one option is available
  useEffect(() => {
    if (!selectedEventType || bookingData.location) return;

    const locations = selectedEventType.locations;
    if (locations && locations.length === 1) {
      const singleLocation = locations[0];
      const locationValue = singleLocation.type || "online";
      setBookingData((prev) => ({
        ...prev,
        location: locationValue as LocationType,
        locationAddress: singleLocation.address || null,
      }));
    }
  }, [selectedEventType, bookingData.location]);

  // Fetch booking count for group events
  useEffect(() => {
    const fetchBookingCount = async () => {
      if (bookingData.sessionType !== "group" || !bookingData.groupEventId) {
        setGroupBookingCount(null);
        return;
      }

      setIsLoadingBookingCount(true);
      try {
        const response = await fetch("/api/bookings/booking-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventTypeId: bookingData.groupEventId,
          }),
        });

        if (!response.ok) {
          console.error("Failed to fetch booking count");
          setGroupBookingCount(null);
          return;
        }

        const data = await response.json();
        setGroupBookingCount(data.bookingCount);
      } catch (error) {
        console.error("Error fetching booking count:", error);
        setGroupBookingCount(null);
      } finally {
        setIsLoadingBookingCount(false);
      }
    };

    fetchBookingCount();
  }, [bookingData.sessionType, bookingData.groupEventId]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Validate based on session type
    if (bookingData.sessionType === "individual" && !bookingData.software)
      return;
    if (bookingData.sessionType === "group" && !bookingData.groupEventId)
      return;
    if (!selectedEventType) return;

    const bookingPayload = {
      eventTypeId: selectedEventType.id,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
      location: bookingData.location,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email,
      phone: bookingData.phone,
      notes: bookingData.notes,
    };

    console.log("Submitting booking with data:", bookingPayload);

    setSubmissionStatus("submitting");
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking error response:", errorData);
        throw new Error(
          errorData.missingFields
            ? `Missing fields: ${errorData.missingFields.join(", ")}`
            : errorData.error || "Failed to create booking"
        );
      }

      const data = await response.json();
      console.log("Booking successful:", data);
      setSubmissionStatus("success");
      setNotification({
        type: "success",
        message:
          "Booking confirmed! You will receive a confirmation email shortly.",
      });

      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    } catch (error) {
      console.error("Error creating booking:", error);
      setSubmissionStatus("error");
      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create booking. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setStep(1);
    setBookingData({
      sessionType: "individual",
      software: null,
      groupEventId: null,
      duration: null,
      location: null,
      locationAddress: null,
      date: null,
      time: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    });
    setEmailError("");
    setNotification(null);
    setSubmissionStatus("idle");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canProceedStep1 =
    bookingData.sessionType === "individual"
      ? bookingData.software && bookingData.duration && bookingData.location
      : bookingData.groupEventId !== null &&
        bookingData.duration &&
        bookingData.location;
  const canProceedStep2 =
    bookingData.sessionType === "group"
      ? true // Group sessions can always proceed from step 2
      : bookingData.date && bookingData.time;
  const canProceedStep3 =
    bookingData.firstName &&
    bookingData.lastName &&
    bookingData.email &&
    isValidEmail(bookingData.email) &&
    !emailError;

  const calculateCost = () => {
    const baseCost = bookingData.duration === "1h" ? 30 : 50; // Example pricing
    return baseCost;
  };

  // Helper function to parse Cal.com description format
  // Converts ****text**** to bold, <br> to line breaks, _text_ to italic
  const parseDescription = (description: string): string => {
    if (!description) return "";

    const parsed = description
      // Convert ****text**** to <strong>text</strong>
      .replace(/\*\*\*\*([^*]+)\*\*\*\*/g, "<strong>$1</strong>")
      // Convert **text** to <strong>text</strong> (standard markdown)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // Convert _text_ to <em>text</em> (for italic)
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      // Keep <br> tags as they are (they're already HTML)
      // Convert \n to <br> if any
      .replace(/\n/g, "<br>");

    return parsed;
  };

  // Helper function to extract specific field from description
  // e.g., extractDescriptionField(description, "Running Period") returns "1/12/25 - 31/2/26..."
  const extractDescriptionField = (
    description: string,
    fieldName: string
  ): string | null => {
    if (!description) return null;

    // Pattern matches ****Field Name:**** value or **Field Name:** value
    // The value continues until the next <br> or end of string
    const pattern = new RegExp(
      `\\*{2,4}${fieldName}:\\*{2,4}\\s*([^<]+?)(?:<br>|$)`,
      "i"
    );

    const match = description.match(pattern);
    return match ? match[1].trim() : null;
  };

  // Helper function to format location display name
  const formatLocationName = (locationType: string): string => {
    if (locationType === "inPerson") {
      return t("location.inPerson");
    }

    if (locationType?.startsWith("integrations:")) {
      // Extract integration parts (e.g., "integrations:google:meet" -> ["google", "meet"])
      const parts = locationType.split(":").slice(1);

      // Format each part: capitalize first letter
      const formatted = parts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

      return formatted;
    }

    // Default fallback
    return locationType || t("location.online");
  };

  // Helper function to format duration (handles both "1h"/"2h" and minutes)
  const formatDuration = (duration: string | number): string => {
    if (typeof duration === "number") {
      return `${duration}'`;
    }
    if (duration === "1h") return "60'";
    if (duration === "2h") return "120'";
    if (duration.endsWith("m")) {
      return `${duration.slice(0, -1)}'`;
    }
    return duration;
  };

  // Helper function to convert minutes to duration type for API calls
  const minutesToDurationType = (minutes: number): DurationType => {
    return minutes === 60 ? "1h" : "2h";
  };

  // Helper function to format time slot as range (e.g., "9:00-10:00", "9:00-11:00")
  const formatTimeRange = (
    startTime: string,
    duration: DurationType | string | null
  ): string => {
    if (!duration) return startTime;

    const [hours, minutes] = startTime.split(":").map(Number);

    // Handle different duration formats: "1h", "2h", or "60m", "90m", etc.
    let durationMinutes: number;
    if (duration === "1h") {
      durationMinutes = 60;
    } else if (duration === "2h") {
      durationMinutes = 120;
    } else if (duration.endsWith("m")) {
      durationMinutes = parseInt(duration.slice(0, -1)) || 60;
    } else {
      durationMinutes = 60; // Default fallback
    }

    // Calculate end time
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Format times as HH:MM
    const formatTime = (date: Date) => {
      const h = date.getHours();
      const m = date.getMinutes();
      return `${h}:${m.toString().padStart(2, "0")}`;
    };

    return `${formatTime(startDate)}-${formatTime(endDate)}`;
  };

  // Helper function to get step details with individual selections
  const getStepInfo = (stepNumber: number) => {
    // Build step 1 selections based on session type
    const step1Selections =
      bookingData.sessionType === "individual"
        ? [
            bookingData.software
              ? tSoftware(`${bookingData.software}.title`)
              : null,
            bookingData.duration ? formatDuration(bookingData.duration) : null,
            bookingData.location
              ? formatLocationName(bookingData.location)
              : null,
          ].filter(Boolean)
        : [
            selectedEventType ? selectedEventType.title : null,
            bookingData.duration ? formatDuration(bookingData.duration) : null,
            bookingData.location
              ? formatLocationName(bookingData.location)
              : null,
          ].filter(Boolean);

    // Get duration for time range formatting
    const durationForTimeRange =
      bookingData.sessionType === "group" && selectedEventType
        ? `${selectedEventType.length}m`
        : bookingData.duration;

    const steps = [
      {
        number: 1,
        icon: Package,
        title: t("steps.serviceSelection"),
        selections: step1Selections,
      },
      {
        number: 2,
        icon: Calendar,
        title:
          bookingData.sessionType === "group"
            ? t("steps.groupInfo")
            : t("steps.dateTime"),
        selections:
          bookingData.sessionType === "group"
            ? bookingData.date === "group-session"
              ? [t("seatReserved")]
              : []
            : [
                bookingData.date ? bookingData.date : null,
                bookingData.time
                  ? formatTimeRange(bookingData.time, durationForTimeRange)
                  : null,
              ].filter(Boolean),
      },
      {
        number: 3,
        icon: User,
        title: t("steps.yourInformation"),
        selections: [],
      },
      {
        number: 4,
        icon: FileText,
        title: t("steps.overview"),
        selections: [],
      },
    ];
    return steps[stepNumber - 1];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Notification Card - Above everything */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-60 w-[90%] max-w-md"
          >
            <div
              className={`rounded-xl shadow-2xl p-6 border-2 ${
                notification.type === "success"
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    notification.type === "success"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : (
                    <XCircle className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      notification.type === "success"
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {notification.type === "success" ? "Success!" : "Error"}
                  </h3>
                  <p
                    className={`${
                      notification.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className={`shrink-0 p-1 rounded-lg transition-colors ${
                    notification.type === "success"
                      ? "hover:bg-green-200"
                      : "hover:bg-red-200"
                  }`}
                >
                  <X
                    className={`w-5 h-5 ${
                      notification.type === "success"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-5xl h-dvh sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Sidebar - Step Indicator (Hidden on mobile, visible on md+) */}
          <div className="hidden md:flex md:w-80 bg-neural-dark flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-3xl font-bold text-white">{t("title")}</h2>
            </div>

            {/* Steps */}
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
              {[1, 2, 3, 4].map((s) => {
                const stepInfo = getStepInfo(s);
                const StepIcon = stepInfo.icon;
                const isCompleted = s < step;
                const isActive = s === step;

                return (
                  <div key={s} className="space-y-3">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-primary/20"
                            : isCompleted
                              ? "bg-green-500/20"
                              : "bg-white/5"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-green-500" />
                        ) : (
                          <StepIcon
                            className={`w-6 h-6 ${
                              isActive ? "text-primary" : "text-white/50"
                            }`}
                          />
                        )}
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold transition-colors ${
                            isActive ? "text-primary" : "text-white"
                          }`}
                        >
                          {stepInfo.title}
                        </h3>
                      </div>
                    </div>

                    {/* Individual Selections */}
                    {stepInfo.selections.length > 0 && (
                      <div className="ml-16 space-y-2">
                        <AnimatePresence>
                          {stepInfo.selections.map((selection) => (
                            <motion.div
                              key={`${s}-${selection}`}
                              layout
                              className="text-white/80 text-sm"
                              initial={{ opacity: 0, x: -32, scale: 0.8 }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1,
                                transition: {
                                  duration: 0.3,
                                  ease: "easeOut",
                                },
                              }}
                              exit={{
                                opacity: 0,
                                x: -32,
                                scale: 0.8,
                                transition: {
                                  duration: 0.2,
                                  ease: "easeIn",
                                },
                              }}
                            >
                              {selection}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Header with close button */}
            <div className="relative p-4 sm:p-6 border-b border-gray-200 shrink-0">
              {/* Close Button (Top Right) */}
              <button
                onClick={handleClose}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Mobile Step Indicator */}
              <div className="md:hidden mb-4 flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === step
                        ? "w-8 bg-primary"
                        : s < step
                          ? "w-2 bg-green-500"
                          : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="text-center md:pr-0 relative">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`group md:hidden absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
                    step === 1
                      ? "opacity-0 pointer-events-none"
                      : "bg-neural-dark hover:bg-primary border-2 border-neural-dark hover:border-primary"
                  }`}
                  aria-label="Back"
                >
                  <ChevronLeft className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </button>

                <h3 className="text-2xl sm:text-3xl font-bold text-neural-dark">
                  {getStepInfo(step).title}
                </h3>
                <div className="w-16 sm:w-20 h-1 bg-primary mx-auto mt-3 sm:mt-4"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {step === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neural-dark mb-2">
                      {t("selectSessionType")}
                    </label>
                    <CustomSelect
                      value={bookingData.sessionType}
                      onChange={(e) => {
                        const newSessionType = e.target.value as SessionType;
                        setBookingData({
                          ...bookingData,
                          sessionType: newSessionType,

                          software: null,
                          groupEventId: null,
                          duration: null,
                          location: null,
                          locationAddress: null,
                          date: null,
                          time: null,
                        });
                      }}
                      className="p-3 sm:p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white text-base"
                    >
                      <option value="individual">
                        {t("sessionType.individual")}
                      </option>
                      <option value="group">{t("sessionType.group")}</option>
                    </CustomSelect>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neural-dark mb-2">
                      {bookingData.sessionType === "individual"
                        ? t("selectSoftware")
                        : t("selectGroupSession")}
                    </label>
                    <CustomSelect
                      value={
                        bookingData.sessionType === "individual"
                          ? bookingData.software || ""
                          : bookingData.groupEventId?.toString() || ""
                      }
                      onChange={(e) => {
                        if (bookingData.sessionType === "individual") {
                          setBookingData({
                            ...bookingData,
                            software: e.target.value as SoftwareType,

                            location: null,
                            locationAddress: null,
                            date: null,
                            time: null,
                          });
                        } else {
                          const eventId = parseInt(e.target.value);
                          setBookingData({
                            ...bookingData,
                            groupEventId: eventId,

                            date: null,
                            time: null,
                          });
                        }
                      }}
                      className="p-3 sm:p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white text-base"
                      disabled={isLoadingEventTypes}
                    >
                      <option value="" disabled>
                        {isLoadingEventTypes
                          ? "Loading..."
                          : bookingData.sessionType === "individual"
                            ? t("selectSoftwarePlaceholder")
                            : t("selectGroupSessionPlaceholder")}
                      </option>
                      {bookingData.sessionType === "individual"
                        ? softwareOptions.map((software) => (
                            <option key={software} value={software}>
                              {tSoftware(`${software}.title`)}
                            </option>
                          ))
                        : groupEventTypes.map((event) => (
                            <option key={event.id} value={event.id}>
                              {event.title}
                            </option>
                          ))}
                    </CustomSelect>
                  </div>

                  {bookingData.sessionType === "individual" &&
                    bookingData.software && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-neural-dark mb-2">
                            {t("selectDuration")}
                          </label>
                          <CustomSelect
                            value={bookingData.duration || ""}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                duration: e.target.value as DurationType,

                                date: null,
                                time: null,
                              })
                            }
                            className="p-3 sm:p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white text-base"
                            disabled={!selectedEventType}
                          >
                            <option value="" disabled>
                              {t("selectDurationPlaceholder")}
                            </option>
                            {selectedEventType?.availableDurations?.map(
                              (minutes) => (
                                <option
                                  key={minutes}
                                  value={minutesToDurationType(minutes)}
                                >
                                  {minutes}&apos;
                                </option>
                              )
                            )}
                          </CustomSelect>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-neural-dark mb-2">
                            {t("selectLocation")}
                          </label>
                          <CustomSelect
                            value={bookingData.location || ""}
                            onChange={(e) => {
                              const selectedIndex = e.target.selectedIndex - 1;
                              const selectedLocation =
                                selectedEventType?.locations[selectedIndex];

                              setBookingData({
                                ...bookingData,
                                location: e.target.value as LocationType,
                                locationAddress:
                                  selectedLocation?.address || null,
                              });
                            }}
                            className="p-3 sm:p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white text-base"
                            disabled={!selectedEventType || isLoadingEventTypes}
                          >
                            <option value="" disabled>
                              {isLoadingEventTypes
                                ? "Loading..."
                                : !selectedEventType
                                  ? t("selectSoftwareFirst")
                                  : t("selectLocationPlaceholder")}
                            </option>
                            {selectedEventType?.locations &&
                              selectedEventType.locations.map(
                                (location: Location, index: number) => {
                                  let displayLabel = "Online";
                                  let locationValue =
                                    location.type || `location-${index}`;

                                  if (location.type) {
                                    displayLabel = formatLocationName(
                                      location.type
                                    );
                                    locationValue = location.type;
                                  } else if (location.link) {
                                    displayLabel = "Custom Link";
                                    locationValue = location.link;
                                  }

                                  return (
                                    <option key={index} value={locationValue}>
                                      {displayLabel}
                                    </option>
                                  );
                                }
                              )}
                          </CustomSelect>
                        </div>
                      </>
                    )}

                  {bookingData.sessionType === "group" &&
                    bookingData.groupEventId && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-neural-dark mb-2">
                            {t("selectDuration")}
                          </label>
                          <CustomSelect
                            value={bookingData.duration || ""}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                duration: e.target.value as DurationType,

                                date: null,
                                time: null,
                              })
                            }
                            className="p-3 sm:p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white text-base"
                            disabled={!selectedEventType}
                          >
                            <option value="" disabled>
                              {t("selectDurationPlaceholder")}
                            </option>
                            {selectedEventType?.availableDurations?.map(
                              (minutes) => (
                                <option
                                  key={minutes}
                                  value={minutesToDurationType(minutes)}
                                >
                                  {minutes}&apos;
                                </option>
                              )
                            )}
                          </CustomSelect>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-neural-dark mb-2">
                            {t("selectLocation")}
                          </label>
                          <CustomSelect
                            value={bookingData.location || ""}
                            onChange={(e) => {
                              const selectedIndex = e.target.selectedIndex - 1;
                              const selectedLocation =
                                selectedEventType?.locations[selectedIndex];

                              setBookingData({
                                ...bookingData,
                                location: e.target.value as LocationType,
                                locationAddress:
                                  selectedLocation?.address || null,
                              });
                            }}
                            className="p-3 sm:p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white text-base"
                            disabled={!selectedEventType || isLoadingEventTypes}
                          >
                            <option value="" disabled>
                              {isLoadingEventTypes
                                ? "Loading..."
                                : !selectedEventType
                                  ? t("selectGroupFirst")
                                  : t("selectLocationPlaceholder")}
                            </option>
                            {selectedEventType?.locations &&
                              selectedEventType.locations.map(
                                (location: Location, index: number) => {
                                  let displayLabel = "Online";
                                  let locationValue =
                                    location.type || `location-${index}`;

                                  if (location.type) {
                                    displayLabel = formatLocationName(
                                      location.type
                                    );
                                    locationValue = location.type;
                                  } else if (location.link) {
                                    displayLabel = "Custom Link";
                                    locationValue = location.link;
                                  }

                                  return (
                                    <option key={index} value={locationValue}>
                                      {displayLabel}
                                    </option>
                                  );
                                }
                              )}
                          </CustomSelect>
                        </div>
                      </>
                    )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  {bookingData.sessionType === "individual" && (
                    <>
                      <div>
                        <CalendarComponent
                          selectedDate={bookingData.date}
                          onDateSelect={(date) =>
                            setBookingData({ ...bookingData, date })
                          }
                          minDate={new Date()}
                          datesWithAvailability={availableDates}
                          onMonthChange={(month, year) => {
                            setCalendarMonth(month);
                            setCalendarYear(year);
                          }}
                        />
                      </div>

                      <AnimatePresence mode="wait">
                        {bookingData.date && (
                          <motion.div
                            key="time-slots"
                            initial={{ opacity: 0, y: 20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: 20, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            <label className="block text-sm font-semibold text-neural-dark mb-3">
                              {t("selectTime")}
                            </label>
                            {isLoadingSlots ? (
                              <div className="flex items-center justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="ml-3 text-gray-600">
                                  Loading available times...
                                </span>
                              </div>
                            ) : availableTimeSlots.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <AnimatePresence mode="popLayout">
                                  {availableTimeSlots.map((time, index) => (
                                    <motion.button
                                      key={time}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{
                                        duration: 0.2,
                                        delay: index * 0.05,
                                        ease: "easeOut",
                                      }}
                                      onClick={() =>
                                        setBookingData({ ...bookingData, time })
                                      }
                                      className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                                        bookingData.time === time
                                          ? "border-primary bg-primary text-white"
                                          : "border-gray-300 hover:border-primary text-gray-700 hover:bg-primary/10"
                                      }`}
                                    >
                                      {formatTimeRange(
                                        time,
                                        bookingData.duration
                                      )}
                                    </motion.button>
                                  ))}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                                No available time slots for this date. Please
                                select another date.
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {bookingData.sessionType === "group" && selectedEventType && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-6">
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-neural-dark">
                          {selectedEventType.title}
                        </h4>
                      </div>

                      {selectedEventType.description && (
                        <div
                          className="text-gray-700 [&>strong]:font-bold [&>strong]:text-neural-dark [&>em]:italic"
                          dangerouslySetInnerHTML={{
                            __html: parseDescription(
                              selectedEventType.description
                            ),
                          }}
                        />
                      )}

                      {selectedEventType.seatsPerTimeSlot && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-neural-dark">
                                {t("availableSeats")}:
                              </span>
                              <span className="font-bold text-neural-dark text-lg">
                                {isLoadingBookingCount
                                  ? "..."
                                  : groupBookingCount !== null
                                    ? Math.max(
                                        0,
                                        selectedEventType.seatsPerTimeSlot -
                                          groupBookingCount
                                      )
                                    : selectedEventType.seatsPerTimeSlot}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-neural-dark">
                                {t("maxCapacity")}:
                              </span>
                              <span className="font-bold text-neural-dark text-lg">
                                {selectedEventType.seatsPerTimeSlot}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neural-dark mb-2">
                        {t("firstName")}{" "}
                        <span className="text-red-500 px-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={bookingData.firstName}
                        onChange={(e) => {
                          const value = e.target.value;

                          const capitalized =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          setBookingData({
                            ...bookingData,
                            firstName: capitalized,
                          });
                        }}
                        required
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none text-base"
                        placeholder={t("firstNamePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neural-dark mb-2">
                        {t("lastName")}{" "}
                        <span className="text-red-500 px-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={bookingData.lastName}
                        onChange={(e) => {
                          const value = e.target.value;

                          const capitalized =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          setBookingData({
                            ...bookingData,
                            lastName: capitalized,
                          });
                        }}
                        required
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none text-base"
                        placeholder={t("lastNamePlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neural-dark mb-2">
                      {t("email")} <span className="text-red-500 px-1">*</span>
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => {
                        const email = e.target.value;
                        setBookingData({ ...bookingData, email });

                        if (email && !isValidEmail(email)) {
                          setEmailError("Please enter a valid email address");
                        } else {
                          setEmailError("");
                        }
                      }}
                      onBlur={(e) => {
                        const email = e.target.value;

                        if (email && !isValidEmail(email)) {
                          setEmailError("Please enter a valid email address");
                        }
                      }}
                      required
                      className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                        emailError
                          ? "border-red-500"
                          : "border-gray-300 focus:border-primary"
                      }`}
                      placeholder={t("emailPlaceholder")}
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-500">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neural-dark mb-2">
                      {t("phone")}{" "}
                      <span className="italic text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setBookingData({ ...bookingData, phone: value });
                      }}
                      inputMode="numeric"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder={t("phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neural-dark mb-2">
                      {t("notes")}{" "}
                      <span className="italic text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                      rows={3}
                      placeholder={t("notesPlaceholder")}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-neural-dark mb-4">
                      {t("reviewBooking")}
                    </h3>

                    <div className="space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-gray-700">
                          {t("selectSessionType")}:
                        </span>
                        <span className="text-neural-dark text-right">
                          {t(`sessionType.${bookingData.sessionType}`)}
                        </span>
                      </div>

                      {bookingData.sessionType === "individual" && (
                        <>
                          <div className="flex justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-gray-700">
                              {t("softwareLabel")}:
                            </span>
                            <span className="text-neural-dark text-right">
                              {bookingData.software &&
                                tSoftware(`${bookingData.software}.title`)}
                            </span>
                          </div>

                          <div className="flex justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-gray-700">
                              {t("durationLabel")}:
                            </span>
                            <span className="text-neural-dark text-right">
                              {bookingData.duration &&
                                formatDuration(bookingData.duration)}
                            </span>
                          </div>

                          <div className="flex justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-gray-700">
                              {t("locationLabel")}:
                            </span>
                            <span className="text-neural-dark text-right">
                              {bookingData.location &&
                                formatLocationName(bookingData.location)}
                            </span>
                          </div>

                          {bookingData.locationAddress && (
                            <div className="flex justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-gray-700">
                                Address:
                              </span>
                              <span className="text-neural-dark text-right">
                                {bookingData.locationAddress}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {bookingData.sessionType === "group" &&
                        selectedEventType && (
                          <>
                            <div className="flex justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-gray-700">
                                {t("selectGroupSession")}:
                              </span>
                              <span className="text-neural-dark text-right">
                                {selectedEventType.title}
                              </span>
                            </div>

                            <div className="flex justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-gray-700">
                                {t("durationLabel")}:
                              </span>
                              <span className="text-neural-dark text-right">
                                {bookingData.duration
                                  ? formatDuration(bookingData.duration)
                                  : `${selectedEventType.length}'`}
                              </span>
                            </div>

                            <div className="flex justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-gray-700">
                                {t("locationLabel")}:
                              </span>
                              <span className="text-neural-dark text-right">
                                {bookingData.location
                                  ? formatLocationName(bookingData.location)
                                  : t("location.offline")}
                              </span>
                            </div>

                            {bookingData.locationAddress && (
                              <div className="flex justify-between gap-2 flex-wrap">
                                <span className="font-semibold text-gray-700">
                                  Address:
                                </span>
                                <span className="text-neural-dark text-right">
                                  {bookingData.locationAddress}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                      {bookingData.sessionType === "individual" && (
                        <div className="flex justify-between gap-2 flex-wrap">
                          <span className="font-semibold text-gray-700">
                            {t("dateTime")}:
                          </span>
                          <span className="text-neural-dark text-right">
                            {bookingData.date} at{" "}
                            {bookingData.time
                              ? formatTimeRange(
                                  bookingData.time,
                                  bookingData.duration
                                )
                              : bookingData.time}
                          </span>
                        </div>
                      )}

                      {bookingData.sessionType === "group" &&
                        selectedEventType && (
                          <div className="flex justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-gray-700">
                              {t("schedule")}:
                            </span>
                            <span className="text-neural-dark text-right">
                              {extractDescriptionField(
                                selectedEventType.description,
                                "Running Period"
                              ) || t("groupScheduleInfo")}
                            </span>
                          </div>
                        )}

                      <div className="flex justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-gray-700">
                          {t("name")}:
                        </span>
                        <span className="text-neural-dark text-right">
                          {bookingData.firstName} {bookingData.lastName}
                        </span>
                      </div>

                      <div className="flex justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-gray-700">
                          {t("email")}:
                        </span>
                        <span className="text-neural-dark text-right break-all">
                          {bookingData.email}
                        </span>
                      </div>

                      {bookingData.phone && (
                        <div className="flex justify-between gap-2 flex-wrap">
                          <span className="font-semibold text-gray-700">
                            {t("phone")}:
                          </span>
                          <span className="text-neural-dark text-right">
                            {bookingData.phone}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t-2 border-gray-300 pt-4 mt-4">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-neural-dark">
                          {t("totalCost")}:
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          {bookingData.sessionType === "group" &&
                          selectedEventType
                            ? extractDescriptionField(
                                selectedEventType.description,
                                "Cost"
                              ) || `€${calculateCost()}`
                            : `€${calculateCost()}`}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        {t("paymentOnSite")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-between gap-3 p-4 sm:p-6 bg-gray-50 border-t border-gray-200 shrink-0">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`hidden md:flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold shadow-md border-2 transition-colors duration-200 ${
                  step === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                    : "bg-neural-dark text-primary hover:bg-primary hover:text-white border-neural-dark hover:border-primary"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>{t("back")}</span>
              </button>

              {step < 4 ? (
                <button
                  onClick={() => {
                    if (step === 2 && bookingData.sessionType === "group") {
                      setBookingData({
                        ...bookingData,
                        date: "group-session",
                        time: "scheduled",
                      });
                    }
                    handleNext();
                  }}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2) ||
                    (step === 3 && !canProceedStep3)
                  }
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold shadow-md border-2 transition-colors duration-200 w-full md:w-auto md:min-w-[140px] ${
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2) ||
                    (step === 3 && !canProceedStep3)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                      : "bg-neural-dark text-primary hover:bg-primary hover:text-white border-neural-dark hover:border-primary"
                  }`}
                >
                  <span>
                    {step === 2 && bookingData.sessionType === "group"
                      ? t("bookSeat")
                      : t("continue")}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submissionStatus !== "idle"}
                  className={`px-4 sm:px-8 py-3 rounded-full font-bold shadow-md border-2 transition-colors duration-200 flex items-center justify-center gap-2 w-full md:w-auto ${
                    submissionStatus === "submitting"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                      : submissionStatus === "success"
                        ? "bg-green-500 text-white cursor-not-allowed border-green-500"
                        : submissionStatus === "error"
                          ? "bg-red-500 text-white cursor-not-allowed border-red-500"
                          : "bg-neural-dark text-primary hover:bg-primary hover:text-white border-neural-dark hover:border-primary"
                  }`}
                >
                  {submissionStatus === "submitting" && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  {submissionStatus === "success" && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {submissionStatus === "error" && (
                    <XCircle className="w-5 h-5" />
                  )}
                  {submissionStatus === "submitting" && t("submitting")}
                  {submissionStatus === "success" && "Success!"}
                  {submissionStatus === "error" && "Failed"}
                  {submissionStatus === "idle" && t("confirmBooking")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
