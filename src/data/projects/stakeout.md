---
title: StakeOut
slug: stakeout
category: prototypes
role: Full-Stack Engineer
date: '2026-05-01'
selectedProject: false
links:
  live: 'https://stakeout.vercel.app/'
  github: 'https://github.com/hopetambala/stakeout'
image: /images/projects/stakeout.gif
description: 'A full-stack weekend build, taken from idea to shipped app end to end.'
tech:
  - React
  - Three.js
  - Supabase
---

Imagine a situation where a rookie/independent is losing jobs. Not because his was bad but rather that their clients couldn't picture what the finished project would look like. He'd say "I'm thinking a 6-foot cedar privacy fence along the back" and they'd nod politely and then ghost him. The whole proposal lived entirely in their imagination, and imagination is unreliable.

That's the problem StakeOut was built to solve. Take a photo of the client's property, drop in construction elements  like fences, decks, patios, landscaping, structural additions and hand the client something they can actually react to. The whole thing should take under 5 minutes, work on a tablet, and require zero design training.

## The Headline Feature: 2.5D

Here's the part I'm most proud of. Most tools in this category let you do 2D *or* 3D, and they make you pick. StakeOut does both at once.

You design in 2D plan view - the client's satellite photo becomes your canvas, and you place elements on top of it like you're working from an aerial blueprint. That alone is already more useful than a verbal description. But then you hit **Live 3D**, and the same aerial photo tiles the ground plane of a Three.js scene. The elements you just placed extrude upward based on their real height (a 6-foot fence is taller than a 1.5-foot deck surface, obviously). You get a free-orbit 3D preview where the actual property photo is the ground. No other tool in this price range does that.

The sun slider moves shadows based on time of day. Four camera presets cover the most useful angles. And it all updates live as you drag elements around in 2D.

## The Problem It Started As

The real insight came from a Reddit thread I was reading lol someone posted in r/Construction asking for a simple tool to "take a photo of my client's house and show them what the fence/deck/patio will look like when I'm done." 46+ upvotes. Page after page of people agreeing that nothing like this existed at a price a solo contractor could justify.

The existing options were either $49–250/month (Houzz Pro, SketchUp), landscaping-only (iScape), or AI black boxes where you couldn't control placement precisely. The gap was obvious: all contractor types, simple enough to use on a sales call, honest-looking output that doesn't overpromise render quality.

## What "Honest-Looking" Means

StakeOut uses a blueprint aesthetic - all 41 construction elements are drawn as programmatic Konva.js canvas shapes, not SVG files or photos. Clean line weights, labeled elements, schematic fills. It's intentional. The tool isn't trying to fool anyone into thinking this is a photorealistic render. It's a design intent visualizer. Clients respond better to the delta (before vs. after) than to fake photorealism anyway, so the before/after drag slider became one of the most useful features.

## The Three-Phase Build

**Phase 1** was the PoC: pure frontend, no auth, no server, just build it and use it on a real job. The success metric was literally "put it in front of a client and see what happens." 3–5 weeks, ship it, learn.

**Phase 2** layered in everything that makes it a real product: Supabase auth (Google OAuth + email), save/load designs, shareable public links, PDF proposal export, the live 3D preview, measurement calibration, and contractor branding. This is where the technical surface area got interesting - syncing a Konva 2D canvas with a Three.js 3D scene in real time, handling perspective calibration via homography matrices for street-level photos, and building a PDF renderer that produces a 3-page branded proposal (aerial plan, 3D view, Bill of Materials).

**Phase 3** added the marketing layer - landing page, pricing page, PWA installability - plus proposal tool upgrades: per-element cost overrides, auto-generated BOM with quantities and unit costs, project notes, and smart snap alignment with amber guide lines.

## What I Learned

The perspective problem is real and under-discussed in this space. Placing flat elements on an angled street-level photo looks obviously wrong - a sticker on a photo. The PoC sidesteps it entirely by constraining to aerial/satellite photos (no perspective distortion when everything's viewed from directly above). Phase 2 adds 4-point homography calibration for street-level shots, but the aerial-first constraint was the right call for getting something usable fast.

The contractor portfolio angle is also more interesting than it first seemed. Saved designs aren't just data - they're a contractor's proof-of-work. The longer someone uses StakeOut, the more proposal history they accumulate, and the harder it is to walk away. That's a real moat that has nothing to do with features.

## Stack

React 19 + Vite + TypeScript, react-konva for the 2D canvas, Three.js + @react-three/fiber for 3D, Zustand v5 for state, Supabase for auth and persistence, jspdf for PDF export. 39 unit tests, Playwright e2e smoke tests. Installable as a PWA.
