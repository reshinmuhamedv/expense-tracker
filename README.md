# Expense Tracker

A simple and responsive web application to track daily expenses, view a monthly spending summary, and filter expenses by category, title, or date range. 

This project was built as a software engineering practical assignment using a React frontend and a Node.js/Express backend, backed by a hosted PostgreSQL database.

---

## 📸 Screenshots

![Dashboard View](./screenshots/dashboard.png)

---

## ⚙️ How to Run

This project is structured as a monorepo with a `client` (React + Vite) and a `server` (Node.js + Express). 

> [!NOTE]
> A local PostgreSQL installation is **NOT** required. The application is pre-configured to connect to a hosted Neon PostgreSQL database instance.

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a `.env` file in the `server` directory and add the following database connection string:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://neondb_owner:npg_We1gFHDLG4Qa@ep-delicate-wildflower-ap0xxsbx-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
4. Initialize the database schema (this runs the SQL script to create the table and indexes):
   ```bash
   node initDb.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The client will run on `http://localhost:5173`. A Vite proxy is configured to automatically route `/api` calls to the Express backend.

---

## 🛠️ Stack Choices & Tradeoffs

### Frontend: React + Vite + Vanilla CSS
* **Choice:** React was chosen for component-based state management, combined with Vite for fast builds and hot reloading. Vanilla CSS is used for custom, lightweight styles without the setup overhead of CSS-in-JS or large CSS frameworks.
* **Tradeoffs:** Since this is a utility dashboard designed for user interaction rather than a public-facing landing page, a traditional Single Page Application (SPA) was preferred over a server-side rendered (SSR) framework like Next.js. This keeps the deployment simple and state updates responsive.

### Backend: Node.js + Express
* **Choice:** A lightweight Express setup organized with a simple MVC-like structure (Models, Controllers, Routes) for clean separation of concerns.
* **Tradeoffs:** Express does not enforce strict structure like NestJS. However, for a standard CRUD app with a small set of API endpoints, this minimal approach avoids boilerplate code and keeps the backend easy to navigate.

### Database: Hosted Neon PostgreSQL
* **Choice:** Neon PostgreSQL provides a fully managed, serverless database that integrates cleanly with our backend without requiring local database configuration.
* **Tradeoffs:** Schema modifications require explicit SQL migrations, unlike NoSQL databases (e.g., MongoDB). However, relational databases are ideal for financial records where strict data integrity constraints, data relationships, and stable aggregations are paramount.

---

## 📋 What's Implemented

* **Full CRUD Functionality:** Add new expenses, edit all fields of an existing expense, and delete expenses.
* **Monthly Spending Summary:** Computes the total spending and category breakdown (with percentage indicators) specifically for the current month.
* **Search & Filters:** Real-time search by title, category filtering, and date range filtering.
* **Decoupled Summary State:** The monthly summary calculations are independent of the search filter state; filtering the list does not alter your actual monthly spending metrics.
* **Responsive Layout:** Designed to work smoothly on both desktop tables and mobile card layouts.
* **Database Indexes:** Indexes added on `date` and `category` fields to speed up common filter queries.

---

## 🛡️ Edge Cases Handled

* **Date Range Normalization:** If a user selects a "From" date that is later than the "To" date in the filter bar, the frontend automatically swaps the dates to prevent empty query results.
* **Title Whitespace Sanitization:** Empty titles or titles consisting solely of spaces are caught by both client-side and server-side validators and rejected.
* **Amount Constraints:** The application ensures expense amounts are positive numbers (`> 0`) on both the frontend form validation and backend database schema validation level.
* **Robust Input Validation:** Form submits are validated for numeric values, date formats, and calendar validity (e.g., rejecting invalid calendar days).
* **SQL Injection Prevention:** All database queries utilize parameterized SQL queries (`$1`, `$2`, etc.) to prevent database security risks.

---

## ⏭️ Skipped Features

* **Multi-User Authentication:** User login and personal accounts were skipped to keep the submission focused on the core CRUD functions and form state edge cases. A multi-user structure can be implemented by adding authentication middleware and linking expenses to a `user_id`.
* **Multi-Currency:** Formatted to static INR (`₹`) to focus code complexity on core components.

---

## ⚠️ Known Limitations

* **Numeric Overflow Range:** The PostgreSQL column type is `NUMERIC(12, 2)`, which caps single expense amounts to `9,999,999,999.99`. Entering values beyond 10 billion triggers a database error which is caught and displayed to the user as a generic error toast rather than a field-specific validation block.
* **Client-Side Note Textarea:** The backend restricts notes to 1,000 characters. Currently, the client textarea relies on the server's error message toast if this limit is exceeded, rather than hard-blocking the keyboard input with a frontend `maxLength={1000}` attribute.
