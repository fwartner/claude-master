---
name: ux-researcher-designer
description: When the user needs user research methodologies, persona development, journey mapping, usability testing plans, or information architecture analysis.
---

# UX Researcher & Designer

## Overview

Apply systematic UX research and design methods to understand users, validate assumptions, and create evidence-based designs. This skill covers the full research-to-design pipeline: discovery research, persona creation, journey mapping, information architecture, usability testing, and heuristic evaluation.

## Process

### Phase 1: Discovery Research
1. Define research objectives and questions
2. Select appropriate research methods
3. Recruit participants (5-8 per segment for qualitative)
4. Conduct research sessions
5. Synthesize findings using affinity mapping

### Phase 2: Analysis & Modeling
1. Create user personas from research data
2. Map user journey for key scenarios
3. Define information architecture
4. Identify pain points and opportunities
5. Prioritize using impact/effort matrix

### Phase 3: Design Validation
1. Create testable prototypes (low or high fidelity)
2. Plan usability testing sessions
3. Conduct tests with 5+ participants
4. Analyze results and iterate
5. Document findings and recommendations

## Research Methods

### Generative (Discovery) Methods
| Method | When to Use | Participants | Duration |
|---|---|---|---|
| User Interviews | Understanding motivations, behaviors, pain points | 5-8 per segment | 45-60 min each |
| Contextual Inquiry | Observing users in their natural environment | 4-6 | 1-2 hours each |
| Diary Studies | Longitudinal behavior patterns | 10-15 | 1-4 weeks |
| Surveys | Quantitative validation of qualitative findings | 100+ | 5-10 min |
| Focus Groups | Exploring attitudes and preferences | 6-10 per group | 60-90 min |

### Evaluative Methods
| Method | When to Use | Participants | Duration |
|---|---|---|---|
| Usability Testing | Validating designs against tasks | 5-8 | 30-60 min each |
| A/B Testing | Comparing two design variants | 1000+ per variant | 1-4 weeks |
| Card Sorting | Organizing information architecture | 15-30 | 20-30 min |
| Tree Testing | Validating navigation structure | 50+ | 10-15 min |
| First Click Testing | Evaluating initial user instincts | 30+ | 5-10 min |
| Heuristic Evaluation | Expert review without users | 3-5 evaluators | 1-2 hours |

### Interview Guide Template
```
1. Introduction (5 min)
   - Thank participant, explain purpose
   - Get consent for recording
   - "There are no wrong answers"

2. Warm-up (5 min)
   - Background questions about role/context
   - Current tools and workflows

3. Core Questions (30 min)
   - Open-ended questions about behaviors
   - Follow-up probes: "Tell me more about..."
   - Critical incident: "Describe a time when..."
   - Avoid leading questions

4. Wrap-up (5 min)
   - "Is there anything I didn't ask that you think is important?"
   - Thank and explain next steps
```

## Persona Template

```markdown
# [Persona Name]

## Demographics
- Age: [range]
- Occupation: [role]
- Technical proficiency: [low/medium/high]
- Usage frequency: [daily/weekly/monthly]

## Goals
1. Primary goal: [what they're trying to achieve]
2. Secondary goal: [supporting objective]
3. Tertiary goal: [nice-to-have]

## Pain Points
1. [Frustration with current process]
2. [Unmet need]
3. [Workaround they've created]

## Behaviors
- [How they currently solve the problem]
- [Tools and methods they use]
- [Decision-making patterns]

## Quotes (from research)
- "[Verbatim quote that captures their perspective]"
- "[Another representative quote]"

## Scenario
[A paragraph describing a typical day/task where they'd use the product]
```

## Journey Map Structure

```
Stages:     Awareness → Consideration → Onboarding → Usage → Advocacy
                |              |             |          |          |
Actions:   [What they do at each stage]
                |              |             |          |          |
Thoughts:  [What they're thinking]
                |              |             |          |          |
Emotions:  [😤 😐 😊 mapped to each stage]
                |              |             |          |          |
Pain Points: [Friction and frustration points]
                |              |             |          |          |
Opportunities: [Design opportunities to improve]
                |              |             |          |          |
Touchpoints: [Channels and interfaces involved]
```

