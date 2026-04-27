# PixelPerfect Advanced Features — Engineering Roadmap

**Document version:** 1.0
**Created:** April 2026
**Author:** OneTechly
**Status:** Planning document — not yet executed
**Estimated effort:** 2–4 focused engineering sessions

---

## Purpose

This document captures the implementation plan for shipping the five advanced features that are currently marked "Coming Soon" on the PixelPerfect Features page:

1. **Custom JavaScript Execution** (Pro+)
2. **Mobile Device Emulation** (Pro+)
3. **Element Selection / Targeted Cropping** (Business+)
4. **Webhooks & Change Detection** (Business+)
5. **White-Label / Custom Domain Support** (Premium)

Each feature has scaffolding code already written in `backend/routers/screenshot.py`, but that router is **not currently wired up in `main.py`** — so none of the advertised endpoints are reachable. The active production code path uses `backend/screenshot_endpoints.py`, which has none of these features.

This document is the playbook for closing that gap when the time is right.

---

## Current state of the codebase

### Two screenshot routers exist

```
backend/
├── screenshot_endpoints.py          ← ACTIVE in production (wired in main.py)
│   └── ScreenshotRequest model      ← url, width, height, format, full_page,
│                                       dark_mode, delay, remove_elements
│
└── routers/
    └── screenshot.py                ← INACTIVE (not imported anywhere)
        └── ScreenshotRequest model  ← All of the above PLUS:
                                       device, custom_js, wait_for_selector,
                                       target_element, webhook_url
```

### The wiring gap

In `main.py`, the production endpoint is registered like this:

```python
from screenshot_endpoints import (
    capture_screenshot_endpoint,    # ← The active handler
    ScreenshotRequest,              # ← Has only basic params
    ...
)

@app.post("/api/v1/screenshot")
async def capture_screenshot(
    request: ScreenshotRequest,     # ← Pydantic drops unknown fields
    ...
):
    return await capture_screenshot_endpoint(request, current_user, db)
```

If a user sends `{"url": "...", "custom_js": "alert(1)"}`, Pydantic silently strips `custom_js` because it's not in the model. The handler never sees it. The screenshot service never executes any JavaScript.

### What's missing in `screenshot_service.py`

Even if the advanced router were wired up, `screenshot_service.capture_screenshot()` would still need work:

- No `custom_js` parameter — would need to call `page.evaluate()`
- No `device` parameter — would need to use Playwright's `playwright.devices` dict
- No `target_element` parameter — would need `page.locator(...).screenshot()`
- No `wait_for_selector` parameter — would need `page.wait_for_selector()`
- No webhook firing — would need a background task system

---

## Feature implementation plans

### Feature 1: Custom JavaScript Execution (Pro+)

**What it does:** Run user-provided JavaScript inside the headless browser before capturing the screenshot. Lets users dismiss modals, click buttons, fill forms, or wait for dynamic content.

**Why it's valuable:** Single biggest feature gap competitive with URLBox, ScreenshotAPI.net, ApiFlash. Most professional buyers expect this.

**Tier gate:** Pro and above (per `routers/screenshot.py` line 138)

**Code changes required:**

1. **Add field to `screenshot_endpoints.py` `ScreenshotRequest`:**
   ```python
   custom_js: Optional[str] = Field(
       default=None,
       max_length=10000,
       description="JavaScript to execute before capture. Pro+ only."
   )
   ```

2. **Add validation in the endpoint handler:**
   ```python
   if request.custom_js and tier == "free":
       raise HTTPException(
           status_code=403,
           detail="Custom JavaScript execution requires Pro tier or higher."
       )
   ```

3. **Pass through to service:**
   ```python
   result = await screenshot_service.capture_screenshot(
       ...,
       custom_js=request.custom_js,
   )
   ```

4. **Update `screenshot_service.capture_screenshot()` signature:**
   ```python
   async def capture_screenshot(
       self,
       ...,
       custom_js: Optional[str] = None,
   ) -> Dict[str, Any]:
       ...
   ```

