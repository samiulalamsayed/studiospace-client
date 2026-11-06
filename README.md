# StudioSpace — Creative Workspace & Studio Booking Platform

**Live Website:** https://studiospace-client-smoky.vercel.app

StudioSpace is a peer-to-peer platform where creators can discover, explore, and book creative workspaces such as photography studios, podcast rooms, sound stages, music suites, and art workshops.

## Features

- **Explore Studios:** Browse available creative workspaces with search and category filtering.
- **Studio Details:** View studio information, images, pricing, amenities, and host details.
- **User Authentication:** Secure registration and login with email/password and Google authentication.
- **Studio Management:** Hosts can add, update, and delete their studio listings.
- **Workspace Booking:** Users can book studios and manage their bookings.
- **Booking Management:** View booking details, check booking statuses, and cancel pending bookings.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Dark & Light Mode:** Switch between dark and light themes.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth, JWT
- **Backend:** Express.js
- **Database:** MongoDB
- **Notifications:** React Toastify
- **Deployment:** Vercel

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/samiulalamsayed/studiospace-client.git
   ```

2. Navigate to the project directory:

   ```bash
   cd studiospace-client
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file and configure the required environment variables:

   ```env
   BETTER_AUTH_URL=
   NEXT_PUBLIC_BETTER_AUTH_URL=
   BETTER_AUTH_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NEXT_PUBLIC_API_URL=
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

## Examiner Test Credentials

Use the following credentials to test the application:

- **Email:** rakib2002@gmail.com
- **Password:** 22dS123d

## Author

Developed as part of the Programming Hero Web Development Course assignment.

**Project Name:** StudioSpace