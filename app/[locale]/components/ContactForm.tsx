"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | "loading";
  } | null>(null);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({
        ...formData,
        [name]: value.replace(/[^0-9]/g, ""),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setStatus({
      message: t("sending"),
      type: "loading",
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({
          message: t("success"),
          type: "success",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus({
          message: t("error"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus({
        message: t("error"),
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-foreground">
            {t("firstName")} <span className="text-red-500 px-1">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            placeholder={t("firstNamePlaceholder")}
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-foreground placeholder:text-gray-400 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground">
            {t("lastName")} <span className="text-red-500 px-1">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            placeholder={t("lastNamePlaceholder")}
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-foreground placeholder:text-gray-400 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-foreground">
            {t("email")} <span className="text-red-500 px-1">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-foreground placeholder:text-gray-400 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-foreground">
            {t("phone")}{" "}
            <span className="italic text-gray-500">({t("optional")})</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder={t("phonePlaceholder")}
            value={formData.phone}
            onChange={handleChange}
            inputMode="numeric"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-foreground placeholder:text-gray-400 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-foreground">
            {t("message")} <span className="text-red-500 px-1">*</span>
          </label>
          <textarea
            name="message"
            placeholder={t("messagePlaceholder")}
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-foreground placeholder:text-gray-400 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="inline-block bg-neural-dark text-primary font-bold px-8 py-3 rounded-lg text-lg shadow-md hover:bg-primary hover:text-white border-2 border-neural-dark hover:border-primary transition-colors duration-200"
          disabled={sending}
        >
          {t("submit")}
        </button>
      </div>
      {status && (
        <div className="flex pt-8 items-center gap-3 mt-4 text-foreground text-base font-bold">
          <span>{status.message}</span>
          {status.type === "loading" && (
            <Loader2 className="animate-spin text-primary h-6 w-6" />
          )}
          {status.type === "success" && (
            <CheckCircle2 className="text-green-500 h-6 w-6" />
          )}
          {status.type === "error" && (
            <XCircle className="text-red-500 h-6 w-6" />
          )}
        </div>
      )}
    </form>
  );
}
