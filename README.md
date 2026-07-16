# 📖 Inclusive Audiobook Player (React Native / Expo)

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Managed_Workflow-000000?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An inclusive, offline-first mobile application designed specifically for individuals with visual impairments, dyslexia, and motor challenges. Built using the React Native framework and Expo SDK, this app demonstrates that digital accessibility (WCAG 2.1) can be beautifully integrated with a clean, high-performance user interface.

---

## 🌟 Key Features

### ♿ Real Accessibility (WCAG 2.1 & DSTU EN 301549:2022)
* **Dyslexia-friendly Typography:** Complete integration of the **OpenDyslexic** font family. Powered by a custom `useTypography` hook, the app dynamically scales font sizes and automatically adjusts **line spacing to 1.6** (from the standard 1.3) when the font is enabled, dramatically improving readability.
* **High-Contrast Theme:** An exclusive high-contrast UI mode, rigorously verified against the **WebAIM Contrast Checker** (achieving a contrast ratio above the strict WCAG AA standard).
* **Active Voice Feedback:** Built-in screen reader adaptation using native `accessibilityLabel` properties. Features a dynamic event-driven voice guidance helper that speaks actions (e.g., *"Settings Screen Opened"*, *"Special Theme Enabled"*) via the native `speak()` API, providing clear navigation feedback without visual control.

### 🛠️ Advanced Engineering & Optimization
* **Memory Leak & OutOfMemory (OOM) Prevention:** Original file-parsing approaches load entire heavy MP3/M4B audiobooks into RAM, causing crashes. This app resolves this by implementing a **data segmentation mechanism**: using `expo-file-system` (`readAsStringAsync`), the app reads only the initial **1.5 MB** in Base64. It decodes the binary buffer and extracts ID3 tags/album art via `jsmediatags` safely and efficiently.
* **Smart Storage Management:** Designed an import pipeline utilizing `expo-document-picker`. To prevent cache pollution and excessive memory usage, imported books are physically moved from the temporary cache directory to the application's secure permanent documents directory (`/AudioBooks`).
* **Custom Audio Engine:** Uses `expo-audio` to manage media sessions, featuring customized background playback, custom playback speeds (1.0x, 1.2x, 1.5x), a sleep timer, and a special screen-lock switch ("lock icon") to prevent accidental touch gestures.
* **Silent-Mode Bypass:** Configured the audio session with `playsInSilentMode: true` to ensure reliable audiobook playback even if the physical device switch is set to silent.

---

## 🛠️ Tech Stack & Architecture

The application is built on a clean, decoupled modular architecture:
                              +-------------------+
                              |     Expo SDK      |
                              +---------+---------+
                                        |
                              +---------v---------+
                              |   React Native    |
                              +---------+---------+
                                        |
                              +---------v---------+
                              |      Node.js      |
                              +-------------------+

* **Framework:** React Native (Expo Managed Workflow)
* **Language:** TypeScript (Strict Type-Safety utilizing Interfaces, Types, and Generics)
* **State Management:** React Context API (`ThemeContext`, `SettingsContext`). This lightweight native approach completely avoids the overhead of massive state libraries like Redux, maintaining a tiny final bundle size while optimizing re-renders via `useMemo`.
* **Navigation:** File-system based routing via Expo Router (`(tabs)`)
* **UI Foundation:** React Native Paper (extended custom themes)
* **Core Native Modules:** `expo-audio`, `expo-file-system`, `expo-document-picker`, `expo-crypto`

---

## 📂 Directory Structure

```filepath
/
├── app/                  # File-system routing and screen layouts (Expo Router)
│   └── (tabs)/           # Core tab navigation: Library, Player, Community, Settings
└── src/
    ├── assets/           # Fonts (OpenDyslexic), localized icons, static placeholders
    ├── context/          # Global State providers (ThemeContext, SettingsContext)
    ├── features/         # Modular feature folders (isolation of logic and UI)
    ├── hooks/            # Reusable hooks (useTypography, useLibrary, etc.)
    └── theme/            # theme.ts (Central design tokens and typography scaling)
```
## 🚀 Getting Started### Prerequisites
Make sure you have [Node.js LTS](https://nodejs.org/) installed on your machine.### Installation1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Boiko-Zakhar/Application-AudioBook-ReactNative.git](https://github.com/Boiko-Zakhar/Application-AudioBook-ReactNative.git)
```
Navigate to the project directory:
```Bash
cd Application-AudioBook-ReactNative
```
Install dependencies:
```Bash
npm install
```
Running the App Locally
Start the Expo development server:
```Bash
npx expo start
```
Launch on a device or emulator:
Scan the QR code displayed in your terminal using the Expo Go app (Android / iOS).
Press a to open the project in an Android Emulator.
Press i to open the project in an iOS Simulator.
📜 Standards & References

WCAG 2.1 Guidelines: Web Content Accessibility Guidelines (Priority standards for Contrast, Adaptability, and Readability).
DSTU EN 301549:2022: State Information Technology Accessibility Standard of Ukraine (harmonized with European standards for ICT accessibility).
🎓 Developed by Zakhar Boiko as a graduation diploma thesis (2026).
