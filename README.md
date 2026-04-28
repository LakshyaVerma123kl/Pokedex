# Pokedex Lite

A responsive, highly interactive "Pokedex Lite" web application built for the Frontend Developer Assignment.

## Features

- **Data Fetching:** Real-time data from PokeAPI with graceful loading states.
- **Listing & Basic UI:** Beautiful grid layout displaying Pokemon with official artwork sprites.
- **Search:** Real-time client-side search across Pokemon.
- **Filtering by Type:** Dynamic type pills allowing users to quickly filter the Pokemon list.
- **Pagination:** Handles pagination effortlessly using Next.js client-side state.
- **Favorites:** Fully persistent favoriting system (using `localStorage`).
- **Detail View:** Deep dive modal showing stats, abilities, and dimension metrics with smooth animations.
- **Animations:** Premium Framer Motion UI transitions, micro-interactions, and hover states.
- **Responsive:** Works perfectly on mobile, tablet, and desktop viewports.

## Technologies Used & Why

1. **Next.js (App Router, Client-side rendering):** Chosen for its robust structure, ease of routing, and to keep the door open for server-side enhancements (SSR) in the future.
2. **React 19:** Utilized for managing complex UI states (search, filters, favorites, modal) seamlessly.
3. **Tailwind CSS v4:** Used for styling. It allows for rapid, flexible, and consistent UI design without leaving the component files. Specifically helpful for dark mode and responsive layouts.
4. **Framer Motion:** Added to elevate the UI with premium, subtle animations that make the application feel alive and dynamic.
5. **Lucide React:** Chosen for crisp, consistent, and customizable SVG icons.

## Running the Project Locally

### Prerequisites
- Node.js 18+ installed

### Setup Instructions

1. **Clone the repository / Navigate to the folder**
   ```bash
   cd "New folder (5)" # Or your designated project root
   ```

2. **Install Dependencies**
   Run the following command to install all necessary packages:
   ```bash
   npm install
   ```

3. **Start the Development Server**
   Start the local dev server:
   ```bash
   npm run dev
   ```

4. **View the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Challenges Faced & Solutions

1. **Handling Pagination with Search/Filters:**
   - *Challenge:* PokeAPI doesn't support searching or complex filtering alongside pagination natively via server queries.
   - *Solution:* To provide a fast "Lite" experience, filtering by type triggers a fetch for all Pokemon of that type, which is then paginated locally. A general search fetches a larger batch locally and filters them, avoiding excessive network calls while maintaining a snappy user experience.

2. **Image Loading from External Domains:**
   - *Challenge:* Next.js `next/image` requires external domains to be whitelisted for optimization.
   - *Solution:* Used the `unoptimized` prop specifically for PokeAPI's raw sprite URLs to guarantee they render securely without complicated configuration, leveraging direct CDN speeds.

3. **Hydration Mismatch with `localStorage`:**
   - *Challenge:* When dealing with Next.js and persisting favorites via `localStorage`, reading it immediately on render can cause hydration mismatches between the server-rendered shell and client content.
   - *Solution:* Favorites are loaded inside a `useEffect` hook, ensuring the client takes over safely after the initial mount, preventing UI flickering or Next.js console errors.
