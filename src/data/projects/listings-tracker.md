---
title: "Listings Tracker"
slug: "listings-tracker"
category: "prototypes"
role: "Full-Stack Engineer"
date: "2026-04-01"
selectedProject: false
links:
  live: "https://listings-tracker-three.vercel.app/"
  github: "https://github.com/hopetambala/listings-tracker"
  repo: "https://github.com/hopetambala/listings-tracker"
---

A house price tracking application built with Next.js, TypeScript, and Supabase. Track property listings, prices, and upload photos with an intuitive admin interface and secure user access codes.

## Features

- **Admin Dashboard**: Create properties, view market analysis, manage access codes
- **Bulk Upload**: Import multiple properties via CSV with auto-generated access codes
- **Price Tracking**: Record listing price, current price, and sold price with historical data visualization
- **Photo Gallery**: Upload and organize property photos by listing
- **Secure Access**: 4-digit access codes for users to view properties (localStorage + 24-hour expiry)
- **User Listings**: Users can add their own listings to the admin's property list
- **Visual Price Badges**: Dynamic badges showing recent price changes (increased/reduced) with color coding
- **Design System**: Modern UI built with dlite web components and design tokens

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: Supabase with PostgreSQL
- **Auth**: Supabase Auth (email/password for admins, 4-digit codes for users)
- **Storage**: Supabase Storage for photo uploads
- **Design**: Custom web components + style-dictionary tokens
- **Styling**: CSS custom properties (no Tailwind)

## Key Capabilities

- **Admin Features**: Create properties, generate access codes, view analytics, bulk upload CSV
- **User Features**: View properties, add listings, track prices, upload photos, edit property details
- **Access Control**: Row-level security (RLS) for data isolation, secure session management
- **Real-time Updates**: Immediate property list refresh after adding new listings or prices
