---
title: Fitness Plan Builder (Claude Skill)
summary: A Claude skill that runs a short coaching interview and builds a personalized, research-backed workout and diet plan.
status: Shipped
dates: Aug 2026
role: Solo builder · product and prompt/skill design
stack: [Claude Skills, Web Search, Excel / Word output]
outcome: Free alternative to paid coaching apps
links:
  - label: GitHub
    href: https://github.com/arndiddi/fitness-plan-builder
order: 5
---

## The problem

I learned this one the hard way: I trained for strength for most of a year before realizing my actual goal fit hypertrophy training better. Generic plans don't ask the right questions up front, and personalized coaching costs money.

## Key product decisions

1. **Interview flow, not a form.** The skill asks about the goal first, then training style, then logistics, then nutrition, instead of a 20-question wall up front.
2. **Ground it in current research.** It uses web search for things like protein intake, training volume, and deloads, rather than relying on stale rules of thumb.
3. **Deliver something usable.** The plan comes back as a spreadsheet with a fillable progress-log tab, or as a Word doc, with a real progression scheme matched to the user's days per week, equipment, and injuries.
4. **State the limits.** No medical advice and no guessing when information is missing; it tells users when to talk to a professional.

## What I learned

Ordering questions is a product decision. Asking the goal first changes every question after it, and makes the whole experience feel shorter.