5. **Execute in `_sync_capture_screenshot()` AFTER page load, BEFORE delay:**
   ```python
   # Execute user JavaScript if provided (Pro+)
   if custom_js:
       try:
           page.evaluate(custom_js)
           logger.info("✅ Custom JavaScript executed successfully")
       except PlaywrightError as js_err:
           logger.warning("⚠️ Custom JavaScript failed: %s", js_err)
           # Decision needed: fail the screenshot, or continue?
           # Recommended: continue — user JS errors shouldn't break capture
   ```

**Security considerations:**

- **Same-origin only.** Playwright's `page.evaluate()` already runs in the page's origin context. User JS cannot access PixelPerfect's server.
- **Length cap.** 10,000 characters is plenty for legitimate use, prevents abuse.
- **Timeout.** Wrap in `page.evaluate()` with a 5-second timeout to prevent infinite loops.
- **No `eval` of server-side code.** This is browser-side JS only.
- **Log but don't store.** Don't keep user JS in DB long-term (storage cost + GDPR concern). Log at INFO level for debugging, then discard.

**Test cases:**
- Free user submits `custom_js` → 403 with clear error
- Pro user submits valid JS that hides an element → screenshot reflects the change
- Pro user submits malformed JS → screenshot still captures, error logged
- Pro user submits JS with infinite loop → timeout fires, screenshot captures anyway
- JS over 10,000 chars → 422 Pydantic validation error

**Estimated effort:** 4–6 hours including tests

---

### Feature 2: Mobile Device Emulation (Pro+)

**What it does:** Use named device presets (iPhone 13, Pixel 5, iPad Pro) instead of raw width/height. Playwright handles the user-agent, viewport, device-pixel-ratio, and touch emulation automatically.

**Why it's valuable:** Easier than memorizing `375×667 mobile-safari`. Marketing-friendly ("test your site on iPhone 13").

**Tier gate:** Pro and above (per `routers/screenshot.py` line 139)

**Code changes required:**

1. **Define supported devices in `screenshot_service.py`:**
   ```python
   from playwright.sync_api import sync_playwright

   # Curated list — Playwright supports ~150 devices, we expose a subset
   SUPPORTED_DEVICES = {
       "iphone_13":          "iPhone 13",
       "iphone_13_pro_max":  "iPhone 13 Pro Max",
       "iphone_se":          "iPhone SE",
       "pixel_5":            "Pixel 5",
       "pixel_7":            "Pixel 7",
       "ipad_pro":           "iPad Pro 11",
       "ipad_mini":          "iPad Mini",
       "galaxy_s9":          "Galaxy S9+",
       "galaxy_tab_s4":      "Galaxy Tab S4",
   }

   def get_device_descriptor(device_key: str):
       """Return Playwright device dict, or None."""
       playwright_name = SUPPORTED_DEVICES.get(device_key)
       if not playwright_name:
           return None
       with sync_playwright() as p:
           return p.devices.get(playwright_name)
   ```

2. **Add field to request model:**
   ```python
   device: Optional[str] = Field(
       default=None,
       description="Device preset (overrides width/height). Pro+ only."
   )

   @field_validator("device")
   @classmethod
   def _validate_device(cls, v):
       if v and v not in SUPPORTED_DEVICES:
           raise ValueError(f"Unknown device. Supported: {list(SUPPORTED_DEVICES.keys())}")
       return v
   ```

3. **Modify `_sync_capture_screenshot()` to use device descriptor:**
   ```python
   if device:
       device_dict = get_device_descriptor(device)
       if device_dict:
           # Override width/height/user-agent with device defaults
           context = self.browser.new_context(**device_dict)
       else:
           # Fall back to standard context
           context = self.browser.new_context(...)
   else:
       context = self.browser.new_context(...)
   ```

4. **Add `/api/v1/screenshot/devices` endpoint** to list available presets (already drafted in `routers/screenshot.py`).

**Test cases:**
- `device: "iphone_13"` produces iPhone-shaped screenshot with correct user-agent
- `device: "made_up_device"` returns 422 with helpful error
- Free user with `device` param → 403
- `device` AND `width/height` together → device wins, log warning
- GET `/api/v1/screenshot/devices` returns the list (Pro+ users only)

**Estimated effort:** 3–4 hours

---

### Feature 3: Element Selection / Targeted Cropping (Business+)

