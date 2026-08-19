---
title: HablaLora
slug: hablalora
category: apps
categories:
  - apps
role: Full-Stack Engineer
date: '2026-05-01'
selectedProject: true
links:
  appstore: 'https://apps.apple.com/us/app/hablalora/id6762737766'
image: /images/projects/habladora.gif
description: >-
  A Spanish verb conjugation trainer for serious learners, built with Expo and
  powered by the same dLite design tokens as this site.
tech:
  - React Native
  - Expo
  - style-dictionary-dlite-tokens
  - Zustand
---

When I went to the Peace Corps, I had a great opportunity to learn spanish. However, I've lost so much of it! One of the biggest things I want to practice and remaster is how to conjugate 500 of the most commonly used verbs in the spanish language across all tenses! Most conjugation apps are either too gamified to take seriously or too dry to stick with. HablaLora is the one I actually wanted to use, focused on pattern recognition, audio pronunciation, and deliberate practice across all major tenses.

## What it does

The app is built around a quiz engine that lets you drill conjugation patterns rather than random vocabulary. You pick your tenses (present, preterite, imperfect, subjunctive…), filter by irregular pattern class (stem-changing, yo-irregular, future-stem, fully irregular), and optionally limit to your own saved verb list. Every answer gets native-speaker audio from a bundled library of several hundred Mexican Spanish mp3s. No network required.

There's also a structured Learn side: each tense has a rules page explaining the pattern and an examples page showing it across several verbs. The Library tab is a searchable, filterable verb database; tap any entry for a full conjugation table. Progress is tracked across sessions so you can see your accuracy by tense and pattern over time.

## Powered by my design system

The same `style-dictionary-dlite-tokens` package that themes this portfolio site runs the app's color system. The React Native distribution ships typed JavaScript token objects (via the `rn/` path of the package) that the app's `useTheme()` hook consumes directly. The exact same primitive and semantic token names, just resolved to React Native color values instead of CSS custom properties.

Every brand (Survivor, Puente, Kooky, and their variants) and both light and dark modes are available in-app, and users can switch from the Settings tab. The result is that a token change or a new brand in the dLite package propagates to both the web portfolio and the mobile app in the same release: one token layer, two surfaces.

## Stack

React Native 0.81 + Expo Router, TypeScript, Zustand for state, React Native Reanimated for the animated tab bar and quiz transitions, React Native Audio for pronunciation playback, and `style-dictionary-dlite-tokens` for the full design token layer.
