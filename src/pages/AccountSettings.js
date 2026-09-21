// ========================================
// ACCOUNT SETTINGS PAGE - PRODUCTION READY
// ========================================
// File: frontend/src/pages/AccountSettings.js
// Author: OneTechly
// Updated: September 2026
//
// ✅ FIX (Sep 2026 — "Open Billing Portal" did not open the billing portal):
//   The button called navigate('/dashboard'), and a line of grey text beneath
//   it apologised: "The Billing Portal button is on your Dashboard". It now
//   calls POST /billing/create_portal_session directly — the same request the
//   Dashboard's "Manage Subscription & Billing" button makes — and the apology
//   is gone. Free users, who have no billing record to manage, see an Upgrade
//   button instead of a portal button that would only return an error.
//
// ✅ FIX (Sep 2026 — cancellation was forgotten on reload):
//   "Subscription cancellation scheduled" lived only in component state. Reload
//   the page and it vanished and the Cancel button came back, even though
//   Stripe still had the cancellation. The page now reads
//   GET /billing/subscription_state (new in main.py) on load, so a pending
//   cancellation survives reloads, other devices, and new sessions.
//
// ✅ NEW (Sep 2026 — the banner names the date):
//   "Until the end of your current billing period" → "until September 21,
//   2026", taken from Stripe. Plus a path back: resuming is done in the
//   Stripe billing portal, and the banner now links there.
//
// ✅ FIX (Sep 2026 — tier badge colours were swapped):
//   PRO rendered purple and BUSINESS blue — the reverse of every other page.
//   Now uses the same TIER_BADGE_CLASSES map as DashboardPage.js and
//   ScreenshotPage.js (PRO=blue, BUSINESS=purple, PREMIUM=green, FREE=yellow).
//
// ✅ ADD (May 2026 — Cancel Subscription):
//   Typed confirmation "CANCEL MY SUBSCRIPTION" → POST /billing/cancel_subscription
//   → Stripe schedules the cancellation for the end of the billing period.
//   Shown only for paid tiers.
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PixelPerfectLogo from '../components/PixelPerfectLogo';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

// ── Tier color map — must match DashboardPage.js and ScreenshotPage.js ──────
const TIER_BADGE_CLASSES = {
  free:     'bg-yellow-100 text-yellow-800',
  pro:      'bg-blue-100 text-blue-800',
  business: 'bg-purple-100 text-purple-800',
  premium:  'bg-green-100 text-green-800',
};