**What it does:** Capture only a specific element on the page (e.g., `#hero-section`) instead of the full viewport. Result is a tightly cropped screenshot of just that element.

**Why it's valuable:** Generate component screenshots for design systems, isolate hero images for marketing, capture data tables without surrounding chrome.

**Tier gate:** Business and above (per `routers/screenshot.py` line 140)

**Distinction from existing `remove_elements`:**
- `remove_elements` (current, all tiers): Hides elements, then captures the whole page
- `target_element` (new, Business+): Captures ONLY the specified element

**Code changes required:**

1. **Add field to request model:**
   ```python
   target_element: Optional[str] = Field(
       default=None,
       max_length=200,
       description="CSS selector to capture (Business+). Crops to this element only."
   )
   ```

2. **Update `_sync_capture_screenshot()`:**
   ```python
   if target_element:
       try:
           # Wait for element to exist (5s max)
           page.wait_for_selector(target_element, state="visible", timeout=5000)
           locator = page.locator(target_element).first
           locator.screenshot(path=str(filepath), type=fmt if fmt != "webp" else "png")
       except PlaywrightError as e:
           raise ValueError(
               f"Target element '{target_element}' not found or not visible: {e}"
           ) from e
   else:
       # Existing full-page or viewport capture
       page.screenshot(path=str(filepath), full_page=full_page, ...)
   ```

3. **Tier check before service call:**
   ```python
   if request.target_element and tier not in ("business", "premium"):
       raise HTTPException(
           status_code=403,
           detail="Element selection requires Business tier or higher."
       )
   ```

**Edge cases to handle:**
- Selector matches multiple elements → use `.first` (already in plan above)
- Selector doesn't exist on page → 400 with clear error
- Element is `display: none` → wait timeout, return helpful error
- Element is larger than viewport → Playwright handles this correctly already
- `target_element` + `full_page: true` → ignore `full_page`, log info

**Estimated effort:** 3–4 hours

---

### Feature 4: Webhooks & Change Detection (Business+)

**What it does:** Two related but distinct features:

**4a. Webhook notifications** — When a screenshot finishes, POST the result to a user-provided URL. Especially useful for batch jobs with many URLs.

**4b. Visual change detection** — Compare a new screenshot against a baseline; if the visual diff exceeds a threshold, fire a webhook with diff metadata.

**Why it's valuable:** Asynchronous workflows. Site monitoring. Automated visual regression testing in CI/CD.

**Tier gate:** Business and above

**This is the most complex feature.** Realistically, ship 4a first, defer 4b to a future release.

#### 4a. Webhook notifications — implementation plan

1. **Add fields to request model:**
   ```python
   webhook_url: Optional[HttpUrl] = Field(
       default=None,
       description="POST screenshot result to this URL when complete (Business+)."
   )
   webhook_secret: Optional[str] = Field(
       default=None,
       max_length=200,
       description="HMAC secret for webhook signature verification."
   )
   ```

2. **Send webhook in background task:**
   ```python
   if request.webhook_url:
       background_tasks.add_task(
           send_webhook_notification,
           webhook_url=str(request.webhook_url),
           secret=request.webhook_secret,
           payload={
               "event":         "screenshot.completed",
               "screenshot_id": screenshot_id,
               "url":           str(request.url),
               "screenshot_url": screenshot_url,
               "format":        fmt,
               "size_bytes":    file_size,
               "created_at":    datetime.utcnow().isoformat(),
           },
       )
   ```

3. **Webhook delivery function with retries:**
   ```python
   async def send_webhook_notification(
       webhook_url: str,
       secret: Optional[str],
       payload: Dict[str, Any],
       max_retries: int = 3,
   ):
       import json, hashlib, hmac
       import httpx

       body = json.dumps(payload, sort_keys=True).encode()

       headers = {
           "Content-Type": "application/json",
           "User-Agent":   "PixelPerfect-Webhook/1.0",
       }

       if secret:
           sig = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
           headers["X-PixelPerfect-Signature"] = f"sha256={sig}"

       for attempt in range(1, max_retries + 1):
           try:
               async with httpx.AsyncClient() as client:
                   resp = await client.post(
                       webhook_url, content=body, headers=headers, timeout=10.0,
                   )
                   if resp.is_success:
                       logger.info("✅ Webhook delivered: %s", webhook_url)
                       return
                   logger.warning("⚠️ Webhook returned %d", resp.status_code)
           except Exception as e:
               logger.warning("⚠️ Webhook delivery failed: %s", e)
           if attempt < max_retries:
               await asyncio.sleep(2 ** attempt)  # 2s, 4s, 8s

       logger.error("❌ Webhook delivery failed permanently: %s", webhook_url)
   ```

