import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requestBookingAction } from "@/app/actions/bookings";
import { Footer, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getCurrentUser } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type CarPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ startDate?: string; endDate?: string; bookingError?: string }>;
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
  const { startDate, endDate, bookingError } = await searchParams;
  const selectedStartDate = startDate ?? "2026-06-02";
  const selectedEndDate = endDate ?? "2026-06-06";
  const [vehicle, user] = await Promise.all([
    getConvexClient().query(api.vehicles.getBySlug, { slug }),
    getCurrentUser(),
  ]);

  if (!vehicle) {
    notFound();
  }

  const startTime = Date.parse(selectedStartDate);
  const endTime = Date.parse(selectedEndDate);
  const days =
    Number.isFinite(startTime) && Number.isFinite(endTime) && endTime > startTime
      ? Math.max(1, Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)))
      : 1;
  const subtotal = vehicle.dailyRate * days;
  const platformFee = Math.round(subtotal * 0.12);
  const total = subtotal + platformFee;
  const signInNextParams = new URLSearchParams();

  if (selectedStartDate) {
    signInNextParams.set("startDate", selectedStartDate);
  }
  if (selectedEndDate) {
    signInNextParams.set("endDate", selectedEndDate);
  }

  const signInNextPath = `/cars/${vehicle.slug}${signInNextParams.size ? `?${signInNextParams.toString()}` : ""}`;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black md:bg-white">
      <TopNav />
      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:px-8">
          <Link href="/" className="inline-flex rounded-full bg-[#efefef] px-4 py-2 text-sm font-medium">
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
                  <div className="text-sm text-[#5e5e5e]">Owner rating</div>
                  <div className="mt-1 text-2xl font-bold">{vehicle.rating}</div>
                  <div className="text-sm text-[#5e5e5e]">{vehicle.trips} trips</div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.75rem] bg-white p-4 shadow-[0_16px_45px_rgba(0,0,0,0.08)] ring-1 ring-black/5 md:rounded-2xl md:p-5 md:shadow-[0_4px_16px_rgba(0,0,0,0.16)] md:ring-0">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm text-[#5e5e5e]">Daily rate</div>
                    <div className="text-3xl font-bold">N${vehicle.dailyRate}</div>
                  </div>
                  <div className="rounded-full bg-[#efefef] px-3 py-2 text-sm font-medium">{vehicle.transmission}</div>
                </div>
                <form action={requestBookingAction} className="mt-5">
                  {bookingError ? (
                    <div className="mb-4 rounded-2xl bg-[#efefef] p-4 text-sm font-medium">
                      Choose a valid start and return date.
                    </div>
                  ) : null}
                  <input type="hidden" name="vehicleId" value={vehicle._id} />
                  <input type="hidden" name="slug" value={vehicle.slug} />
                  <div className="grid grid-cols-2 gap-3">
                    <label className="rounded-lg bg-[#efefef] p-4">
                      <span className="text-xs font-medium text-[#5e5e5e]">Start</span>
                      <input
                        name="startDate"
                        type="date"
                        defaultValue={selectedStartDate}
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
                        defaultValue={selectedEndDate}
                        required
                        className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                        aria-label="Return date"
                      />
                    </label>
                  </div>
                  <div className="mt-5 divide-y divide-black/10 text-sm">
                    <div className="flex justify-between py-3">
                      <span>N${vehicle.dailyRate} x {days} days</span>
                      <span>N${subtotal}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span>Platform fee</span>
                      <span>N${platformFee}</span>
                    </div>
                    <div className="flex justify-between py-3 text-base font-bold">
                      <span>Estimated total</span>
                      <span>N${total}</span>
                    </div>
                  </div>
                  {user ? (
                    <button type="submit" className="mt-5 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]">
                      Request booking
                    </button>
                  ) : (
                    <Link
                      href={`/sign-in?next=${encodeURIComponent(signInNextPath)}`}
                      className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
                    >
                      Sign in to request booking
                    </Link>
                  )}
                </form>
              </div>
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

          <div className="rounded-2xl bg-black p-6 text-white">
            <p className="text-sm font-medium text-[#afafaf]">Owner</p>
            <h2 className="mt-2 text-2xl font-bold">{vehicle.ownerName}</h2>
            <p className="mt-2 text-sm text-[#afafaf]">Verified listing owner</p>
            <div className="mt-6 divide-y divide-white/15 text-sm">
              <div className="flex justify-between py-3">
                <span>Pickup</span>
                <span>{vehicle.pickup}</span>
              </div>
              <div className="flex justify-between py-3">
                <span>Seats</span>
                <span>{vehicle.seats}</span>
              </div>
              <div className="flex justify-between py-3">
                <span>Use case</span>
                <span>{vehicle.range}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="explore" />
    </div>
  );
}
