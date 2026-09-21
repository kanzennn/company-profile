"use client";

import { useState } from "react";
import {
  contactFields,
  contactPage,
  inquiryCategories,
} from "../../_lib/content/contact";

/**
 * Posts to `NEXT_PUBLIC_CONTACT_ENDPOINT` when one is configured (any form
 * service accepting a JSON POST). Without it the submit falls back to opening
 * a pre-filled mail draft, so the form works on a fresh checkout and the site
 * stays fully static — no server action, no dynamic route.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full border border-outline bg-surface-tint px-4 py-3 font-mono text-body text-on-surface placeholder:text-on-surface/40 transition-colors focus:border-primary focus:outline-none";
const labelClass =
  "font-mono text-label uppercase tracking-[0.3em] text-on-surface/60";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;

    if (!endpoint) {
      const subject = `${data.category} — ${data.name}`;
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.company ? `Company: ${data.company}` : null,
        "",
        data.message,
      ]
        .filter((line) => line !== null)
        .join("\n");

      window.location.href = `mailto:${contactPage.directEmail}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    /* `method`/`action` are the no-JS path: without them a native submit
       defaults to GET and puts the name, email and message into the URL, where
       history, referrers and access logs keep them. With an endpoint set this
       degraded path actually delivers; without one it at least fails safely. */
    <form
      method="post"
      action={endpoint}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6"
    >
      <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            {contactFields.name.label}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={contactFields.name.placeholder}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            {contactFields.email.label}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={contactFields.email.placeholder}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="company" className={labelClass}>
            {contactFields.company.label}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={contactFields.company.placeholder}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className={labelClass}>
            {contactFields.category.label}
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={inquiryCategories[0]}
            className={fieldClass}
          >
            {inquiryCategories.map((category) => (
              <option key={category} value={category} className="bg-surface">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          {contactFields.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={contactFields.message.placeholder}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="flex items-center gap-6 max-sm:flex-col max-sm:items-stretch">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-fit cursor-pointer bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        <p aria-live="polite" className="font-mono text-body text-on-surface/70">
          {status === "sent" && "Thanks — we'll be in touch within two days."}
          {status === "error" &&
            `Something went wrong. Email us at ${contactPage.directEmail}.`}
        </p>
      </div>
    </form>
  );
}