4. **Persist webhook delivery attempts** for debugging:
   - New table: `webhook_deliveries(id, user_id, url, status, attempts, last_error, created_at)`
   - User-facing endpoint: `GET /api/v1/webhooks/deliveries` to inspect history

#### 4b. Change detection — defer

Visual diff requires `Pillow.ImageChops.difference()` plus a threshold algorithm. Real-world implementations also handle anti-aliasing differences, dynamic content (timestamps, ads), and resolution mismatches. **Recommend deferring this to a v2 release.** Ship webhooks first, validate demand, then build diff if customers ask for it.

**Estimated effort:** 8–12 hours for webhooks alone (excluding change detection)

---

### Feature 5: White-Label / Custom Domain Support (Premium)

**What it does:** Premium customers can route requests through their own domain (`api.theirsite.com`) that proxies to PixelPerfect. The screenshot URLs returned use their domain, not ours.

**Why it's valuable:** Enterprise customers who resell or embed PixelPerfect want their brand front-and-center.

**Tier gate:** Premium only

**This is the most architectural feature** because it touches DNS, SSL certificates, and storage URLs.

**Implementation requires three components:**

1. **DNS / SSL setup** (per-customer, manual for first few customers):
   - Customer adds CNAME: `api.theirsite.com → api.pixelperfectapi.net`
   - Or PixelPerfect provisions a Cloudflare-managed cert via API
   - We maintain an allowlist table of approved custom domains

2. **Database changes:**
   ```python
   class CustomDomain(Base):
       __tablename__ = "custom_domains"
       id              = Column(Integer, primary_key=True)
       user_id         = Column(Integer, ForeignKey("users.id"), unique=True)
       domain          = Column(String(255), unique=True)
       verified_at     = Column(DateTime, nullable=True)
       cert_status     = Column(String(20))  # pending / active / expired
       created_at      = Column(DateTime, default=datetime.utcnow)
   ```

3. **Storage URL rewriting:**
   ```python
   def get_screenshot_url_for_user(user, filename):
       custom = get_active_custom_domain(user)
       if custom:
           return f"https://{custom.domain}/screenshots/{filename}"
       return get_screenshot_url(filename)
   ```

4. **CORS allowlist update:**
   ```python
   allowed_custom_domains = get_active_custom_domains_list()
   PUBLIC_ORIGINS.extend([f"https://{d}" for d in allowed_custom_domains])
   ```

**Operational considerations:**
- First few customers: hand-configure DNS via support
- Later: build a `/dashboard/custom-domain` UI flow
- Cert renewal: automate via Cloudflare API or cert-manager
- Revocation: when subscription drops below Premium, deactivate custom domain

**Estimated effort:** 12–20 hours (genuinely complex; consider deferring to enterprise sales motion)

---

## Tier gating summary

The `get_tier_limits()` function in `models.py` will need an `advanced_features` dict per tier. Suggested shape:

```python
TIER_FEATURES = {
    "free": {
        "custom_js":         False,
        "device_emulation":  False,
        "element_selection": False,
        "webhooks":          False,
        "white_label":       False,
    },
    "pro": {
        "custom_js":         True,
        "device_emulation":  True,
        "element_selection": False,
        "webhooks":          False,
        "white_label":       False,
    },
    "business": {
        "custom_js":         True,
        "device_emulation":  True,
        "element_selection": True,
        "webhooks":          True,
        "white_label":       False,
    },
    "premium": {
        "custom_js":         True,
        "device_emulation":  True,
        "element_selection": True,
        "webhooks":          True,
        "white_label":       True,
    },
}

def has_feature(user, feature_name: str) -> bool:
    tier = (user.subscription_tier or "free").lower()
    return TIER_FEATURES.get(tier, {}).get(feature_name, False)
```

