---
title: Sneaks
slug: sneaks
category: apps
categories:
  - apps
role: Full-Stack Engineer
date: '2026-07-01'
selectedProject: true
links:
  appstore: 'https://apps.apple.com/us/app/sneaks-collection-tracker/id6786520018'
  live: 'https://sneaks-web.vercel.app'
description: >-
  A sneaker collection tracker on the App Store: a private iOS app for logging
  what you own, and a public web page for showing it off.
tech:
  - React Native
  - Next.js
  - Supabase
  - style-dictionary-dlite-tokens
image: /images/projects/sneaks-web-share.jpg
---

Sneaks is a sneaker collection tracker split across two apps that share one Supabase backend: an iOS app shipped on the App Store where I log what I own, and a public read-only companion site anyone can visit via a permanent share code: no login, no account, just a link to my shelf.

I treat it as one product, not two separate builds. The mobile app is Expo + Expo Router; the web app is Next.js App Router; a shared `packages/theme` and `packages/supabase` keep both talking to the same tables and the same brand instead of drifting into their own conventions.

![Sneaks public share page: a hero shot of the latest addition (a New Balance 990v3) with pairs/wears/brands stats underneath, and a Collection/Wishlist tab bar up top](/images/projects/sneaks-web-share.jpg)

Anyone with my share link lands here: no login, just the collection as of the last time I updated it. Same brand, same data, zero setup for the visitor.

## What the owner sees

The mobile app is where the actual collection management happens: 29 pairs and counting, each with brand, model, colorway, size, and a wear count, sorted newest-first with filter and sort controls.

![Scrolling the Collection tab's two-column grid of sneaker cards, then tapping into a Nike Dunk Low SB to see its full detail view: size, box status, and a wear counter](/images/projects/sneaks-mobile.gif)

Wishlist is the same card layout, minus the price tag: three grails I don't own yet, waiting for the day I stop being reasonable about resale prices.

![Wishlist tab showing three wanted pairs, all Air Jordan 11 colorways: Rare Air, Gamma Blue, and Bred](/images/projects/sneaks-wishlist.png)

## A backend shared on purpose

Rather than spin up a dedicated Supabase project, Sneaks lives in the same "Hobby Lobby" project as two of my other apps (Survivor App and Listings Tracker), sharing one `auth.users` table across all three. Every table is prefixed `sneaks_` to guarantee no collision, a convention borrowed from Listings Tracker.

The interesting constraint is the public share page: anyone with the code can view a collection with zero auth. Survivor App's own migration history is the cautionary tale here: it originally shipped a blanket `FOR SELECT USING (true)` policy and had to walk it back once it was clear the anon key could read (or write) any row, not just the one behind a known code. Sneaks never has that exposure: every public read goes through a `SECURITY DEFINER` RPC (`sneaks_get_*_for_code`) that joins through the share code explicitly, and fields like purchase price and location are simply left out of the RPC's return columns rather than hidden behind row-level policy.

![Profile screen's share-link card: a permanent share URL with Copy Share Link and Share buttons, and a note that the link never exposes purchase price or where an item was bought](/images/projects/sneaks-share-card.png)

That card is the entire security model made visible: one permanent link, generated server-side, that the RPC (not a client-side filter) decides what to reveal.

## A design system with an opinion

Sneaks runs on the same `style-dictionary-dlite-tokens` package that themes this site and Puente Collect, but its brand file does something none of the others do. Every other brand I've built sets primary, brand, and action color to the same hue. Sneaks splits them on purpose: a near-black/near-white "ink" for identity (the splash screen, the chrome) paired with a single vivid red reserved only for anything interactive. Buttons, chips, tabs, and the FAB are the only things that get to be red. It was a deliberate bet that a collection app should feel like a quiet, monochrome shelf until something asks for a tap.

The web app inherits the same brand, down to the entry screen a visitor sees before they even have a code:

![Sneaks web landing page: a grid-lined background, the SNEAKS wordmark with a red dot, and a form to enter a share code](/images/projects/sneaks-web-landing.jpg)

## Stack

Expo + Expo Router for mobile, Next.js App Router for web (CSS Modules only, no Tailwind), Supabase for auth/Postgres/storage across both, pnpm workspaces tying it together, and `style-dictionary-dlite-tokens` for the shared design layer, the same package powering this portfolio. The iOS app releases through EAS Build and Submit with fully automated version bumps: every production build gets a fresh version and build number with zero manual steps, then goes through standard App Store review.
