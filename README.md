## Vypyska.pro · Bank Statement Converter

A modern, privacy-first web application for converting bank statements from Monobank and PrivatBank into 1C/BAS compatible XML format. All processing happens locally in your browser—your financial data never leaves your device.

> **Note:** Targets **Node.js v24**. Includes strict version management via `.nvmrc` and `package.json` engines.

### 🚀 Key Features

#### Core Functionality

- **Bank Statement Conversion:** Convert CSV, XLS, and PDF files from Monobank and PrivatBank
- **1C/BAS XML Export:** Generate XML files compatible with 1C accounting systems
- **100% Local Processing:** All file operations happen in your browser—no server uploads
- **Privacy-First:** Zero data collection, GDPR compliant
- **User Feedback System:** Integrated Firebase for collecting user feedback and ratings

#### Tech Stack

- **React 19** (Latest features ready)
- **Vite** (Powered by **Rolldown** + **Oxc** minification for blazing fast builds)
- **TypeScript** with strict rules and `@/*` path aliases
- **React Router v7** for robust routing
- **Zustand** for global state (with devtools & auto-selectors)
- **TanStack Query v5** for async state management
- **React Hook Form + Zod** for type-safe forms
- **Firebase** for feedback collection

#### UI & Styling

- **Tailwind CSS v4** ready configuration
- **Shadcn UI** components (Button, Input, Card, Dialog, Label, Textarea)
- **Inter Font** (Self-hosted automatically for GDPR & Performance)
- **Modern "Google Blue"** design system tokens
- **Fully Responsive:** Mobile-first design approach

#### Performance & Optimizations ⚡️

- **Brotli Compression:** (`.br`) assets generated at build time.
- **Self-hosted Fonts:** Google Fonts are downloaded and served locally (0 external requests).
- **Smart Chunking:** Vendor splitting (`react-vendor`, `ui-vendor`, `state-vendor`) for optimal caching.
- **Bundle Analysis:** Visualizer report generated in `dist/bundle-analysis.html`.

#### Developer Experience

- **Dev Playground:** Built-in UI showcase at `/dev/ui` (Development only).
- **VS Code Integrated:** Pre-configured `.vscode` settings, extensions recommendations, and snippets.
- **Linting:** ESLint (Flat Config) + Prettier + Import Sorting.
- **Git Hooks:** Husky + Lint Staged + Commitlint to enforce quality.
- **Comprehensive Testing:** Vitest with React Testing Library

### 🛠 Project Structure

```
src/
  components/
    common/          // ErrorBoundary
    features/        // Feature components (FeedbackForm, FileUploader, TermsOfUseModal)
    layout/          // Header, Footer, Main
    ui/              // Shadcn UI components
  hocs/              // Custom HOCs (e.g. WithSuspense)
  hooks/             // Custom hooks
  lib/
    converters/      // 1C XML conversion logic
    parsers/         // Bank statement parsers (Monobank, etc.)
    services/        // Firebase services
  pages/             // Route-level components (Lazy loaded)
    ConverterPage/   // Main conversion interface
    DevPlayground/   // UI Kit showcase (Dev only)
    NotFoundPage/    // 404 page
  router/            // React Router setup
  store/             // Zustand store with utilities
  test/              // Vitest setup and helpers
  main.tsx           // App entry point
```

### 🚦 Getting Started

1.  **Clone & Install:**

    ```bash
    # Ensure you are on Node 24 (use nvm)
    nvm use
    npm install
    ```

2.  **Environment Setup:**

    Create a `.env.local` file with your Firebase configuration (optional for development):

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

    > Note: The app works without Firebase config—feedback submission will be simulated in development mode.

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    > Open <http://localhost:3000> to see the app.
    > Open <http://localhost:3000/dev/ui> to see the UI Playground.

4.  **Production Build:**
    ```bash
    npm run build
    ```
    > Generates optimized, compressed, and analyzed assets in `dist/`.

### 📜 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server                |
| `npm run build`   | Type-check & Build with Oxc + Brotli |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |
| `npm run format`  | Format codebase with Prettier        |
| `npm run test`    | Run Unit Tests (Vitest)              |

### 🔒 Privacy & Security

- **Local Processing:** All file conversions happen entirely in your browser
- **No Data Transmission:** Your financial data never leaves your device
- **Terms of Use:** Comprehensive legal protection included
- **MIT License:** Open source and transparent

### 🤖 CI Pipeline

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every Push/PR:

1.  Installs dependencies (cached).
2.  Runs **Linter**.
3.  Checks **Formatting**.
4.  Runs **Tests**.

### 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Made in Ukraine 🇺🇦**