This makes adding new gated features trivial later.

---

## Recommended shipping sequence

Don't ship all five at once. Ship in this order to minimize risk:

### Phase 1: Custom JavaScript Execution + Device Emulation (Pro+)

These two together hit the biggest competitive gap and unlock Pro-tier conversion. Both are scoped, contained changes to `screenshot_service.py` and `screenshot_endpoints.py`. **Ship together as a single Pro-tier feature release.**

- Estimated total effort: 8–10 hours
- Risk: Low — additive changes, no breaking changes to existing API
- Marketing impact: High — these are "must-have" features for buyers

### Phase 2: Element Selection (Business+)

Smaller scope than Phase 1, lower marketing impact, but justifies the Business tier price. Ship 2-3 weeks after Phase 1 once you have data on how Pro features are being used.

- Estimated effort: 3–4 hours
- Risk: Low

### Phase 3: Webhooks (Business+)

This is the biggest engineering investment. Don't start until Phases 1 and 2 are stable. Webhooks require new database tables, retry logic, signature verification, and a delivery-history UI.

- Estimated effort: 8–12 hours (4a only)
- Risk: Medium — webhook delivery is async and stateful, harder to test
- Recommend: Build behind a feature flag, beta with select customers first

### Phase 4: White-Label (Premium)

Defer until you have Premium customers actually asking for it. Don't build before there's demand. The first one or two custom domains can be hand-configured by support.

- Estimated effort: 12–20 hours
- Risk: High — touches DNS, SSL, storage URLs, CORS
- Recommend: Sell first, build second

---

## Pre-launch testing checklist

Before any feature goes live in production, verify:

### Per-feature checklist

- Pydantic model accepts the new field with proper validation
- Free-tier user gets 403 with clear error message
- Authorized-tier user gets successful response
- Field is properly persisted in database (if applicable)
- Field shows up in `/subscription_status` features dict
- Logs include the new parameter for debugging
- Error path doesn't crash the screenshot service

### Per-deployment checklist

- All existing tests still pass
- New tests added for the new feature (happy path + 2-3 error cases)
- Production env vars are set (especially for white-label DNS config)
- Frontend Features.jsx is updated to remove "Coming Soon" badge
- Help Center article is written and published
- Pricing page reflects new feature availability per tier
- Customer-facing changelog is updated

---

## Files that will change when shipping each feature

For grep-ability when picking up this work later:

| Feature | Files affected |
|---------|----------------|
| Custom JavaScript | `screenshot_endpoints.py`, `screenshot_service.py`, `models.py`, `Features.jsx`, `helpArticles.js` |
| Device Emulation | `screenshot_endpoints.py`, `screenshot_service.py`, `Features.jsx`, `ScreenshotPage.js` (UI for device picker) |
| Element Selection | `screenshot_endpoints.py`, `screenshot_service.py`, `Features.jsx` |
| Webhooks | `screenshot_endpoints.py`, `screenshot_service.py`, `models.py` (new table), `main.py` (delivery service), `Features.jsx`, `webhook_handler.py` (existing — extend) |
| White-Label | `models.py`, `main.py` (CORS), `screenshot_service.py` (URL gen), new admin UI, DNS provisioning script |

---

## Rollback plan

For each feature, the rollback is straightforward because all changes are additive:

1. Pydantic field becomes optional `None` default → users who don't send it see no change
2. Tier gate raises 403 if disabled → safer than silently accepting requests
3. Service-layer changes are guarded by `if param is not None` checks
4. Database migrations use `ALTER TABLE ... ADD COLUMN ... IF NOT EXISTS` semantics

To roll back any feature: comment out the field validator + service call, redeploy. The endpoint continues to accept the field (Pydantic ignores it silently) but the feature becomes a no-op. Users see no breakage.

---

## Open questions to resolve before starting

These need decisions before implementation begins:

1. **Custom JS error handling:** If user JS throws an error, do we:
   - (a) Fail the whole screenshot with 422?
   - (b) Capture anyway, log the error, return success?
   - (c) Capture anyway, but include `js_warning` in response?
   - **Recommended: (c)** — most user-friendly, debuggable, doesn't break workflows

