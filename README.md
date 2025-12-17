# Xandeum pNode Analytics Platform

![Xandeum Analytics Platform](./xandeum-dashboard/public/hero-img.png)

A comprehensive analytics solution designed to monitor, track, and visualize the performance of Xandeum pNodes. This monorepo houses both the high-performance backend synchronization service and the interactive frontend dashboard.

## 🚀 Overview

The **Xandeum pNode Analytics Platform** provides real-time insights into the Xandeum network. It consists of two main components:

1.  **Analytics Backend (`xandeum-analytics`)**: A robust API built with Hono and Prisma that synchronizes pNode data, manages network state, and serves analytics endpoints.
2.  **Analytics Dashboard (`xandeum-dashboard`)**: A modern, responsive web application built with Next.js and Shadcn UI that visualizes network health, node distribution, and performance metrics.

## 🛠 Tech Stack

### Backend (`xandeum-analytics`)
-   **Runtime**: Node.js
-   **Framework**: [Hono](https://hono.dev) - Fast, lightweight web standard edge-ready web framework.
-   **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/)).
-   **Caching**: Redis (via [Upstash](https://upstash.com/)).
-   **Validation**: Zod & OpenAPI.
-   **Logging**: Pino.

### Frontend (`xandeum-dashboard`)
-   **Framework**: [Next.js 16](https://nextjs.org) (App Router).
-   **UI Library**: [Shadcn UI](https://ui.shadcn.com) & [Radix UI](https://www.radix-ui.com/).
-   **Styling**: Tailwind CSS.
-   **Maps**: React Simple Maps.
-   **State Management**: Zustand & TanStack Query.
-   **Wallet Integration**: Solana Wallet Adapter.

## 📂 Project Structure

```bash
├── xandeum-analytics/    # Backend API & Sync Service
│   ├── src/
│   │   ├── routes/       # API Routes (pNodes, etc.)
│   │   ├── lib/          # Database, Redis, and Utility clients
│   │   └── index.ts      # Server entry point
│   └── prisma/           # Database Schema & Migrations
│
└── xandeum-dashboard/    # Frontend Application
    ├── app/              # Next.js App Router pages
    ├── components/       # Reusable UI components
    └── public/           # Static assets (images, icons)
```

## ⚡ Getting Started

### Prerequisites
-   **Node.js** (v20+ recommended)
-   **pnpm** (Package manager)
-   **Docker** (Optional, for running databases locally)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd xandeum-analytics
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure environment variables:
    ```bash
    cp .env.example .env
    # Edit .env with your Database and Redis credentials
    ```
4.  Run database migrations:
    ```bash
    pnpm migrate
    ```
5.  Start the development server:
    ```bash
    pnpm dev
    ```

### Frontend Setup

1.  Navigate to the dashboard directory:
    ```bash
    cd xandeum-dashboard
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Start the development server:
    ```bash
    pnpm dev
    ```
    The dashboard will be available at `http://localhost:3000`.


## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

If you run a modified version of this software **as a web service**,  
you are **legally required** to make your source code public.
