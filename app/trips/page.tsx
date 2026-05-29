import Link from "next/link";
import { cancelBookingAction, payBookingAction } from "@/app/actions/bookings";
import { Footer, MobileAppHeader, MobileTabBar, TopNav } from "@/app/components/navigation";
import { RatingForm } from "@/app/components/rating-form";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { requireSignedIn } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type TripsPageProps = {
  searchParams: Promise<{ cancelled?: string; created?: string; error?: string; paid?: string }>;
};

export const metadata = {
  title: "Trips",
  description: "Manage your Carlink booking requests and trips.",
};

const tripDateFormatter = new Intl.DateTimeFormat("en-NA", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatTripDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return tripDateFormatter.format(date);
}

function formatStatus(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusDetail(status: string) {
  if (status === "requested") {
    return "Waiting for owner approval.";
  }
  if (status === "approved") {
    return "Approved by the owner. Payment confirms the trip.";
  }
  if (status === "paid") {
    return "Paid and ready for the owner to start at pickup.";
  }
  if (status === "active") {
    return "Trip is active.";
  }
  if (status === "completed") {
    return "Returned and closed.";
  }
  if (status === "cancelled") {
    return "This booking is closed.";
  }
  if (status === "disputed") {
    return "This booking is under review.";
  }
  return "Booking status is up to date.";
}

function statusClassName(status: string) {
  if (status === "requested") {
    return "bg-[#fff4cc] text-[#6f5300]";
  }
  if (status === "approved" || status === "paid") {
    return "bg-black text-white";
  }
  if (status === "active") {
    return "bg-[#dff7e8] text-[#126b35]";
  }
  if (status === "completed") {
    return "bg-[#e9f0ff] text-[#244c9f]";
  }
  if (status === "cancelled" || status === "disputed") {
    return "bg-[#efefef] text-[#5e5e5e]";
  }
  return "bg-[#efefef] text-black";
}

function noticeForSearchParams({
  cancelled,
  created,
  error,
  paid,
}: {
  cancelled?: string;
  created?: string;
  error?: string;
  paid?: string;
}) {
  if (created) {
    return {
      title: "Booking request sent",
      body: "The owner can approve it before payment is collected.",
      className: "bg-black text-white",
      bodyClassName: "text-[#afafaf]",
    };
  }
  if (paid) {
    return {
      title: "Payment recorded",
      body: "Your booking is paid and ready for the owner to start at pickup.",
      className: "bg-black text-white",
      bodyClassName: "text-[#afafaf]",
    };
  }
  if (cancelled) {
    return {
      title: "Booking cancelled",
      body: "The request was closed and the owner dashboard has been updated.",
      className: "bg-[#efefef] text-black",
      bodyClassName: "text-[#5e5e5e]",
    };
  }
  if (error) {
    return {
      title: "Booking could not be updated",
      body: "Check the current status and try again.",
      className: "bg-[#efefef] text-black",
      bodyClassName: "text-[#5e5e5e]",
    };
  }
  return null;
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const { cancelled, created, error, paid } = await searchParams;
  const { sessionToken } = await requireSignedIn("/trips");
  const bookings = await getConvexClient().query(api.bookings.myBookings, { sessionToken });
  const notice = noticeForSearchParams({ cancelled, created, error, paid });
  const needsActionCount = bookings.filter((booking) => booking.status === "requested" || booking.status === "approved").length;
  const inProgressCount = bookings.filter((booking) => booking.status === "paid" || booking.status === "active").length;
  const completedCount = bookings.filter((booking) => booking.status === "completed").length;

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav showSignOut={false} />
      <MobileAppHeader title="Trips" subtitle="Bookings and payments" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 md:py-12 md:pb-12 lg:px-8">
        <div className="hidden flex-col gap-5 md:flex">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Your trips</h1>
            <p className="mt-3 max-w-xl text-base leading-6 text-[#5e5e5e]">
              Booking requests, approvals, payments, and active trips live here.
            </p>
          </div>
        </div>

        {notice ? (
          <div className={`mt-6 rounded-2xl p-5 ${notice.className}`}>
            <div className="text-lg font-bold">{notice.title}</div>
            <p className={`mt-1 text-sm ${notice.bodyClassName}`}>{notice.body}</p>
          </div>
        ) : null}

        <section className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-8">
          {[
            { label: "Needs action", value: needsActionCount, detail: "Requests or payments" },
            { label: "Ready / active", value: inProgressCount, detail: "Paid or underway" },
            { label: "Completed", value: completedCount, detail: "Closed trips" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-[#efefef] p-5">
              <div className="text-sm font-medium text-[#5e5e5e]">{item.label}</div>
              <div className="mt-2 text-3xl font-bold">{item.value}</div>
              <div className="mt-1 text-sm text-[#5e5e5e]">{item.detail}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 md:mt-8">
          <div className="rounded-[1.5rem] bg-white ring-1 ring-black/10 md:rounded-2xl">
            <div className="flex flex-col gap-3 border-b border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold">Booking activity</h2>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-[#282828]"
              >
                Book another car
              </Link>
            </div>
            {bookings.length > 0 ? (
              <div className="divide-y divide-black/10">
                {bookings.map((booking) => {
                  const vehicleTitle = booking.vehicle
                    ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                    : "Vehicle";
                  const vehicleHref = booking.vehicle
                    ? `/cars/${booking.vehicle.slug}?startDate=${booking.startDate}&endDate=${booking.endDate}`
                    : null;
                  const canCancel = booking.status === "requested" || booking.status === "approved";

                  return (
                    <article key={booking._id} className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{vehicleTitle}</h3>
                          <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusClassName(booking.status)}`}>
                            {formatStatus(booking.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#5e5e5e]">
                          {formatTripDate(booking.startDate)} to {formatTripDate(booking.endDate)} - {booking.totalDays} days
                        </p>
                        {booking.vehicle ? (
                          <p className="mt-1 text-sm text-[#5e5e5e]">
                            {booking.vehicle.location} pickup - {booking.vehicle.ownerName}
                          </p>
                        ) : null}
                        <p className="mt-2 text-sm font-medium text-black">{statusDetail(booking.status)}</p>
                      </div>
                      <div className="flex flex-col gap-3 md:items-end">
                        <div className="md:text-right">
                          <div className="text-xs font-medium text-[#5e5e5e]">Trip total</div>
                          <div className="text-xl font-bold">N${booking.pricingBreakdown.totalAmount}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                          {booking.status === "approved" ? (
                            <form action={payBookingAction}>
                              <input type="hidden" name="bookingId" value={booking._id} />
                              <button type="submit" className="min-h-10 rounded-full bg-black px-4 text-xs font-medium text-white transition hover:bg-[#282828]">
                                Pay now
                              </button>
                            </form>
                          ) : null}
                          {canCancel ? (
                            <form action={cancelBookingAction}>
                              <input type="hidden" name="bookingId" value={booking._id} />
                              <button type="submit" className="min-h-10 rounded-full bg-[#efefef] px-4 text-xs font-medium text-black transition hover:bg-[#e2e2e2]">
                                Cancel
                              </button>
                            </form>
                          ) : null}
                          {vehicleHref ? (
                            <Link
                              href={vehicleHref}
                              className="inline-flex min-h-10 items-center rounded-full bg-[#efefef] px-4 text-xs font-medium text-black transition hover:bg-[#e2e2e2]"
                            >
                              View car
                            </Link>
                          ) : null}
                        </div>
                        {booking.status === "completed" && booking.vehicle ? (
                          <div className="w-full md:w-72">
                            <RatingForm
                              bookingId={booking._id}
                              defaultNote={booking.rating?.note ?? ""}
                              defaultRating={booking.rating?.rating ?? null}
                              redirectTo="/trips"
                              slug={booking.vehicle.slug}
                            />
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold">No trips yet</h3>
                <p className="mt-2 text-sm text-[#5e5e5e]">Explore cars and request your first booking.</p>
                <Link
                  href="/"
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-black px-5 text-base font-medium text-white"
                >
                  Explore cars
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="trips" />
    </div>
  );
}