2. **Webhook delivery guarantees:** Is "at least once, with 3 retries" sufficient, or do we need a durable queue (Redis, Celery, SQS)?
   - **Recommended: at-least-once for v1**, durable queue if customers complain

3. **White-label minimum tier:** Premium-only, or open to Business as a paid add-on?
   - **Recommended: Premium-only initially**, revisit based on demand

4. **Device list curation:** Expose all ~150 Playwright devices, or curate to ~10?
   - **Recommended: curate to 10**, expand if customers ask for specific ones

5. **JavaScript timeout:** 5 seconds, 10 seconds, or configurable?
   - **Recommended: 5 seconds fixed for v1**, makes total request budget predictable

---

## Marketing & launch alignment

When each feature ships, coordinate:

1. **Help Center article** (write before launch, publish on launch day)
2. **Features.jsx update** (remove "Coming Soon", change to active tier badge)
3. **Pricing page** (update feature comparison table)
4. **Email to existing customers** (especially Pro+ customers — they're the audience)
5. **Twitter / Bluesky / OneTechly blog post** (changelog entry)
6. **Product Hunt update** (if applicable)

---

## Cost / benefit analysis

| Feature | Engineering effort | Customer impact | Conversion lift estimate |
|---------|--------------------|--------------------|--------------------------|
| Custom JavaScript | 4–6 hrs | Very high | High — catches up to competitors |
| Device Emulation | 3–4 hrs | High | Medium — nice-to-have |
| Element Selection | 3–4 hrs | Medium | Low — niche use case |
| Webhooks | 8–12 hrs | High (for B2B) | Medium — Business tier driver |
| White-Label | 12–20 hrs | Very high (per customer) | High per deal — but small audience |

**Best ROI:** Custom JavaScript + Device Emulation (combined Phase 1).

**Highest deal-size lift:** White-Label, but only when there's a buyer ready to pay.

---

## Success metrics

Once shipped, track:

- **Custom JS:** % of Pro requests using `custom_js` field (target: >5% within 30 days)
- **Device Emulation:** % of requests using `device` instead of raw `width/height` (target: >15% within 30 days)
- **Element Selection:** Adoption among Business users (target: >10% of Business users)
- **Webhooks:** Webhook delivery success rate (target: >99%)
- **White-Label:** Number of active custom domains (target: 5+ within 6 months)

If a feature has <2% adoption after 60 days, consider whether the marketing or pricing is wrong — not necessarily the feature.

---

## Appendix: Code review of `routers/screenshot.py`

The existing scaffolding in `backend/routers/screenshot.py` is a strong starting point but needs review before activation:

**Strengths:**
- Has all five features modeled
- Has tier-checking logic via `check_feature_access()`
- Has proper webhook background-task firing
- Has reasonable Pydantic validation

**Concerns / required changes:**
- Tier check uses string list `["pro", "business", "premium"]` — should use `TIER_FEATURES` dict
- `check_feature_access()` returns False for free tier on JS execution → some features might want different gates
- Calls `screenshot_service.capture_screenshot()` with kwargs the service doesn't yet support — these will need to be added to the service signature
- The webhook delivery doesn't have HMAC signing (security gap)
- No webhook delivery retry logic
- Element selection uses `target_element` parameter, but service doesn't implement this
- The router prefix is `/api/v1/screenshot` — same as the active endpoint. **Activating it will conflict with the existing `@app.post("/api/v1/screenshot")` in main.py.** Resolution: either replace the existing endpoint with `app.include_router(advanced_screenshot_router)`, or rename the new router to a different prefix during transition.

---

## Final notes

This is a living document. Update it as decisions are made or as features ship. The goal is that anyone (you, a contractor, a future co-founder) can pick up this document and understand:

1. What needs to be built
2. Why it's not built yet
3. How to build it
4. What the risks are
5. How to validate it's working

Good luck. Ship when ready, not before. The Coming Soon badges aren't going anywhere — they're patient.

---

**Document maintained by:** OneTechly
**Last updated:** April 25, 2026
**Next review:** When first advanced feature is ready to ship