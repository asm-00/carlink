"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { requestBookingAction } from "@/app/actions/bookings";

type BookingRequestPanelProps = {
  bookingError?: string;
  dailyRate: number;
  initialEndDate: string;
  initialStartDate: string;
  isSignedIn: boolean;
  slug: string;
  transmission: string;
  vehicleId: string;
};

function dateToUtc(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return Number.NaN;
  }

  return Date.UTC(year, month - 1, day);
}

function calculateDays(startDate: string, endDate: string) {
  const start = dateToUtc(startDate);
  const end = dateToUtc(endDate);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }

  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

function formatMoney(value: number) {
  return `N$${Math.round(value).toLocaleString("en-NA")}`;
}

function bookingErrorMessage(value?: string) {
  if (value === "dates") {
    return "Choose a valid start and return date.";
  }

  if (value === "unavailable") {
    return "This car is not available for those dates.";
  }

  return null;
}

export function BookingRequestPanel({
  bookingError,
  dailyRate,
  initialEndDate,
  initialStartDate,
  isSignedIn,
  slug,
  transmission,
  vehicleId,
}: BookingRequestPanelProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const days = useMemo(() => calculateDays(startDate, endDate), [endDate, startDate]);
  const subtotal = days ? dailyRate * days : 0;
  const platformFee = days ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal + platformFee;
  const nextParams = new URLSearchParams();
  const errorMessage = bookingErrorMessage(bookingError);

  if (startDate) {
    nextParams.set("startDate", startDate);
  }
  if (endDate) {
    nextParams.set("endDate", endDate);
  }

  const nextPath = `/cars/${slug}${nextParams.size ? `?${nextParams.toString()}` : ""}`;

  return (
    <div className="rounded-[1.5rem] bg-white p-4 ring-1 ring-black/10 md:rounded-2xl md:p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-[#5e5e5e]">Daily rate</div>
          <div className="text-3xl font-bold">{formatMoney(dailyRate)}</div>
        </div>
        <div className="rounded-full bg-[#efefef] px-3 py-2 text-sm font-medium">{transmission}</div>
      </div>
      <form action={requestBookingAction} className="mt-5">
        {errorMessage ? (
          <div className="mb-4 rounded-2xl bg-[#efefef] p-4 text-sm font-medium">{errorMessage}</div>
        ) : null}
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <input type="hidden" name="slug" value={slug} />
        <div className="grid grid-cols-2 gap-3">
          <label className="rounded-lg bg-[#efefef] p-4">
            <span className="text-xs font-medium text-[#5e5e5e]">Start</span>
            <input
              name="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
              aria-label="Start date"
            />
          </label>
          <label className="rounded-lg bg-[#efefef] p-4">
            <span className="text-xs font-medium text-[#5e5e5e]">Return</span>
            <input
              name="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
              className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
              aria-label="Return date"
            />
          </label>
        </div>
        <div className="mt-5 divide-y divide-black/10 text-sm">
          <div className="flex justify-between gap-4 py-3">
            <span>
              {formatMoney(dailyRate)} x {days ?? 0} {days === 1 ? "day" : "days"}
            </span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <span>Platform fee</span>
            <span>{formatMoney(platformFee)}</span>
          </div>
          <div className="flex justify-between gap-4 py-3 text-base font-bold">
            <span>Estimated total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
        {!days ? (
          <button
            type="button"
            disabled
            className="mt-5 min-h-12 w-full rounded-full bg-[#d8d8d8] px-5 text-base font-medium text-[#5e5e5e]"
          >
            Choose valid dates
          </button>
        ) : isSignedIn ? (
          <button
            type="submit"
            className="mt-5 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
          >
            Request booking
          </button>
        ) : (
          <Link
            href={`/sign-in?next=${encodeURIComponent(nextPath)}`}
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
          >
            Sign in to request booking
          </Link>
        )}
      </form>
    </div>
  );
}
