"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CustomBookingForm from "./CustomBookingForm";

export default function BookingInterface() {
  const t = useTranslations("bookings");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBookingForm = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto text-center">
        <button
          onClick={openBookingForm}
          className="inline-block bg-neural-dark text-primary font-bold px-8 py-3 rounded-full text-lg shadow-md hover:bg-primary hover:text-white border-2 border-neural-dark hover:border-primary transition-colors duration-200"
        >
          {t("bookPrivateSession")}
        </button>
      </div>

      <CustomBookingForm isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
