"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronRight, ChevronLeft, Loader2, Package, Calendar, User, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarComponent from "./Calendar";

type SoftwareType = "blender" | "photoshop" | "premierePro" | "afterEffects";
type DurationType = "1h" | "2h";
type LocationType = "online" | "offline";

interface BookingData {
  software: SoftwareType | null;
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
  length: number;
  locations: any[];
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
    software: null,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoadingEventTypes, setIsLoadingEventTypes] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  );
  const [emailError, setEmailError] = useState<string>("");

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
        alert("Failed to load available courses. Please refresh the page and try again.");
      } finally {
        setIsLoadingEventTypes(false);
      }
    };

    fetchEventTypes();
  }, []);

  // Update selected event type when software changes
  useEffect(() => {
    if (bookingData.software && eventTypes.length > 0) {
      const slugMap: Record<SoftwareType, string> = {
        blender: "blender-private",
        photoshop: "photoshop-private",
        premierePro: "premiere-pro-private",
        afterEffects: "after-effects-private",
      };
      const slug = slugMap[bookingData.software];
      const eventType = eventTypes.find((et) => et.slug === slug);
      setSelectedEventType(eventType || null);
    }
  }, [bookingData.software, eventTypes]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (
        !bookingData.date ||
        !bookingData.software ||
        !bookingData.duration
      ) {
        setAvailableTimeSlots([]);
        return;
      }

      if (!selectedEventType) return;

      setIsLoadingSlots(true);
      try {
        const response = await fetch("/api/bookings/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventTypeId: selectedEventType.id,
            date: bookingData.date,
            duration: bookingData.duration,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch availability:", errorData);
          throw new Error(errorData.error || "Failed to fetch availability");
        }

        const data = await response.json();
        console.log("Availability data received:", data);

        // Extract time from ISO datetime strings
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
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [bookingData.date, bookingData.software, bookingData.duration, selectedEventType]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!bookingData.software || !selectedEventType) return;

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

    setIsSubmitting(true);
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
      alert("Booking confirmed! You will receive a confirmation email shortly.");
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setBookingData({
      software: null,
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
    bookingData.software && bookingData.duration && bookingData.location;
  const canProceedStep2 = bookingData.date && bookingData.time;
  const canProceedStep3 =
    bookingData.firstName && bookingData.lastName && bookingData.email && isValidEmail(bookingData.email) && !emailError;

  const calculateCost = () => {
    const baseCost = bookingData.duration === "1h" ? 30 : 50; // Example pricing
    return baseCost;
  };

  // Helper function to format location display name
  const formatLocationName = (locationType: string): string => {
    if (locationType === "inPerson") {
      return "In-Person";
    }

    if (locationType?.startsWith("integrations:")) {
      // Extract integration parts (e.g., "integrations:google:meet" -> ["google", "meet"])
      const parts = locationType.split(":").slice(1);

      // Format each part: capitalize first letter
      const formatted = parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

      return formatted;
    }

    // Default fallback
    return locationType || "Online";
  };

  // Helper function to format duration
  const formatDuration = (duration: string): string => {
    return duration === "1h" ? "60'" : "120'";
  };

  // Helper function to format time slot as range (e.g., "9:00-10:00", "9:00-11:00")
  const formatTimeRange = (startTime: string, duration: DurationType | null): string => {
    if (!duration) return startTime;

    const [hours, minutes] = startTime.split(":").map(Number);
    const durationMinutes = duration === "1h" ? 60 : 120;

    // Calculate end time
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Format times as HH:MM
    const formatTime = (date: Date) => {
      const h = date.getHours();
      const m = date.getMinutes();
      return `${h}:${m.toString().padStart(2, '0')}`;
    };

    return `${formatTime(startDate)}-${formatTime(endDate)}`;
  };

  // Helper function to get step details with individual selections
  const getStepInfo = (stepNumber: number) => {
    const steps = [
      {
        number: 1,
        icon: Package,
        title: t("steps.serviceSelection"),
        selections: [
          bookingData.software ? tSoftware(`${bookingData.software}.title`) : null,
          bookingData.duration ? formatDuration(bookingData.duration) : null,
          bookingData.location ? formatLocationName(bookingData.location) : null,
        ].filter(Boolean),
      },
      {
        number: 2,
        icon: Calendar,
        title: t("steps.dateTime"),
        selections: [
          bookingData.date ? bookingData.date : null,
          bookingData.time ? formatTimeRange(bookingData.time, bookingData.duration) : null,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Sidebar - Step Indicator */}
        <div className="w-80 bg-neural-dark flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-3xl font-bold text-white">
              {t("title")}
            </h2>
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
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
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
                        {stepInfo.selections.map((selection, index) => (
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
                              }
                            }}
                            exit={{
                              opacity: 0,
                              x: -32,
                              scale: 0.8,
                              transition: {
                                duration: 0.2,
                                ease: "easeIn",
                              }
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
        <div className="flex-1 flex flex-col bg-white">
          {/* Header with close button */}
          <div className="relative p-6 border-b border-gray-200">
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-neural-dark">
                {getStepInfo(step).title}
              </h3>
              <div className="w-20 h-1 bg-primary mx-auto mt-4"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neural-dark mb-2">
                  {t("selectSoftware")}
                </label>
                <select
                  value={bookingData.software || ""}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      software: e.target.value as SoftwareType,
                    })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white"
                >
                  <option value="" disabled>
                    {t("selectSoftwarePlaceholder")}
                  </option>
                  {softwareOptions.map((software) => (
                    <option key={software} value={software}>
                      {tSoftware(`${software}.title`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neural-dark mb-2">
                  {t("selectDuration")}
                </label>
                <select
                  value={bookingData.duration || ""}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      duration: e.target.value as DurationType,
                    })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white"
                >
                  <option value="" disabled>
                    {t("selectDurationPlaceholder")}
                  </option>
                  <option value="1h">60'</option>
                  <option value="2h">120'</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neural-dark mb-2">
                  {t("selectLocation")}
                </label>
                <select
                  value={bookingData.location || ""}
                  onChange={(e) => {
                    const selectedIndex = e.target.selectedIndex - 1; // -1 for placeholder option
                    const selectedLocation = selectedEventType?.locations[selectedIndex];

                    setBookingData({
                      ...bookingData,
                      location: e.target.value as LocationType,
                      locationAddress: selectedLocation?.address || null,
                    });
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-neural-dark bg-white"
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
                    selectedEventType.locations.map((location: any, index: number) => {
                      let displayLabel = "Online";
                      let locationValue = location.type || `location-${index}`;

                      if (location.type) {
                        displayLabel = formatLocationName(location.type);
                        locationValue = location.type;
                      } else if (location.link) {
                        // Handle custom links
                        displayLabel = "Custom Link";
                        locationValue = location.link;
                      }

                      return (
                        <option key={index} value={locationValue}>
                          {displayLabel}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Calendar */}
              <div>
                <CalendarComponent
                  selectedDate={bookingData.date}
                  onDateSelect={(date) => setBookingData({ ...bookingData, date })}
                  minDate={new Date()}
                />
              </div>

              {/* Time Slots - Slide in from below calendar */}
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
                        <span className="ml-3 text-gray-600">Loading available times...</span>
                      </div>
                    ) : availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
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
                                ease: "easeOut"
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
                              {formatTimeRange(time, bookingData.duration)}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                        No available time slots for this date. Please select another date.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neural-dark mb-2">
                    {t("firstName")} <span className="text-red-500 px-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookingData.firstName}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Auto-capitalize first letter
                      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                      setBookingData({
                        ...bookingData,
                        firstName: capitalized,
                      });
                    }}
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder={t("firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neural-dark mb-2">
                    {t("lastName")} <span className="text-red-500 px-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookingData.lastName}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Auto-capitalize first letter
                      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                      setBookingData({
                        ...bookingData,
                        lastName: capitalized,
                      });
                    }}
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
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

                    // Validate email format
                    if (email && !isValidEmail(email)) {
                      setEmailError("Please enter a valid email address");
                    } else {
                      setEmailError("");
                    }
                  }}
                  onBlur={(e) => {
                    const email = e.target.value;
                    // Show error on blur if email is filled but invalid
                    if (email && !isValidEmail(email)) {
                      setEmailError("Please enter a valid email address");
                    }
                  }}
                  required
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                    emailError ? "border-red-500" : "border-gray-300 focus:border-primary"
                  }`}
                  placeholder={t("emailPlaceholder")}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neural-dark mb-2">
                  {t("phone")} <span className="italic text-gray-500">(Optional)</span>
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
                  {t("notes")} <span className="italic text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  rows={3}
                  placeholder={t("notesPlaceholder")}
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-neural-dark mb-4">
                  {t("reviewBooking")}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {t("softwareLabel")}:
                    </span>
                    <span className="text-neural-dark">
                      {bookingData.software &&
                        tSoftware(`${bookingData.software}.title`)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {t("durationLabel")}:
                    </span>
                    <span className="text-neural-dark">
                      {bookingData.duration && formatDuration(bookingData.duration)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {t("locationLabel")}:
                    </span>
                    <span className="text-neural-dark">
                      {bookingData.location && formatLocationName(bookingData.location)}
                    </span>
                  </div>

                  {bookingData.locationAddress && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        Address:
                      </span>
                      <span className="text-neural-dark">
                        {bookingData.locationAddress}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {t("dateTime")}:
                    </span>
                    <span className="text-neural-dark">
                      {bookingData.date} at {bookingData.time ? formatTimeRange(bookingData.time, bookingData.duration) : bookingData.time}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {t("name")}:
                    </span>
                    <span className="text-neural-dark">
                      {bookingData.firstName} {bookingData.lastName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {t("email")}:
                    </span>
                    <span className="text-neural-dark">{bookingData.email}</span>
                  </div>

                  {bookingData.phone && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        {t("phone")}:
                      </span>
                      <span className="text-neural-dark">
                        {bookingData.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-neural-dark">
                      {t("totalCost")}:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      €{calculateCost()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("paymentOnSite")}
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md border-2 transition-colors duration-200 ${
              step === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                : "bg-neural-dark text-primary hover:bg-primary hover:text-white border-neural-dark hover:border-primary"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            {t("back")}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md border-2 transition-colors duration-200 ${
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-neural-dark text-primary hover:bg-primary hover:text-white border-neural-dark hover:border-primary"
              }`}
            >
              {t("continue")}
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-full font-bold shadow-md border-2 transition-colors duration-200 flex items-center gap-2 ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-neural-dark text-primary hover:bg-primary hover:text-white border-neural-dark hover:border-primary"
              }`}
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? t("submitting") : t("confirmBooking")}
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
