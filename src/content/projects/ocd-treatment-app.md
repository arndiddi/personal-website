---
title: OCD Treatment App
summary: A web app that predicts OCD severity from symptom data and suggests a personalized starting point for treatment.
status: In progress
dates: Jul 2026 – Present
role: Solo builder · product, data, and engineering
stack: [Python, SQL, Power BI, Streamlit, OpenAI API]
outcome: Targeting a 20% lift in prediction accuracy over baseline
featured: true
order: 1
---

## The problem

OCD treatment planning is often generalized rather than tailored to the person in front of the clinician. Two people with the same diagnosis can present very differently, and the first few months of care can go toward figuring out what fits. I wanted to see whether symptom data could give patients and clinicians a clearer, more personalized starting point.

## Who it's for

- **Clinicians**, who need a quick, explainable read on severity and likely-effective treatment directions.
- **Patients**, who benefit from understanding *why* a direction is being suggested, in plain language rather than model output.

## Key product decisions

1. **Let the data decide what gets built.** Before adding model features, I used SQL and Power BI to analyze the dataset and found 3+ predictors that carry most of the signal. Those findings now drive which inputs the app asks for and which features get prioritized.
2. **Ship an interface, not a notebook.** A model nobody can use isn't a product. I'm building the front end in Streamlit so the prediction is something a person can actually interact with.
3. **Make results explainable.** The OpenAI API turns model outputs into readable explanations, because a severity score with no context isn't something a patient can act on.

## How I'm measuring it

The north-star for the model is a **20% improvement in prediction accuracy** over a baseline approach. On the product side, the bar is whether someone without a data background can read the output and understand what to do next.

## What I'm thinking about next

- Guardrails and clear language that this supports, and doesn't replace, a clinician's judgment.
- Privacy expectations for sensitive health data, before anything leaves a prototype.
- What a lightweight feedback loop with real clinicians would look like.
