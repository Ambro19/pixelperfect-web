// ========================================
// PRICING PAGE - PIXELPERFECT SCREENSHOT API
// ========================================
// File: frontend/src/pages/Pricing.js
// Author: OneTechly
// Updated: January 2026 - Production-ready
//
// Fixes:
// 1) Added PixelPerfect logo (centered at top)
// 2) Fixed checkout endpoint: /billing/create_checkout_session
// 3) Fixed billing_cycle parameter handling
// 4) Better error handling with user feedback
// ========================================

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PixelPerfectLogo from "../components/PixelPerfectLogo";
import { useAuth } from "../contexts/AuthContext";
import { PRICING_CONFIG } from "../config/pricing";
import { currentApiBase as currentApiBaseFn } from "../lib/api";

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly
  const [isProcessing, setIsProcessing] = useState(false);
  
  const yearly = billingCycle === "yearly";

  const tiers = useMemo(() => {
    // Keep your display order exactly like your UI screenshots
    return ["free", "pro", "business", "premium"].map((id) => PRICING_CONFIG.tiers[id]);
  }, []);

  /**
   * Start Stripe checkout session
   * FIXED: Uses correct endpoint and includes billing_cycle
   */
  async function startCheckout(planId) {
    // Free plan doesn't need checkout
    if (planId === "free") {
      toast.info("You're already on the Free plan!");
      return;
    }

    // Not authenticated - redirect to register
    if (!isAuthenticated) {
      navigate(`/register?plan=${encodeURIComponent(planId)}`);
      return;
    }

    setIsProcessing(true);

    try {
      const apiBase = currentApiBaseFn().replace(/\/+$/, "");
      
      // ✅ FIXED: Correct endpoint that matches backend
      const endpoint = `${apiBase}/billing/create_checkout_session`;
      
      // ✅ FIXED: Proper payload structure
      const payload = {
        plan: planId,              // pro | business | premium
        billing_cycle: billingCycle // monthly | yearly
      };

      console.log("🔵 Starting checkout:", { endpoint, payload });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Server error (${response.status})`;
        
        console.error("❌ Checkout failed:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data?.url) {
        throw new Error("Checkout session created but no redirect URL was returned");
      }

      console.log("✅ Redirecting to Stripe checkout:", data.url);
      
      // Redirect to Stripe
      window.location.href = data.url;

    } catch (error) {
      console.error("💥 Checkout error:", error);
      
      if (error.name === "AbortError") {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error(error.message || "Failed to start checkout. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
                >
                  Dashboard
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ✅ FIXED: Centered Logo (matching Dashboard/Activity pages) */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          
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
            disabled={isProcessing}
            className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${
              yearly ? "bg-blue-600" : "bg-gray-300"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
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
                : tier.id === "premium"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
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
                    <button 
                      disabled 
                      className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto"
                    >
                      ✓ Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => startCheckout(tier.id)}
                      disabled={isProcessing}
                      className={`w-full py-3 text-white rounded-lg font-semibold transition-colors mt-auto disabled:opacity-50 disabled:cursor-not-allowed ${btnStyle}`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Upgrade to ${tier.name}`
                      )}
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

// //==================================================================
// // frontend/src/pages/Pricing.js
// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PixelPerfectLogo from "../components/PixelPerfectLogo";
// import { useAuth } from "../contexts/AuthContext";
// import { apiPostJson } from "../lib/api";
// import { PRICING_CONFIG } from "../config/pricing";

// export default function Pricing() {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly
//   const yearly = billingCycle === "yearly";

//   const tiers = useMemo(() => {
//     // Keep your display order exactly like your UI screenshots
//     return ["free", "pro", "business", "premium"].map((id) => PRICING_CONFIG.tiers[id]);
//   }, []);

//   async function startCheckout(planId) {
//     if (!isAuthenticated) {
//       navigate(`/register?plan=${encodeURIComponent(planId)}`);
//       return;
//     }

//     // free doesn't need checkout
//     if (planId === "free") return;

//     const payload = {
//       plan: planId, // pro|business|premium
//       billing_cycle: billingCycle, // monthly|yearly
//     };

//     const res = await apiPostJson("/billing/checkout-session", payload);

