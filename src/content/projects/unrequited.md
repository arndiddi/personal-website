---
title: Unrequited
summary: See who doesn't follow you back on Instagram, privately. No login, nothing uploaded; it all runs in your browser.
status: Shipped
dates: Nov 2026
role: Solo builder · product, design, and build (with Lovable)
stack: [React, TanStack Start, Tailwind CSS, Lovable]
outcome: Live app · zero data leaves the user's device
links:
  - label: Live app
    href: https://follow-return-radar.lovable.app
  - label: GitHub
    href: https://github.com/arndiddi/follow-return-radar
featured: true
order: 3
---

## The problem

"Who doesn't follow me back?" is one of the most common questions people have about Instagram, and the tools that answer it usually ask for your Instagram password or have you upload your data to someone else's server. That's a lot of trust to hand over for a simple list.

## Who it's for

Anyone curious about their follower relationships who *doesn't* want to give a third party their login or their data.

## Key product decisions

1. **Privacy is the product.** Instead of logging in, users drop in Instagram's official data export. The file is opened and compared entirely inside the browser tab and is never uploaded. The code is open source, so users can verify that claim themselves.
2. **Three lists, not one.** Beyond "not following you back," the app also shows who *you* don't follow back and your mutuals, because the question people actually have is about the whole relationship.
3. **Lower the activation cost.** Getting an Instagram export takes several steps, so the README and app walk through them precisely, and a **Try sample data** button lets people see the value before doing any work.
4. **Let users take the data with them.** Each list can be sorted (oldest, newest, A–Z) and downloaded as a CSV.

## What I'd watch

- **Drop-off between landing and first upload.** The export process is the biggest friction point, and sample data is my bet to reduce it.
- **Trust signals.** Whether "runs in your browser" and the open-source link are enough to reassure people.

## What I learned

Building with an AI app builder (Lovable) moved the hard part from *writing code* to *making product calls*: what to leave out, how to explain the export steps, and how to earn trust on the first screen.
