import Image from "next/image";
import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

export function VehicleCard({
  vehicle,
  bookingQuery = "",
}: {
  vehicle: Doc<"vehicles">;
  bookingQuery?: string;
}) {
  return (
    <article className="max-w-full overflow-hidden border-b border-black/10 bg-white last:border-b-0 md:rounded-2xl md:border-b-0 md:ring-1 md:ring-black/10">
      <Link href={`/cars/${vehicle.slug}${bookingQuery}`} className="flex min-h-28 w-full min-w-0 gap-3 py-3 md:block md:min-h-0 md:py-0">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-[#efefef] md:aspect-[4/3] md:h-auto md:w-auto md:rounded-none">
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt}
            fill
            sizes="(max-width: 768px) 112px, 33vw"
            className="object-cover transition duration-300 hover:scale-[1.03]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 md:block md:space-y-4 md:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="overflow-hidden text-base font-bold leading-5 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-lg md:leading-6">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="mt-1 truncate text-sm leading-5 text-[#5e5e5e]">
                {vehicle.category} - {vehicle.location}
              </p>
            </div>
            <div className="hidden shrink-0 rounded-full bg-[#f2f2f2] px-2.5 py-1 text-xs font-semibold md:block md:px-3 md:text-sm">
              {vehicle.rating}
            </div>
          </div>
          <p className="truncate text-xs font-medium text-[#5e5e5e] md:hidden">
            {vehicle.transmission} / {vehicle.seats} seats / {vehicle.gravelReady ? "Gravel ready" : "City ready"}
          </p>
          <div className="hidden flex-wrap gap-2 md:flex">
            {[vehicle.transmission, `${vehicle.seats} seats`, vehicle.gravelReady ? "Gravel ready" : "City ready"].map(
              (tag) => (
                <span key={tag} className="rounded-full bg-[#f2f2f2] px-3 py-2 text-xs font-medium">
                  {tag}
                </span>
              ),
            )}
          </div>
          <div className="flex items-end justify-between gap-3 md:border-t md:border-black/10 md:pt-4">
            <div className="min-w-0">
              <p className="truncate text-xs text-[#5e5e5e]">{vehicle.pickup}</p>
              <p className="mt-1 text-base font-bold md:text-lg">N${vehicle.dailyRate}/day</p>
            </div>
            <span className="hidden rounded-full bg-black px-4 py-2 text-sm font-medium text-white md:inline-flex">
              View
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