//     if (!res?.url) {
//       throw new Error("Checkout session was created but no redirect URL was returned.");
//     }

//     window.location.href = res.url;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-14 sm:h-16">
//             <div className="cursor-pointer" onClick={() => navigate("/")}>
//               <PixelPerfectLogo size={window.innerWidth < 640 ? 32 : 40} showText />
//             </div>

//             <nav className="hidden md:flex items-center gap-6">
//               <button onClick={() => navigate("/features")} className="text-gray-600 hover:text-gray-900 font-medium">
//                 Features
//               </button>
//               <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-gray-900 font-medium">
//                 About
//               </button>
//               <button onClick={() => navigate("/docs")} className="text-gray-600 hover:text-gray-900 font-medium">
//                 Documentation
//               </button>
//             </nav>

//             <div className="flex items-center gap-2 sm:gap-3">
//               <button
//                 onClick={() => navigate("/login")}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
//               >
//                 Sign in
//               </button>
//               <button
//                 onClick={() => navigate("/register")}
//                 className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//             Choose the plan that fits your needs. All plans include our core features. Upgrade or downgrade anytime.
//           </p>
//         </div>

//         {/* Billing toggle */}
//         <div className="flex justify-center items-center gap-4 mb-12">
//           <span className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
//           <button
//             onClick={() => setBillingCycle(yearly ? "monthly" : "yearly")}
//             className={`relative w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${
//               yearly ? "bg-blue-600" : "bg-gray-300"
//             }`}
//             aria-label="Toggle billing cycle"
//           >
//             <div className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ${yearly ? "translate-x-6" : "translate-x-0"}`} />
//           </button>
//           <span className={`text-sm font-medium ${yearly ? "text-gray-900" : "text-gray-500"}`}>Annual</span>
//           {yearly && (
//             <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
//               Save 16%
//             </span>
//           )}
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {tiers.map((tier) => {
//             const price = yearly ? tier.price.yearly : tier.price.monthly;
//             const perMonthLabel = tier.id === "free" ? "" : "/month";

//             const border =
//               tier.id === "free"
//                 ? "border-2 border-green-500 shadow-lg"
//                 : tier.id === "pro"
//                 ? "border-2 border-blue-500 shadow-lg"
//                 : "border border-gray-200 shadow-md hover:shadow-lg";

//             const badge =
//               tier.id === "free"
//                 ? "CURRENT PLAN"
//                 : tier.id === "pro"
//                 ? "MOST POPULAR"
//                 : null;

//             const btnStyle =
//               tier.id === "business"
//                 ? "bg-purple-600 hover:bg-purple-700"
//                 : "bg-blue-600 hover:bg-blue-700";

//             return (
//               <div key={tier.id} className={`bg-white rounded-xl relative flex flex-col ${border}`}>
//                 {badge && (
//                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                     <span
//                       className={`text-white px-6 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
//                         tier.id === "free" ? "bg-green-500" : "bg-blue-500"
//                       }`}
//                     >
//                       {badge}
//                     </span>
//                   </div>
//                 )}

//                 <div className={`p-6 ${badge ? "pt-10" : ""} flex flex-col flex-grow`}>
//                   <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{tier.name}</h3>

//                   <div className="text-center mb-6">
//                     <span className="text-4xl font-bold text-gray-900">
//                       {tier.id === "premium" && tier.screenshots === "Unlimited" ? `$${yearly ? "4,990" : "499"}` : `$${price}`}
//                     </span>
//                     {tier.id !== "free" && <span className="text-gray-600">{perMonthLabel}</span>}
//                   </div>

//                   <ul className="space-y-3 mb-8 flex-grow">
//                     {tier.features.map((f, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm">
//                         <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span className="text-gray-700">{f}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   {tier.id === "free" ? (
//                     <button disabled className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed mt-auto">
//                       ✓ Current Plan
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => startCheckout(tier.id)}
//                       className={`w-full py-3 text-white rounded-lg font-semibold transition-colors mt-auto ${btnStyle}`}
//                     >
//                       Upgrade to {tier.name}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full">
//             <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span className="text-sm text-gray-700 font-medium">
//               Secure payments processed by Stripe • Cancel anytime • No hidden fees
//             </span>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


