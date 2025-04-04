# 📞 Phonio — Video Calling & Revalidation App

Phonio is a simple web-based video calling solution powered by LiveKit, designed with minimal UI and essential features. It also includes a revalidation API to trigger server-side page regeneration in Next.js.

---

## 🔗 Routes

### `/sales-agent`
- A dedicated page for sales agents to join ongoing video calls.
- Includes basic audio/video mute/unmute controls.

### `/api/revalidate`
- Triggers a manual revalidation of a cloned page.
- Forces Next.js to regenerate the page.
- Logs the new server build time in the **server** and **client** console.

### `/revalidate`
- Triggers a manual revalidation of a cloned page.
- Forces Next.js to regenerate the page.
- Logs the new server build time in the **server** and **client** console and show it in UI.

---

## 📹 Video Call Features

### Popup-based Video Call
- Clicking a “Join Call” button anywhere on the site launches a **popup video call**.
- The popup is **draggable** and **resizable**.
- Supports **picture-in-picture (PiP)** mode, like Google Meet.

### Sales Agent Page (`/sales-agent`)
- A sales agent can join calls directly from this page.
- Features include:
  - **Mute/Unmute Audio**
  - **Mute/Unmute Video**

---

## 🧑‍💻 Tech Stack

- **WebRTC Video Calling**: [LiveKit Web SDK](https://docs.livekit.io/client-sdk-js/)
- **Frontend**: JavaScript (no TypeScript)
- **Framework**: Next.js (API routes, dynamic revalidation)

---

## 🌟 Bonus Features

- Floating video window when user navigates away from the call (Google Meet-style PiP).
- Basic error handling with UI feedback for connection issues.

---

## 🔁 Revalidation API

- **Route**: `/api/revalidate`
- **Purpose**: Force Next.js to rebuild a cloned page at runtime.
- **Functionality**:
  - Logs the server build time in the terminal after regeneration.
  - Also logs the updated build time on the client side for visibility.

---

## 📝 Notes

- No ringtone or complex call handling is included — focus is on simplicity and core features.
- The app UI is intentionally minimal to focus on functionality over style.

---

## 🚀 Getting Started

```bash
npm install
npm run dev

```
# 🔐 LiveKit Credentials
LIVEKIT_API_KEY="your_livekit_api_key"
LIVEKIT_API_SECRET="your_livekit_api_secret"

# 🌐 Public URLs
NEXT_PUBLIC_LIVEKIT_URL="wss://your-livekit-instance.livekit.cloud"
NEXT_PUBLIC_DOMAIN_URL="https://your-public-domain.com"

