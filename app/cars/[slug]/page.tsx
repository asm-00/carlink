import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, MobileAppHeader, MobileTabBar, TopNav } from "@/app/components/navigation";
import { RatingForm } from "@/app/components/rating-form";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getCurrentUser, getSessionToken } from "@/app/lib/session";
import { getDefaultTripDates } from "@/app/lib/trip-defaults";
import { BookingRequestPanel } from "./booking-request-panel";

export const dynamic = "force-dynamic";

type CarPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    bookingError?: string;
    endDate?: string;
    rated?: string;
    ratingError?: string;
    startDate?: string;
  }>;
};

export async function generateMetadata({ params }: CarPageProps) {
  const { slug } = await params;
  const vehicle = await getConvexClient().query(api.vehicles.getBySlug, { slug });

  if (!vehicle) {
    return {
      title: "Car not found | Carlink",
    };
  }

  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Carlink`,
    description: `Request a booking for the ${vehicle.make} ${vehicle.model} from ${vehicle.location}.`,
  };
}

export default async function CarDetailPage({ params, searchParams }: CarPageProps) {
  const { slug } = await params;
  const { startDate, endDate, bookingError, rated, ratingError } = await searchParams;
  const sessionToken = await getSessionToken();
  const convex = getConvexClient();
  const [vehicle, user, settings] = await Promise.all([
    convex.query(api.vehicles.getBySlug, { slug, sessionToken }),
    getCurrentUser(),
    convex.query(api.settings.preferences, { sessionToken }),
  ]);

  if (!vehicle) {
    notFound();
  }

  const defaultDates = getDefaultTripDates(settings.defaultTripDays);
  const selectedStartDate = startDate ?? defaultDates.startDate;
  const selectedEndDate = endDate ?? defaultDates.endDate;
  const ratingCountLabel =
    vehicle.ratingSummary.count > 0
      ? `${vehicle.ratingSummary.count} ${vehicle.ratingSummary.count === 1 ? "rating" : "ratings"}`
      : `${vehicle.trips} trips`;
  const currentDetailPath = `/cars/${vehicle.slug}?startDate=${encodeURIComponent(
    selectedStartDate,
  )}&endDate=${encodeURIComponent(selectedEndDate)}`;

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />
      <MobileAppHeader title="Car details" subtitle={`${vehicle.location} - N$${vehicle.dailyRate}/day`} backHref="/" />
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 md:py-6 lg:px-8">
          <Link href="/" className="hidden rounded-full bg-[#efefef] px-4 py-2 text-sm font-medium md:inline-flex">
            Back to explore
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#efefef] md:rounded-2xl">
                <Image
                  src={vehicle.image}
                  alt={vehicle.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5e5e5e]">
                    {vehicle.location} - {vehicle.category}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                </div>
                <div className="rounded-2xl bg-[#efefef] p-4">
                  <div className="text-sm text-[#5e5e5e]">Trip rating</div>
                  <div className="mt-1 text-2xl font-bold">{vehicle.ratingSummary.label}</div>
                  <div className="text-sm text-[#5e5e5e]">{ratingCountLabel}</div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <BookingRequestPanel
                bookingError={bookingError}
                dailyRate={vehicle.dailyRate}
                initialEndDate={selectedEndDate}
                initialStartDate={selectedStartDate}
                isSignedIn={Boolean(user)}
                slug={vehicle.slug}
                transmission={vehicle.transmission}
                vehicleId={vehicle._id}
              />
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:gap-5 md:pb-12 lg:px-8">
          <div className="rounded-2xl bg-[#efefef] p-6">
            <h2 className="text-2xl font-bold">Trip details</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {vehicle.highlights.map((highlight) => (
                <div key={highlight} className="rounded-2xl bg-white p-4 text-sm font-medium">
                  {highlight}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-bold">Included</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#5e5e5e]">
                  {vehicle.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Owner rules</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#5e5e5e]">
                  {vehicle.rules.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-black p-6 text-white">
              <p className="text-sm font-medium text-[#afafaf]">Owner</p>
              <h2 className="mt-2 text-2xl font-bold">{vehicle.owner.fullName}</h2>
              <p className="mt-2 text-sm text-[#afafaf]">
                {vehicle.owner.isVerified ? "Verified listing owner" : "Listing owner"}
              </p>
              <div className="mt-6 divide-y divide-white/15 text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <span>Pickup</span>
                  <span className="text-right">{vehicle.pickup}</span>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <span>Seats</span>
                  <span>{vehicle.seats}</span>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <span>Use case</span>
                  <span className="text-right">{vehicle.range}</span>
                </div>
                {vehicle.owner.email ? (
                  <div className="flex justify-between gap-4 py-3">
                    <span>Email</span>
                    <span className="text-right">{vehicle.owner.email}</span>
                  </div>
                ) : null}
                {vehicle.owner.phone ? (
                  <div className="flex justify-between gap-4 py-3">
                    <span>Phone</span>
                    <span>{vehicle.owner.phone}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {rated ? (
              <div className="rounded-2xl bg-[#efefef] p-4 text-sm font-medium">Rating saved.</div>
            ) : null}
            {ratingError ? (
              <div className="rounded-2xl bg-[#efefef] p-4 text-sm font-medium">Could not save that rating.</div>
            ) : null}
            {vehicle.viewerRating ? (
              <RatingForm
                bookingId={vehicle.viewerRating.bookingId}
                defaultNote={vehicle.viewerRating.note}
                defaultRating={vehicle.viewerRating.rating}
                redirectTo={currentDetailPath}
                slug={vehicle.slug}
              />
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="explore" />
    </div>
  );
}
