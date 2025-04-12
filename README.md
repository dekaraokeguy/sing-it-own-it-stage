
# Sing It Own It - Dean De Karaoke Guy Platform

A vibrant karaoke platform for "Dean De Karaoke Guy" featuring the "Sing It Own It Countdown" where users can upload performances, vote on their favorites, and engage with the community.

## About the Project

This platform serves as a hub for karaoke enthusiasts, allowing them to:

- View and vote on performances in the "Sing It Own It Countdown"
- Upload their own karaoke performances
- Browse a photo gallery from past events
- Access songbooks for practice
- Learn about Dean De Karaoke Guy and his services
- Contact for event bookings

The tagline "No Shame If Yuh Buss" encapsulates the platform's spirit of fun and self-expression.

## Technology Stack

- React with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Lucide React for icons
- Various UI components from shadcn/ui
- Designed for Supabase backend integration

## Database Schema

The platform is designed to work with the following Supabase database schema:

- **users**: Stores user information with anonymous login codes
- **videos**: Stores performance videos with titles, URLs, and vote counts
- **votes**: Records individual user votes (1-5 stars) for performances
- **sponsors**: Manages sponsor information for display in the footer
- **photos**: Stores gallery photos from events
- **songbooks**: Stores downloadable songbook files

## Features

- Caribbean-inspired vibrant design with animations
- Mobile-responsive layout
- QR code sharing for performances
- Star rating system for voting
- File uploads for videos, photos, and songbooks
- Anonymous login system with 7-digit codes

## Development

This project was created with Lovable AI and is designed for easy connection to Supabase for database functionality.

To run the project locally:

```sh
npm install
npm run dev
```

## Deployment

The site can be deployed using Vercel, Netlify, or any React-compatible hosting platform. For full functionality, it should be connected to a Supabase backend with the appropriate schema.

