# Kisan Ka Dukan - Admin Dashboard 🌾

A modern, highly-polished administrative dashboard designed specifically for the **Kisan Ka Dukan** agricultural marketplace platform. This dashboard serves as the central hub for platform administrators to manage users, track logistics, resolve support tickets, and monitor platform revenue.

## 🚀 Features

- **📊 Centralized Dashboard**: A premium, glassmorphic overview of platform revenue, active farmers/buyers, and recent B2B/B2C deals.
- **👩‍🌾 User Management**: Dedicated interfaces to manage and manually add Farmers and Buyers. Includes crop verification status tracking for farmers.
- **📦 Orders & Products**: Track all live orders, view detailed product catalogs, and manage listings directly from the portal.
- **🚚 Dispatch & Logistics Hub**: A highly interactive fleet management page showing live agent statuses, contact numbers, and a real-time dispatch history log.
- **💬 Support Inbox**: A centralized messaging hub that allows the admin to read and reply to support tickets directly from farmers and buyers in a seamless chat interface.
- **⚙️ Profile & Settings**: Granular control over administrator security and platform-wide configurations.

## 🛠️ Technology Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: React Router DOM (v6)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with extensive custom premium utility classes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 🎨 UI/UX Design Philosophy

The dashboard was built with a strong emphasis on a "premium" aesthetic:
- **Glassmorphism & Soft Shadows**: Utilizing deep `shadow-2xl` and floating elements to create a paper-like, tactile feel.
- **Rounded Aesthetics**: Pill-shaped buttons (`rounded-full`) and smooth cards (`rounded-3xl`) to make the dense data feel approachable.
- **Vibrant Accent Colors**: Strategic use of bright pinks, deep navy blues (`#0f172a`), and bright greens to instantly draw attention to critical metrics and statuses.

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/itsamar971/kkd-admin.git
   ```

2. Navigate into the project directory:
   ```bash
   cd "admin kkd"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`.

## 🔒 Environment Variables

To connect the frontend to your backend and Firebase services, create a `.env` file in the root directory based on `.env.example` (if provided). Example required variables might include:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
```

*(Note: Currently, the dashboard utilizes graceful mock data fallbacks for UI testing if the backend is not yet fully connected).*
