# Pokedex Lite

A responsive, interactive "Pokedex Lite" web application built with Next.js, Tailwind CSS, and Framer Motion.

## Features

### Mandatory
- **Data Fetching:** Real-time data from PokeAPI with graceful loading and error states.
- **Listing & Basic UI:** Beautiful grid layout displaying Pokemon with official artwork sprites.
- **Search:** Real-time client-side search across Pokemon names.
- **Filtering by Type:** Dynamic type filter pills for narrowing down the Pokemon list.
- **Pagination:** Handles pagination with Previous/Next controls and page indicators.
- **Favorites:** Fully persistent favoriting system using `localStorage`.
- **Detail View:** Modal view showing stats, abilities, weight, height, and type badges with animated stat bars.
- **Responsive Design:** Works perfectly on mobile, tablet, and desktop viewports.

### Bonus
- **User Authentication (OAuth):** GitHub OAuth login via NextAuth.js (Auth.js v5). Users can sign in and see their avatar in the header.
- **Animations:** Premium Framer Motion UI transitions, micro-interactions, hover effects, and animated stat bars.
- **Server-Side Rendering (SSR):** The initial 20 Pokemon and type list are fetched on the server for faster first loads and better SEO. The page is fully rendered before reaching the client.

## Technologies Used & Why

1. **Next.js 16 (App Router):** Chosen for its hybrid rendering model (SSR + client interactivity), file-based routing, and production-grade architecture.
2. **React 19:** Manages complex UI states (search, filters, favorites, modal) with hooks.
3. **Tailwind CSS v4:** Enables rapid, consistent styling with built-in dark mode and responsive utilities.
4. **Framer Motion:** Adds premium, subtle animations that make the app feel polished and dynamic.
5. **NextAuth.js (Auth.js v5):** Provides a simple, secure OAuth flow with GitHub as the provider.
6. **Lucide React:** Crisp, consistent, and customizable SVG icons.

## Running the Project Locally

### Prerequisites
- Node.js 18+ installed
- A GitHub OAuth App (for the authentication bonus feature)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pokedex-lite
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (for OAuth)**
   Copy the example env file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Create a GitHub OAuth App at [https://github.com/settings/developers](https://github.com/settings/developers):
   - Set the **Homepage URL** to `http://localhost:3000`
   - Set the **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`
   
   Then fill in `.env.local`:
   ```
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   AUTH_SECRET=your_auth_secret  # Generate with: npx auth secret
   ```

   > **Note:** The app works fully without OAuth configured — the sign-in button will simply not complete the flow.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **View the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Challenges Faced & Solutions

1. **Pagination with Search/Filters:**
   - *Challenge:* PokeAPI doesn't support searching or complex filtering alongside pagination natively.
   - *Solution:* Filtering by type fetches all Pokemon of that type and paginates locally. Search fetches a larger batch and filters client-side, maintaining a snappy user experience.

2. **Server-Side Rendering with Client Interactivity:**
   - *Challenge:* The page needs SSR for the initial load (SEO, performance) but also needs rich client-side interactivity (search, filters, favorites).
   - *Solution:* Split architecture — `page.tsx` is a Server Component that fetches initial data, then passes it to the `PokemonList` client component. The client component hydrates with server data and handles all subsequent interactions.

3. **Hydration Mismatch with `localStorage`:**
   - *Challenge:* Reading `localStorage` during SSR causes hydration mismatches since the server doesn't have access to browser storage.
   - *Solution:* Favorites are loaded inside a `useEffect` hook, ensuring the client takes over safely after the initial mount.

4. **Image Loading from External Domains:**
   - *Challenge:* Next.js `next/image` requires external domains to be whitelisted.
   - *Solution:* Used the `unoptimized` prop for PokeAPI sprite URLs and configured `remotePatterns` in `next.config.ts` for GitHub avatar URLs.