function tierBadgeClass(tier) {
  return TIER_BADGE_CLASSES[(tier || 'free').toLowerCase()] ?? TIER_BADGE_CLASSES.free;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

// Backend timestamps may arrive with or without a zone suffix. A bare string
// would be parsed as LOCAL time and could shift the date by a day.
function formatDate(iso) {
  if (!iso) return null;
  const s = /Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tier, refreshSubscriptionStatus } = useSubscription();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Cancel subscription confirmation
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelConfirmText, setCancelConfirmText] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // ✅ NEW (Sep 2026): cancellation state read from the backend, not
  // remembered locally. `subStateChecked` stops the Cancel button flashing
  // for a paid user whose cancellation is already scheduled.
  const [cancelPending, setCancelPending] = useState(false);
  const [cancelAt, setCancelAt] = useState(null);
  const [subStateChecked, setSubStateChecked] = useState(false);

  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const isPaidTier = tier && tier !== 'free';

  // Load user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');

      const raw = user.created_at || user.createdAt || user.created || user.member_since || user.memberSince;
      if (raw) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          setMemberSince(d.toLocaleDateString());
        }
      }
    }
  }, [user]);

  // ── ✅ NEW (Sep 2026): read pending-cancellation state from the backend ──
  const loadSubscriptionState = useCallback(async (fresh = false) => {
    if (!isPaidTier) {
      setCancelPending(false);
      setCancelAt(null);
      setSubStateChecked(true);
      return;
    }
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(
        `${API_URL}/billing/subscription_state${fresh ? '?fresh=1' : ''}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return;   // endpoint missing / Stripe down → fail quiet
      const data = await res.json();
      setCancelPending(Boolean(data.cancel_at_period_end));
      setCancelAt(data.cancel_at || null);
    } catch {
      // Non-fatal: the page still works, it just can't show the pending date.
    } finally {
      setSubStateChecked(true);
    }
  }, [isPaidTier]);

  useEffect(() => { loadSubscriptionState(false); }, [loadSubscriptionState]);

  const handleSave = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const token = getToken();
      if (!token) throw new Error('You are not logged in. Please sign in again.');

      const response = await fetch(`${API_URL}/user/update_profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Failed to update profile');

      setSuccess(true);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const errorMsg = err.message || 'Failed to update profile';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
    setIsEditing(false);
    setError('');
    setSuccess(false);
  };

  // ── ✅ FIX (Sep 2026): open the Stripe Customer Portal for real ──────────
  const handleOpenPortal = async () => {
    setIsOpeningPortal(true);
    try {
      const token = getToken();
      if (!token) throw new Error('You are not logged in.');

      const res = await fetch(`${API_URL}/billing/create_portal_session`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_url: window.location.href }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to open billing portal');
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      toast.error(err.message || 'Could not open billing portal. Please try again.');
      setIsOpeningPortal(false);
    }
  };

  // ── Cancel subscription ───────────────────────────────────────────────────
  const handleCancelSubscription = async () => {
    if (cancelConfirmText !== 'CANCEL MY SUBSCRIPTION') {
      toast.error('Please type CANCEL MY SUBSCRIPTION exactly to confirm');
      return;
    }

    setIsCancelling(true);
    try {
      const token = getToken();
      if (!token) throw new Error('You are not logged in.');

      const response = await fetch(`${API_URL}/billing/cancel_subscription`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Failed to cancel subscription');

      // Show the result immediately from the response, then confirm against
      // the backend so the page agrees with what a reload would show.
      setCancelPending(true);
      setCancelAt(data.cancel_at || null);
      setShowCancelConfirm(false);
      setCancelConfirmText('');

      const endsOn = formatDate(data.cancel_at);
      toast.success(
        endsOn
          ? `Subscription cancelled. You keep access until ${endsOn}.`
          : 'Subscription cancelled. You retain access until the end of your billing period.'
      );

      loadSubscriptionState(true);
      if (refreshSubscriptionStatus) {
        await refreshSubscriptionStatus(false).catch(() => {});
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      const token = getToken();
      if (!token) throw new Error('You are not logged in.');

      const response = await fetch(`${API_URL}/user/delete_account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Account deleted successfully');
        logout();
        navigate('/');
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to delete account');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
    }
  };

  const cancelDateLabel = formatDate(cancelAt);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.username || 'User'}
              </span>
              <button
                onClick={logout}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <PixelPerfectLogo size={64} showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Account Settings</h1>
          <p className="text-gray-600">Manage your account settings, preferences, and profile information.</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to Dashboard
          </button>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Profile Information Card ─────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>👤</span> Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✅ Profile updated successfully!</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{username || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{email || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-900 font-semibold">{memberSince || 'Loading...'}</p>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Saving...
                      </>
                    ) : (
                      <>💾 Save Changes</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Security Card ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔒</span> Security
            </h2>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Password</h3>
              <p className="text-sm text-gray-600 mb-3">Change your account password</p>
              <button
                onClick={() => navigate('/change-password')}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                🔑 Change Password
              </button>
            </div>
          </div>

          {/* ── Subscription Management Card ─────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💳</span> Subscription Management
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Your current plan:{' '}
              <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${tierBadgeClass(tier)}`}>
                {(tier || 'free').toUpperCase()}
              </span>
              {cancelPending && cancelDateLabel && (
                <span className="ml-2 text-xs text-amber-700">· ends {cancelDateLabel}</span>
              )}
            </p>

            {/* Billing portal */}
            <div className="border-b border-gray-200 pb-5 mb-5">
              <h3 className="font-semibold text-gray-900 mb-1">Manage Billing</h3>
              {isPaidTier ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Update payment methods, download invoices, switch between monthly and annual
                    billing, or view your billing history — all in the Stripe Customer Portal.
                  </p>
                  <button
                    onClick={handleOpenPortal}
                    disabled={isOpeningPortal}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {isOpeningPortal ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Opening…
                      </>
                    ) : (
                      <>💳 Open Billing Portal</>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    You're on the Free plan, so there's no billing to manage yet.
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    ⬆️ View Plans
                  </button>
                </>
              )}
            </div>

            {/* Cancel subscription */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Cancel Subscription</h3>

              {!isPaidTier && (
                <p className="text-sm text-gray-600">
                  You're on the Free plan — there's no paid subscription to cancel.
                </p>
              )}

              {/* ✅ Pending cancellation — from the backend, survives reloads */}
              {isPaidTier && cancelPending && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 text-xl">📅</span>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Cancellation scheduled
                      </p>
                      <p className="text-sm text-amber-800 mt-1">
                        {cancelDateLabel
                          ? <>You keep full {(tier || '').toUpperCase()} access until <strong>{cancelDateLabel}</strong>. </>
                          : <>You keep full access until the end of your current billing period. </>}
                        After that your account moves to the Free plan. Your API keys and
                        screenshot history are kept.
                      </p>
                      <p className="text-sm text-amber-800 mt-2">
                        Changed your mind? You can resume your subscription in the{' '}
                        <button
                          onClick={handleOpenPortal}
                          disabled={isOpeningPortal}
                          className="underline font-semibold hover:text-amber-950 disabled:opacity-60"
                        >
                          billing portal
                        </button>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isPaidTier && !cancelPending && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Cancelling stops your subscription at the end of the current billing period.
                    You keep full access until then. Your account, API keys, and screenshot
                    history are preserved — it downgrades to Free, not deleted.
                  </p>

                  {subStateChecked && !showCancelConfirm && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      🚫 Cancel Subscription
                    </button>
                  )}

                  {showCancelConfirm && (
                    <div className="mt-3 p-5 bg-orange-50 border-2 border-orange-200 rounded-xl space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-orange-900 mb-1">
                          Are you sure you want to cancel?
                        </p>
                        <ul className="text-xs text-orange-800 space-y-1 list-disc ml-4">
                          <li>You retain access until the end of your current billing period</li>
                          <li>After that, you drop back to Free (100 screenshots/month)</li>
                          <li>Your API keys, settings, and history are preserved</li>
                          <li>We do not offer refunds for unused time — see our <a href="/terms" className="underline">Terms</a></li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-900 mb-2">
                          Type <code className="bg-orange-100 px-2 py-0.5 rounded font-mono">CANCEL MY SUBSCRIPTION</code> to confirm:
                        </p>
                        <input
                          type="text"
                          value={cancelConfirmText}
                          onChange={(e) => setCancelConfirmText(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                          placeholder="CANCEL MY SUBSCRIPTION"
                          disabled={isCancelling}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowCancelConfirm(false);
                            setCancelConfirmText('');
                          }}
                          disabled={isCancelling}
                          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-60"
                        >
                          Keep Subscription
                        </button>
                        <button
                          onClick={handleCancelSubscription}
                          disabled={cancelConfirmText !== 'CANCEL MY SUBSCRIPTION' || isCancelling}
                          className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isCancelling ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              Cancelling…
                            </>
                          ) : (
                            'Confirm Cancellation'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Danger Zone Card ─────────────────────────────────────────────── */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span>⚠️</span> Danger Zone
            </h2>

            <div>
              <h3 className="font-semibold text-red-900 mb-2">Delete Account Permanently</h3>
              <p className="text-sm text-red-800 mb-4">
                This permanently deletes your account, all your screenshots, API keys, batch
                jobs, and subscription data. <strong>This action cannot be undone.</strong> If
                you only want to stop being billed, use Cancel Subscription above — your
                account remains intact.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  🗑️ Delete My Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-red-900">
                    Type <code className="bg-red-100 px-2 py-1 rounded font-mono">DELETE</code> to confirm permanent deletion:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Type DELETE"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== 'DELETE'}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Permanently Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Coming Soon Card ─────────────────────────────────────────────── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span>🚀</span> Coming Soon
            </h2>
            <p className="text-sm text-blue-800">
              Additional settings including notification preferences, API rate limits, and
              more will be available in future updates.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2026 PixelPerfect API. Built by{' '}
              <button onClick={() => navigate('/about')} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                OneTechly
              </button>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/terms')}         className="hover:text-blue-600 transition-colors">Terms</button>
              <button onClick={() => navigate('/privacy')}       className="hover:text-blue-600 transition-colors">Privacy</button>
              <button onClick={() => navigate('/documentation')} className="hover:text-blue-600 transition-colors">Docs</button>
              <button onClick={() => navigate('/contact')}       className="hover:text-blue-600 transition-colors">Contact</button>
              <button onClick={() => navigate('/help')}          className="hover:text-blue-600 transition-colors">Help</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ====== END OF AccountSettings.js =====

// // ========================================
// // ACCOUNT SETTINGS PAGE - PRODUCTION READY
// // ========================================
// // File: frontend/src/pages/AccountSettings.js
// // Author: OneTechly
// // Updated: May 2026
// //
// // ✅ FEATURES:
// // - Profile information editing (username, email)
// // - Change password button (navigates to /change-password)
// // - Cancel Subscription with typed confirmation (NEW May 2026)
// // - Delete account functionality
// // - Professional header/footer with logo
// // - Mobile responsive design
// // - Proper error handling
// //
// // ✅ ADD (May 2026 — Cancel Subscription):
// //   Added a "Cancel Subscription" section in the Danger Zone, above
// //   the Delete Account section. The cancel flow:
// //     1. User clicks "Cancel Subscription"
// //     2. Confirmation dialog appears asking them to type
// //        "CANCEL MY SUBSCRIPTION" (prevents accidental cancellations)
// //     3. On confirm: calls POST /billing/cancel_subscription
// //     4. Stripe schedules the cancellation for end of billing period
// //     5. User sees a success message and stays on the same account
// //   Cancel is only shown for paid (non-free) tier users.
// //   Free users see a message telling them they have no paid subscription.
// // ========================================

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import PixelPerfectLogo from '../components/PixelPerfectLogo';
// import { useAuth } from '../contexts/AuthContext';
// import { useSubscription } from '../contexts/SubscriptionContext';

// export default function AccountSettings() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const { tier, refreshSubscriptionStatus } = useSubscription();

//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [memberSince, setMemberSince] = useState('');
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   // Delete account confirmation
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteConfirmText, setDeleteConfirmText] = useState('');

//   // Cancel subscription confirmation
//   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
//   const [cancelConfirmText, setCancelConfirmText] = useState('');
//   const [isCancelling, setIsCancelling] = useState(false);
//   const [cancelSuccess, setCancelSuccess] = useState(false);

//   const isPaidTier = tier && tier !== 'free';

//   // Load user data
//   useEffect(() => {
//     if (user) {
//       setUsername(user.username || '');
//       setEmail(user.email || '');
      
//       // Parse member since date
//       const raw = user.created_at || user.createdAt || user.created || user.member_since || user.memberSince;
//       if (raw) {
//         const d = new Date(raw);
//         if (!isNaN(d.getTime())) {
//           setMemberSince(d.toLocaleDateString());
//         }
//       }
//     }
//   }, [user]);

//   const handleSave = async () => {
//     setError('');
//     setSuccess(false);
//     setLoading(true);

//     try {
//       const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
//       const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

//       if (!token) throw new Error('You are not logged in. Please sign in again.');

//       const response = await fetch(`${API_URL}/user/update_profile`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username: username.trim(), email: email.trim() }),
//       });

//       const data = await response.json().catch(() => ({}));
//       if (!response.ok) throw new Error(data.detail || 'Failed to update profile');

//       setSuccess(true);
//       toast.success('Profile updated successfully!');
//       setIsEditing(false);
//     } catch (err) {
//       const errorMsg = err.message || 'Failed to update profile';
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     if (user) {
//       setUsername(user.username || '');
//       setEmail(user.email || '');
//     }
//     setIsEditing(false);
//     setError('');
//     setSuccess(false);
//   };

//   // ── Cancel subscription ───────────────────────────────────────────────────
//   const handleCancelSubscription = async () => {
//     if (cancelConfirmText !== 'CANCEL MY SUBSCRIPTION') {
//       toast.error('Please type CANCEL MY SUBSCRIPTION exactly to confirm');
//       return;
//     }

//     setIsCancelling(true);
//     try {
//       const token   = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
//       const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

//       if (!token) throw new Error('You are not logged in.');

//       const response = await fetch(`${API_URL}/billing/cancel_subscription`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json().catch(() => ({}));
//       if (!response.ok) throw new Error(data.detail || 'Failed to cancel subscription');

//       setCancelSuccess(true);
//       setShowCancelConfirm(false);
//       setCancelConfirmText('');
//       toast.success('Subscription cancelled. You retain access until the end of your billing period.');

//       // Refresh subscription status so tier badge updates
//       if (refreshSubscriptionStatus) {
//         await refreshSubscriptionStatus(false).catch(() => {});
//       }
//     } catch (err) {
//       toast.error(err.message || 'Failed to cancel subscription');
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   // ── Delete account ────────────────────────────────────────────────────────
//   const handleDeleteAccount = async () => {
//     if (deleteConfirmText !== 'DELETE') {
//       toast.error('Please type DELETE to confirm');
//       return;
//     }

//     try {
//       const token   = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
//       const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

//       if (!token) throw new Error('You are not logged in.');

//       const response = await fetch(`${API_URL}/user/delete_account`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         toast.success('Account deleted successfully');
//         logout();
//         navigate('/');
//       } else {
//         const data = await response.json().catch(() => ({}));
//         throw new Error(data.detail || 'Failed to delete account');
//       }
//     } catch (err) {
//       toast.error(err.message || 'Failed to delete account');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ── Header ──────────────────────────────────────────────────────────── */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
//               <PixelPerfectLogo size={40} showText={true} />
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 hidden sm:block">
//                 {user?.username || 'User'}
//               </span>
//               <button
//                 onClick={logout}
//                 className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ── Main Content ────────────────────────────────────────────────────── */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Header */}
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center mb-4">
//             <PixelPerfectLogo size={64} showText={false} />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Account Settings</h1>
//           <p className="text-gray-600">Manage your account settings, preferences, and profile information.</p>
//         </div>

//         {/* Back to Dashboard */}
//         <div className="mb-6">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center gap-2"
//           >
//             <span>←</span> Back to Dashboard
//           </button>
//         </div>

//         <div className="max-w-3xl mx-auto space-y-6">

//           {/* ── Profile Information Card ─────────────────────────────────────── */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <span>👤</span> Profile Information
//               </h2>
//               {!isEditing && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
//                 >
//                   ✏️ Edit Profile
//                 </button>
//               )}
//             </div>

//             {error && (
//               <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm text-red-800">{error}</p>
//               </div>
//             )}
//             {success && (
//               <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <p className="text-sm text-green-800">✅ Profile updated successfully!</p>
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     disabled={loading}
//                   />
//                 ) : (
//                   <p className="text-gray-900 font-semibold">{username || '—'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     disabled={loading}
//                   />
//                 ) : (
//                   <p className="text-gray-900 font-semibold">{email || '—'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
//                 <p className="text-gray-900 font-semibold">{memberSince || 'Loading...'}</p>
//               </div>

//               {isEditing && (
//                 <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                   <button
//                     onClick={handleCancel}
//                     className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>💾 Save Changes</>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Security Card ────────────────────────────────────────────────── */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//               <span>🔒</span> Security
//             </h2>
//             <div className="border-b border-gray-200 pb-4 mb-4">
//               <h3 className="font-semibold text-gray-900 mb-1">Password</h3>
//               <p className="text-sm text-gray-600 mb-3">Change your account password</p>
//               <button
//                 onClick={() => navigate('/change-password')}
//                 className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//               >
//                 🔑 Change Password
//               </button>
//             </div>
//           </div>

//           {/* ── Subscription Management Card ─────────────────────────────────── */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//               <span>💳</span> Subscription Management
//             </h2>

//             <p className="text-sm text-gray-600 mb-4">
//               Your current plan: <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
//                 tier === 'pro'      ? 'bg-purple-100 text-purple-800' :
//                 tier === 'business' ? 'bg-blue-100 text-blue-800' :
//                 tier === 'premium'  ? 'bg-green-100 text-green-800' :
//                 'bg-yellow-100 text-yellow-800'
//               }`}>{(tier || 'free').toUpperCase()}</span>
//             </p>

//             {/* Billing portal link */}
//             <div className="border-b border-gray-200 pb-5 mb-5">
//               <h3 className="font-semibold text-gray-900 mb-1">Manage Billing</h3>
//               <p className="text-sm text-gray-600 mb-3">
//                 Update payment methods, download invoices, switch between monthly and annual
//                 billing, or view your billing history — all in the Stripe Customer Portal.
//               </p>
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 💳 Open Billing Portal
//               </button>
//               <p className="text-xs text-gray-400 mt-2">
//                 The Billing Portal button is on your Dashboard → Subscription Status section.
//               </p>
//             </div>

//             {/* Cancel subscription */}
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-1">Cancel Subscription</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 {isPaidTier
//                   ? 'Cancelling stops your subscription at the end of the current billing period. You keep full access until then. Your account, API keys, and screenshot history are preserved — it downgrades to Free, not deleted.'
//                   : "You're on the Free plan — there's no paid subscription to cancel."}
//               </p>

//               {/* Cancel success banner */}
//               {cancelSuccess && (
//                 <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//                   <div className="flex items-start gap-3">
//                     <span className="text-green-600 text-xl">✅</span>
//                     <div>
//                       <p className="text-sm font-semibold text-green-800">Subscription cancellation scheduled</p>
//                       <p className="text-sm text-green-700 mt-1">
//                         You'll retain full access until the end of your current billing period.
//                         After that, your account automatically downgrades to Free.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {isPaidTier && !cancelSuccess && !showCancelConfirm && (
//                 <button
//                   onClick={() => setShowCancelConfirm(true)}
//                   className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
//                 >
//                   🚫 Cancel Subscription
//                 </button>
//               )}

//               {/* Cancel confirmation dialog */}
//               {showCancelConfirm && !cancelSuccess && (
//                 <div className="mt-3 p-5 bg-orange-50 border-2 border-orange-200 rounded-xl space-y-4">
//                   <div>
//                     <p className="text-sm font-semibold text-orange-900 mb-1">
//                       Are you sure you want to cancel?
//                     </p>
//                     <ul className="text-xs text-orange-800 space-y-1 list-disc ml-4">
//                       <li>You retain access until the end of your current billing period</li>
//                       <li>After that, you drop back to Free (100 screenshots/month)</li>
//                       <li>Your API keys, settings, and history are preserved</li>
//                       <li>We do not offer refunds for unused time — see our <a href="/terms" className="underline">Terms</a></li>
//                     </ul>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-orange-900 mb-2">
//                       Type <code className="bg-orange-100 px-2 py-0.5 rounded font-mono">CANCEL MY SUBSCRIPTION</code> to confirm:
//                     </p>
//                     <input
//                       type="text"
//                       value={cancelConfirmText}
//                       onChange={(e) => setCancelConfirmText(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
//                       placeholder="CANCEL MY SUBSCRIPTION"
//                       disabled={isCancelling}
//                     />
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => {
//                         setShowCancelConfirm(false);
//                         setCancelConfirmText('');
//                       }}
//                       disabled={isCancelling}
//                       className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-60"
//                     >
//                       Keep Subscription
//                     </button>
//                     <button
//                       onClick={handleCancelSubscription}
//                       disabled={cancelConfirmText !== 'CANCEL MY SUBSCRIPTION' || isCancelling}
//                       className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {isCancelling ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                           Cancelling…
//                         </>
//                       ) : (
//                         'Confirm Cancellation'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Danger Zone Card ─────────────────────────────────────────────── */}
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
//             <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
//               <span>⚠️</span> Danger Zone
//             </h2>
            
//             <div>
//               <h3 className="font-semibold text-red-900 mb-2">Delete Account Permanently</h3>
//               <p className="text-sm text-red-800 mb-4">
//                 This permanently deletes your account, all your screenshots, API keys, batch
//                 jobs, and subscription data. <strong>This action cannot be undone.</strong> If
//                 you only want to stop being billed, use Cancel Subscription above — your
//                 account remains intact.
//               </p>
              
//               {!showDeleteConfirm ? (
//                 <button
//                   onClick={() => setShowDeleteConfirm(true)}
//                   className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
//                 >
//                   🗑️ Delete My Account
//                 </button>
//               ) : (
//                 <div className="space-y-3">
//                   <p className="text-sm font-semibold text-red-900">
//                     Type <code className="bg-red-100 px-2 py-1 rounded font-mono">DELETE</code> to confirm permanent deletion:
//                   </p>
//                   <input
//                     type="text"
//                     value={deleteConfirmText}
//                     onChange={(e) => setDeleteConfirmText(e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     placeholder="Type DELETE"
//                   />
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => {
//                         setShowDeleteConfirm(false);
//                         setDeleteConfirmText('');
//                       }}
//                       className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleDeleteAccount}
//                       disabled={deleteConfirmText !== 'DELETE'}
//                       className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Permanently Delete Account
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Coming Soon Card ─────────────────────────────────────────────── */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//             <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
//               <span>🚀</span> Coming Soon
//             </h2>
//             <p className="text-sm text-blue-800">
//               Additional settings including notification preferences, API rate limits, and
//               more will be available in future updates.
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* ── Footer ──────────────────────────────────────────────────────────── */}
//       <footer className="bg-white border-t border-gray-200 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           <div className="text-center text-sm text-gray-600">
//             <p className="mb-2">
//               © 2026 PixelPerfect API. Built by{' '}
//               <button onClick={() => navigate('/about')} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
//                 OneTechly
//               </button>.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button onClick={() => navigate('/terms')}         className="hover:text-blue-600 transition-colors">Terms</button>
//               <button onClick={() => navigate('/privacy')}       className="hover:text-blue-600 transition-colors">Privacy</button>
//               <button onClick={() => navigate('/documentation')} className="hover:text-blue-600 transition-colors">Docs</button>
//               <button onClick={() => navigate('/contact')}       className="hover:text-blue-600 transition-colors">Contact</button>
//               <button onClick={() => navigate('/help')}          className="hover:text-blue-600 transition-colors">Help</button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ====== END OF AccountSettings.js ===== 