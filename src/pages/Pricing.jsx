// frontend/src/pages/Pricing.js
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { apiPostJson } from "../lib/api";
import { PRICING_CONFIG } from "../config/pricing";

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly
  const yearly = billingCycle === "yearly";

  const tiers = useMemo(() => {
    // Keep your display order exactly like your UI screenshots
    return ["free", "pro", "business", "premium"].map((id) => PRICING_CONFIG.tiers[id]);
  }, []);

  async function startCheckout(planId) {
    if (!isAuthenticated) {
      navigate(`/register?plan=${encodeURIComponent(planId)}`);
      return;
    }

    // free doesn't need checkout
    if (planId === "free") return;

    const payload = {
      plan: planId, // pro|business|premium
      billing_cycle: billingCycle, // monthly|yearly
    };

    const res = await apiPostJson("/billing/checkout-session", payload);

    if (!res?.url) {
      throw new Error("Checkout session was created but no redirect URL was returned.");
    }

    window.location.href = res.url;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate("/features")} className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </button>
              <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </button>
              <button onClick={() => navigate("/docs")} className="text-gray-600 hover:text-gray-900 font-medium">
                Documentation
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core features. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(yearly ? "monthly" : "yearly")}
            className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${
              yearly ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle billing cycle"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${yearly ? "translate-x-6" : "translate-x-0"}`} />
          </button>
          <span className={`text-sm font-medium ${yearly ? "text-gray-900" : "text-gray-500"}`}>Annual</span>
          {yearly && (
            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Save 16%
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => {
            const price = yearly ? tier.price.yearly : tier.price.monthly;
            const perMonthLabel = tier.id === "free" ? "" : "/month";

            const border =
              tier.id === "free"
                ? "border-2 border-green-500 shadow-lg"
                : tier.id === "pro"
                ? "border-2 border-blue-500 shadow-lg"
                : "border border-gray-200 shadow-md hover:shadow-lg";

            const badge =
              tier.id === "free"
                ? "CURRENT PLAN"
                : tier.id === "pro"
                ? "MOST POPULAR"
                : null;

            const btnStyle =
              tier.id === "business"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700";

            return (
              <div key={tier.id} className={`bg-white rounded-xl relative flex flex-col ${border}`}>
                {badge && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span
                      className={`text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                        tier.id === "free" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                )}

                <div className={`p-6 ${badge ? "pt-10" : ""} flex flex-col flex-grow`}>
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{tier.name}</h3>

                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.id === "premium" && tier.screenshots === "Unlimited" ? `$${yearly ? "4,990" : "499"}` : `$${price}`}
                    </span>
                    {tier.id !== "free" && <span className="text-gray-600">{perMonthLabel}</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.id === "free" ? (
                    <button disabled className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto">
                      ✓ Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => startCheckout(tier.id)}
                      className={`w-full py-3 text-white rounded-lg font-semibold transition-colors mt-auto ${btnStyle}`}
                    >
                      Upgrade to {tier.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700 font-medium">
              Secure payments processed by Stripe • Cancel anytime • No hidden fees
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}


////////////////////////////////////////////////////////////////////////////////
// // ========================================
// // PRICING PAGE - PIXELPERFECT
// // ========================================
// // Production-ready pricing page + Stripe checkout wiring
// // File: frontend/src/pages/Pricing.js (or Pricing.jsx)
// // Author: OneTechly
// // Updated: Jan 2026

// import React, { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { apiPostJson } from "../lib/api";

// const VALID_PLANS = ["pro", "business", "premium"];

// export default function Pricing() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated, isLoading } = useAuth();

//   const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"
//   const [pendingPlan, setPendingPlan] = useState(""); // which plan is currently calling stripe

//   const nextPath = useMemo(() => {
//     const params = new URLSearchParams(location.search);
//     const next = params.get("next");
//     if (next && next.startsWith("/")) return next;
//     return "/dashboard";
//   }, [location.search]);

//   const startCheckout = async (planId) => {
//     const tier = String(planId || "").toLowerCase().trim();
//     if (!VALID_PLANS.includes(tier)) {
//       toast.error("Invalid plan selected.");
//       return;
//     }

//     // If auth is still initializing, avoid weird double-redirects
//     if (isLoading) {
//       toast("Loading your session…");
//       return;
//     }

//     // Not logged in -> send to register/login and preserve intent
//     if (!isAuthenticated) {
//       const qp = new URLSearchParams();
//       qp.set("plan", tier);
//       qp.set("billing", billingCycle);
//       qp.set("next", "/pricing");
//       navigate(`/register?${qp.toString()}`);
//       return;
//     }

//     try {
//       setPendingPlan(tier);

//       // Backend returns { url }
//       const res = await apiPostJson("/payments/create-checkout-session", {
//         tier,
//         billing_cycle: billingCycle, // backend accepts "monthly" or "annual"
//         // optional: where to return users
//         success_path: nextPath, // default handled by backend if omitted
//         cancel_path: "/pricing",
//       });

//       if (!res?.url || typeof res.url !== "string") {
//         throw new Error("Stripe checkout URL missing from server response.");
//       }

//       // Redirect to Stripe checkout
//       window.location.assign(res.url);
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.message || "Could not start checkout. Please try again.");
//       setPendingPlan("");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             {/* Logo */}
//             <div className="cursor-pointer" onClick={() => navigate("/")}>
//               <div className="block sm:hidden">
//                 <PixelPerfectLogo size={32} showText />
//               </div>
//               <div className="hidden sm:block">
//                 <PixelPerfectLogo size={40} showText />
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="hidden md:flex items-center gap-6">
//               <button
//                 onClick={() => navigate("/features")}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Features
//               </button>
//               <button
//                 onClick={() => navigate("/about")}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 About
//               </button>
//               <button
//                 onClick={() => navigate("/docs")}
//                 className="text-gray-600 hover:text-gray-900 font-medium"
//               >
//                 Documentation
//               </button>
//             </nav>

//             {/* Auth Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               {isAuthenticated ? (
//                 <button
//                   onClick={() => navigate("/dashboard")}
//                   className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//                 >
//                   Dashboard
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => navigate(`/login?next=${encodeURIComponent("/pricing")}`)}
//                     className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
//                   >
//                     Sign in
//                   </button>
//                   <button
//                     onClick={() => navigate(`/register?next=${encodeURIComponent("/pricing")}`)}
//                     className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
//                   >
//                     Get Started
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Page Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//             Choose the plan that fits your needs. All plans include our core features.
//             Upgrade or downgrade anytime.
//           </p>
//         </div>

//         {/* Billing Toggle */}
//         <div className="flex justify-center items-center gap-4 mb-12">
//           <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
//             Monthly
//           </span>

//           <button
//             onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
//             className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ease-in-out ${
//               billingCycle === "annual" ? "bg-blue-600" : "bg-gray-300"
//             }`}
//             aria-label="Toggle billing cycle"
//           >
//             <div
//               className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
//                 billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
//               }`}
//             />
//           </button>

//           <span className={`text-sm font-medium ${billingCycle === "annual" ? "text-gray-900" : "text-gray-500"}`}>
//             Annual
//           </span>

//           {billingCycle === "annual" && (
//             <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
//               Save 20%
//             </span>
//           )}
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {/* Free */}
//           <div className="bg-white rounded-xl border-2 border-green-500 shadow-lg relative flex flex-col">
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <span className="bg-green-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
//                 CURRENT PLAN
//               </span>
//             </div>
//             <div className="p-6 pt-10 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Free</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">$0</span>
//               </div>

//               <ul className="space-y-3 mb-8 flex-grow text-sm text-gray-700">
//                 <li>✅ 100 screenshots per month</li>
//                 <li>✅ All formats (PNG, JPEG, WebP, PDF)</li>
//                 <li>✅ Standard viewport sizes</li>
//                 <li>✅ Basic screenshot options</li>
//                 <li>✅ Community support</li>
//               </ul>

//               <button
//                 disabled
//                 className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto"
//               >
//                 ✓ Current Plan
//               </button>
//             </div>
//           </div>

//           {/* Pro */}
//           <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg relative flex flex-col">
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//               <span className="bg-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
//                 MOST POPULAR
//               </span>
//             </div>
//             <div className="p-6 pt-10 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Pro</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">
//                   ${billingCycle === "monthly" ? "49" : "39"}
//                 </span>
//                 <span className="text-gray-600">/month</span>
//               </div>

//               <ul className="space-y-3 mb-8 flex-grow text-sm text-gray-700">
//                 <li>✅ 5,000 screenshots per month</li>
//                 <li>✅ Faster processing</li>
//                 <li>✅ Custom viewport dimensions</li>
//                 <li>✅ Full-page screenshots</li>
//                 <li>✅ Priority support</li>
//                 <li>✅ Batch processing (up to 50 URLs)</li>
//               </ul>

//               <button
//                 onClick={() => startCheckout("pro")}
//                 disabled={pendingPlan === "pro"}
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-auto"
//               >
//                 {pendingPlan === "pro" ? "Redirecting…" : "Upgrade to Pro"}
//               </button>
//             </div>
//           </div>

//           {/* Business */}
//           <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
//             <div className="p-6 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Business</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">
//                   ${billingCycle === "monthly" ? "199" : "159"}
//                 </span>
//                 <span className="text-gray-600">/month</span>
//               </div>

//               <ul className="space-y-3 mb-8 flex-grow text-sm text-gray-700">
//                 <li>✅ 50,000 screenshots per month</li>
//                 <li>✅ All Pro features</li>
//                 <li>✅ Advanced screenshot options</li>
//                 <li>✅ Dark mode screenshots</li>
//                 <li>✅ Element removal</li>
//                 <li>✅ Priority support</li>
//                 <li>✅ Batch processing (up to 100 URLs)</li>
//               </ul>

//               <button
//                 onClick={() => startCheckout("business")}
//                 disabled={pendingPlan === "business"}
//                 className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-auto"
//               >
//                 {pendingPlan === "business" ? "Redirecting…" : "Upgrade to Business"}
//               </button>
//             </div>
//           </div>

//           {/* Premium */}
//           <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
//             <div className="p-6 flex flex-col flex-grow">
//               <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Premium</h3>
//               <div className="text-center mb-6">
//                 <span className="text-4xl font-bold text-gray-900">
//                   ${billingCycle === "monthly" ? "499" : "399"}
//                 </span>
//                 <span className="text-gray-600">/month</span>
//               </div>

//               <ul className="space-y-3 mb-8 flex-grow text-sm text-gray-700">
//                 <li>✅ Unlimited screenshots</li>
//                 <li>✅ All Business features</li>
//                 <li>✅ Webhooks</li>
//                 <li>✅ Custom integrations</li>
//                 <li>✅ Dedicated support</li>
//                 <li>✅ Unlimited batch processing</li>
//                 <li>✅ White-label options</li>
//               </ul>

//               <button
//                 onClick={() => startCheckout("premium")}
//                 disabled={pendingPlan === "premium"}
//                 className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-auto"
//               >
//                 {pendingPlan === "premium" ? "Redirecting…" : "Upgrade to Premium"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Notice */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
//             <span className="text-sm text-gray-700 font-medium">
//               Secure payments processed by Stripe • Cancel anytime • No hidden fees
//             </span>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <PixelPerfectLogo size={32} showText textColor="text-white" />
//               <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
//             </div>
//             <div className="flex gap-6 text-sm text-gray-400">
//               <button onClick={() => navigate("/privacy")} className="hover:text-white">Privacy</button>
//               <button onClick={() => navigate("/terms")} className="hover:text-white">Terms</button>
//               <button onClick={() => navigate("/cookies")} className="hover:text-white">Cookies</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

