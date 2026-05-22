import Link from "next/link";
import { submitOwnerApplicationAction } from "@/app/actions/owner";
import { Footer, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getCurrentUser, getSessionToken } from "@/app/lib/session";

export const dynamic = "force-dynamic";

const applicationSteps = [
  { label: "Application", detail: "Tell us about your vehicle" },
  { label: "Admin review", detail: "Approval before listing tools unlock" },
  { label: "Listing tools", detail: "Manage listings and requests" },
];

type OwnerPageProps = {
  searchParams: Promise<{ submitted?: string }>;
};

export const metadata = {
  title: "List your car",
  description: "Apply to become an approved vehicle owner on Carlink.",
};

export default async function OwnerPage({ searchParams }: OwnerPageProps) {
  const { submitted } = await searchParams;
  const [sessionToken, user] = await Promise.all([getSessionToken(), getCurrentUser()]);
  const application =
    sessionToken && user
      ? await getConvexClient().query(api.ownerApplications.mine, { sessionToken })
      : null;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black md:bg-white">
      <TopNav />
      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-8 md:py-14 lg:px-8">
          <div className="space-y-4 md:space-y-6">
            <p className="text-sm font-medium text-[#5e5e5e]">Owner application</p>
            <h1 className="text-4xl font-bold leading-[1.06] sm:text-6xl">Apply to list a vehicle.</h1>
            <p className="max-w-lg text-base leading-6 text-[#5e5e5e] md:text-lg md:leading-7">
              Tell us about your vehicle and we will review the listing setup.
            </p>
            {user && (user.role === "owner" || user.role === "admin") ? (
              <Link
                href="/owner/dashboard"
                className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
              >
                Open owner dashboard
              </Link>
            ) : (
              !user ? (
                <Link
                  href="/sign-in?next=/owner"
                  className="inline-flex min-h-12 items-center rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
                >
                  Sign in to apply
                </Link>
              ) : null
            )}
          </div>

          <div className="rounded-[1.75rem] bg-[#efefef] p-4 sm:p-6 md:rounded-2xl">
            {submitted ? (
              <div className="mb-4 rounded-2xl bg-black p-4 text-white">
                <div className="font-bold">Application submitted</div>
                <p className="mt-1 text-sm text-[#afafaf]">We will review it before listings go live.</p>
              </div>
            ) : null}

            {user && user.role !== "owner" && user.role !== "admin" ? (
              <form action={submitOwnerApplicationAction} className="rounded-2xl bg-white p-5">
                <h2 className="text-2xl font-bold">
                  {application ? "Update application" : "Owner application"}
                </h2>
                <div className="mt-5 grid gap-3">
                  <label className="block rounded-lg bg-[#efefef] p-4">
                    <span className="text-xs font-medium text-[#5e5e5e]">Phone</span>
                    <input
                      name="phone"
                      required
                      defaultValue={application?.phone ?? ""}
                      className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                      placeholder="+264 81 000 0000"
                    />
                  </label>
                  <label className="block rounded-lg bg-[#efefef] p-4">
                    <span className="text-xs font-medium text-[#5e5e5e]">Vehicle location</span>
                    <input
                      name="location"
                      required
                      defaultValue={application?.location ?? ""}
                      className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                      placeholder="Windhoek"
                    />
                  </label>
                  <label className="block rounded-lg bg-[#efefef] p-4">
                    <span className="text-xs font-medium text-[#5e5e5e]">Vehicle summary</span>
                    <textarea
                      name="vehicleSummary"
                      required
                      defaultValue={application?.vehicleSummary ?? ""}
                      className="mt-1 min-h-28 w-full resize-none bg-transparent text-base font-medium outline-none"
                      placeholder="2022 SUV, automatic, available most weekdays"
                    />
                  </label>
                </div>
                <button type="submit" className="mt-4 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]">
                  Submit for review
                </button>
              </form>
            ) : user ? (
              <div className="rounded-2xl bg-white p-5">
                <h2 className="text-2xl font-bold">Listing access approved</h2>
                <p className="mt-3 text-sm leading-6 text-[#5e5e5e]">
                  Create vehicle listings and manage booking requests from your dashboard.
                </p>
                <Link
                  href="/owner/dashboard"
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-black px-5 text-base font-medium text-white"
                >
                  Go to dashboard
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-5">
                <h2 className="text-2xl font-bold">Start your application</h2>
                <Link
                  href="/sign-in?next=/owner"
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-black px-5 text-base font-medium text-white"
                >
                  Sign in to apply
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-3 md:grid-cols-3">
            {applicationSteps.map((step, index) => (
              <div key={step.label} className="rounded-2xl bg-white p-5 ring-1 ring-black/10">
                <div className="text-sm font-bold">0{index + 1}</div>
                <h2 className="mt-8 text-xl font-bold">{step.label}</h2>
                <p className="mt-2 text-sm leading-5 text-[#5e5e5e]">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="account" />
    </div>
  );
}
