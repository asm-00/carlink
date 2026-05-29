"use client";

import { useState } from "react";
import { rateBookingAction } from "@/app/actions/bookings";

type RatingFormProps = {
  bookingId: string;
  defaultNote?: string;
  defaultRating?: number | null;
  redirectTo: string;
  slug: string;
};

const ratingValues = [1, 2, 3, 4, 5];

export function RatingForm({
  bookingId,
  defaultNote = "",
  defaultRating,
  redirectTo,
  slug,
}: RatingFormProps) {
  const [rating, setRating] = useState(defaultRating ?? 5);

  return (
    <form action={rateBookingAction} className="rounded-2xl bg-white p-4 text-black">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="text-sm font-bold">{defaultRating ? "Update trip rating" : "Rate this trip"}</div>
      <div className="mt-3 grid grid-cols-5 gap-2" role="group" aria-label="Trip rating">
        {ratingValues.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-pressed={rating === value}
            className={`min-h-10 rounded-full text-sm font-bold transition ${
              rating === value ? "bg-black text-white" : "bg-[#efefef] text-black hover:bg-[#e2e2e2]"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      <label className="mt-3 block rounded-xl bg-[#efefef] p-3">
        <span className="text-xs font-medium text-[#5e5e5e]">Note</span>
        <textarea
          name="note"
          defaultValue={defaultNote}
          className="mt-1 min-h-16 w-full resize-none bg-transparent text-sm font-medium outline-none"
          maxLength={280}
        />
      </label>
      <button
        type="submit"
        className="mt-3 min-h-11 w-full rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-[#282828]"
      >
        Save rating
      </button>
    </form>
  );
}
