---
title: AI Interview Question Generator
summary: A tool that generates role-specific technical and behavioral interview questions so candidates prep on what actually matters.
status: Shipped
dates: Feb 2025
role: Solo builder · product and engineering
stack: [Python, Hugging Face, JSON]
outcome: Cut prep time by 50% · +30% alignment with selected parameters
featured: true
order: 2
---

## The problem

Most interview prep runs on generic question banks. They don't adapt to the specific role, level, or focus a candidate cares about, so a lot of prep time goes to material that will never come up.

## Who it's for

Students and early-career candidates prepping for interviews for a specific role, who need relevant practice questions fast rather than a 300-question list.

## Key product decisions

1. **Start from the role, not the question bank.** The user picks the role and parameters first; questions are generated for that context using a Hugging Face model, covering both technical and behavioral prompts.
2. **Structured output over free text.** Responses come back as structured JSON, which made it possible to check whether each question actually matched what the user selected, and to render it cleanly in the UI.
3. **A dynamic UI that reflects the user's choices.** The Python interface updates around the selected parameters instead of making users re-enter context.

## Results

- **50% less prep time** for users, by replacing generic lists with tailored questions.
- **30% better alignment** between generated questions and user-selected parameters, which came directly from moving to structured outputs.

## What I learned

Defining the success metric (alignment with what the user asked for) *before* building told me which technical decision mattered most. Structured outputs weren't an engineering nicety; they were the feature.
