---
title: Listings Tracker
slug: listings-tracker
category: prototypes
role: Full-Stack Engineer
date: '2026-04-01'
selectedProject: false
links:
  live: 'https://listings-tracker-three.vercel.app/'
  github: 'https://github.com/hopetambala/listings-tracker'
  repo: 'https://github.com/hopetambala/listings-tracker'
image: /images/projects/listings-tracker.gif
description: >-
  A scrappy full-stack tool built to track listings, the kind of itch you
  scratch on a weekend.
tech:
  - Next.js
  - Supabase
  - TypeScript
---

We were house hunting and I couldn't find a simple way to track everything in one place, not just favorites, but actual price history. When did this listing drop $20k? Is that "reduced" badge new or has it been sitting there for months? Most tools answer one of those questions. None answered all of them in a way that felt like mine.

So I built one. Listings Tracker is a full-stack property tracking app with two tiers: an admin side for managing the full listing database, and a user side for people I share access codes with: family, my wife, the people actually in the car with me at open houses.

## The Access Model

I didn't want to build full OAuth for something this small, but I also didn't want the whole thing to be public. The compromise: 4-digit access codes. Admins get email/password auth. Everyone else gets a code that unlocks their view for 24 hours. Simple, doesn't require anyone to create an account, still keeps the data private. Row-level security in Supabase handles the data isolation.

## The Part That Made It Useful

Price history with visual badges. Every listing shows whether the price went up, down, or held since the last update, color coded, immediately visible. You can record listing price, current price, and sold price separately, so the whole arc of a property's market life is in one place. Bulk CSV import meant I could seed it with a dozen listings at once without clicking through a form twelve times.

## Stack

Next.js 15 (App Router), React 19, TypeScript, Supabase for database/auth/storage, custom dlite web components for UI, CSS custom properties throughout. No Tailwind.