### Journey Map Elements
- **Moments of Truth**: Critical points where users form lasting impressions
- **Service Blueprints**: Front-stage actions mapped to back-stage processes
- **Emotion Curve**: Visual line showing emotional highs and lows
- **Gap Analysis**: Difference between current and desired experience

## Heuristic Evaluation (Nielsen's 10)

| # | Heuristic | What to Look For |
|---|---|---|
| 1 | Visibility of system status | Loading indicators, progress bars, save confirmations |
| 2 | Match with real world | Natural language, familiar metaphors, logical order |
| 3 | User control and freedom | Undo, cancel, back, escape hatches |
| 4 | Consistency and standards | Same action = same result, platform conventions |
| 5 | Error prevention | Confirmation dialogs, constraints, smart defaults |
| 6 | Recognition over recall | Visible options, contextual help, recent history |
| 7 | Flexibility and efficiency | Shortcuts, customization, bulk actions |
| 8 | Aesthetic and minimalist design | No unnecessary information, clear hierarchy |
| 9 | Help users with errors | Plain language errors, specific cause, suggest fix |
| 10 | Help and documentation | Searchable, task-oriented, concise |

### Severity Rating Scale
| Rating | Description | Action |
|---|---|---|
| 0 | Not a usability problem | No action |
| 1 | Cosmetic only | Fix if time allows |
| 2 | Minor problem | Low priority fix |
| 3 | Major problem | High priority, fix before launch |
| 4 | Usability catastrophe | Must fix immediately |

## A/B Testing Methodology

### Process
1. **Hypothesis**: "Changing [X] will [improve/decrease] [metric] because [reason]"
2. **Sample size**: Calculate minimum sample (use power analysis, typically 95% confidence, 80% power)
3. **Duration**: Run for at least 2 full business cycles (minimum 2 weeks)
4. **Single variable**: Test one change at a time
5. **Analysis**: Statistical significance check (p < 0.05)

### Common Metrics
- **Task success rate**: % of users completing the target task
- **Time on task**: Duration to complete a specific action
- **Error rate**: Number of mistakes per task
- **System Usability Scale (SUS)**: Standardized questionnaire (68 = average)
- **Net Promoter Score (NPS)**: Likelihood to recommend (0-10 scale)
- **Customer Effort Score (CES)**: Ease of experience (1-7 scale)

## Information Architecture

### Card Sorting Analysis
- **Open sort**: Users create their own categories (discovery)
- **Closed sort**: Users sort into predefined categories (validation)
- **Hybrid sort**: Predefined categories with ability to add new ones
- Analysis: Similarity matrix, dendrogram, category agreement

### Navigation Patterns
- **Global navigation**: Persistent across all pages
- **Local navigation**: Within a section
- **Contextual navigation**: Related content links
- **Utility navigation**: Settings, account, help
- **Breadcrumbs**: Location within hierarchy

## Deliverables Checklist

- [ ] Research plan with objectives and methods
- [ ] Participant recruitment screener
- [ ] Interview/test script
- [ ] Affinity map of findings
- [ ] Personas (2-4 primary)
- [ ] Journey map for key scenario
- [ ] Information architecture diagram
- [ ] Usability test report with severity ratings
- [ ] Prioritized recommendations with evidence

## Anti-Patterns

- Designing based on assumptions without user research
- Testing with colleagues instead of real users
- Asking users what they want (observe what they do instead)
- Confirmation bias: seeking evidence that supports existing beliefs
- Too many personas (keep to 2-4 primary)
- Skipping the synthesis step (going straight from interviews to design)
- Running A/B tests without sufficient sample size

## Skill Type

**FLEXIBLE** — Select and combine research methods based on project constraints (budget, timeline, access to users). Lightweight methods are acceptable when full research is impractical.
