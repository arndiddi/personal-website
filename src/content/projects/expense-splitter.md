---
title: Expense Splitter (Claude Skill)
summary: A free Claude skill that tracks shared bills and settles up a group in the fewest possible payments, an alternative to paywalled splitting apps.
status: Shipped
dates: Aug 2026
role: Solo builder · product and prompt/skill design
stack: [Claude Skills, Python, openpyxl]
outcome: Five split methods + debt simplification, free
links:
  - label: GitHub
    href: https://github.com/arndiddi/expense-splitter
order: 4
---

## The problem

Splitting costs with roommates or on a group trip is a solved problem, until you hit the features that popular apps put behind a premium plan. I wanted the useful parts for free, inside a tool I already use every day.

## Key product decisions

1. **Cover the real ways people split things.** Evenly, exact amounts, percentages, weighted shares (like rent by square footage), and itemized bills with tax and tip spread proportionally.
2. **Settle in the fewest payments.** Instead of everyone paying everyone back, the skill collapses the group's balances into the minimum number of transfers.
3. **Never let the AI do the math.** All arithmetic runs through a small Python script. The model structures the ledger; code computes the numbers. When real money is involved, reliability beats cleverness.
4. **Ask instead of assume.** If something that affects money is unclear (like whether a bill has already been paid), the skill asks. If a user asks for a "fair" split, it shows its reasoning and offers to redo it with their numbers.
5. **Be honest about memory.** The README explains exactly what persists across chats and what doesn't, and the skill never adds to a long-running ledger without asking.

## What I learned

The hardest design work was deciding *when the assistant should stop and ask*. Too many questions feels like a form; too few and it confidently gets someone's rent wrong.
