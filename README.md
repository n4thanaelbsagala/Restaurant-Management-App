# Restaurant Manager

A fully offline, single-user restaurant management app built with React Native and Expo.

## Features

- **Orders** — Create, track, and manage customer orders with status workflows (Pending → In Progress → Completed / Cancelled)
- **Menu** — Manage menu items with photos, categories, prices, and availability toggles
- **Kitchen Resources** — Track inventory with low-stock and out-of-stock alerts
- **Finances** — Dashboard with revenue (auto-calculated from completed orders), income, expenses, and monthly summaries

All data is stored locally on-device using AsyncStorage — no backend, no login, fully offline.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict) |
| Styling | NativeWind v4 (Tailwind CSS) |
| UI Primitives | React Native Paper v5 |
| Navigation | React Navigation v6 (Bottom Tabs + Native Stack) |
| State | Zustand v4 |
| Persistence | @react-native-async-storage/async-storage |
| Forms | React Hook Form + Zod |
| Images | expo-image-picker + expo-file-system |
| Icons | @expo/vector-icons (Ionicons) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go](https://expo.dev/go) installed on your iOS or Android device

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npx expo start
```

### Running on device

Scan the QR code displayed in the terminal with:
- **iOS**: Camera app
- **Android**: Expo Go app

### Running on simulator

```bash
# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator
npx expo start --android
```

---

## Production Build (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo account
eas login

# Configure the project (first time)
eas build:configure

# Build for iOS (.ipa)
eas build --platform ios

# Build for Android (.apk / .aab)
eas build --platform android
```

---

## Project Structure

```
/
├── App.tsx                  # Root component — hydration + providers
├── index.js                 # Entry point
├── global.css               # NativeWind base styles
├── tailwind.config.js       # Tailwind + NativeWind config
├── babel.config.js
├── metro.config.js
└── app/
    ├── types/               # Shared TypeScript interfaces & enums
    ├── constants/           # Colors, categories, storage keys, theme
    ├── utils/               # Currency, date, calculations, seed
    ├── schemas/             # Zod form schemas
    ├── stores/              # Zustand stores (orders, kitchen, finances, app)
    ├── hooks/               # Custom hooks
    ├── components/          # Reusable UI components
    ├── navigation/          # Tab + stack navigators
    └── screens/
        ├── orders/          # OrdersScreen, MenuScreen, OrderDetailScreen
        ├── kitchen/         # KitchenScreen, ResourceDetailScreen
        └── finances/        # FinancesScreen, EntryDetailScreen
```

---

## Seed Data

On first launch the app seeds three menu items (Margherita Pizza, Caesar Salad, Lemonade),
three kitchen resources (Flour, Olive Oil, Paper Cups), and one sample pending order so the
app does not feel empty.

---

## Assets

Place your app icon at `app/assets/icon.png` (1024×1024 PNG) and splash screen at
`app/assets/splash.png` before building for production.

---

## Running Tests

```bash
npm test
```

Unit tests for utility functions use Jest + jest-expo.
