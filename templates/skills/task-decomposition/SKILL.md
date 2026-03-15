---
name: task-decomposition
description: When the user needs hierarchical task breakdown, dependency mapping, effort estimation, parallelization planning, or work breakdown structure creation.
---

# Task Decomposition

## Overview

Break complex tasks into manageable, well-defined subtasks with clear dependencies, effort estimates, and parallelization opportunities. This skill covers hierarchical work breakdown structures (WBS), dependency graph construction, critical path analysis, task sizing for sprint planning, and identification of tasks that can run concurrently. Essential for planning multi-step implementations, project estimation, and autonomous loop task selection.

## Process

### Phase 1: Scope Definition
1. Define the overall deliverable and acceptance criteria
2. Identify the boundaries (what is in scope, what is not)
3. Determine the decomposition granularity level
4. Identify stakeholders and their requirements
5. Establish constraints (time, resources, dependencies)

### Phase 2: Hierarchical Breakdown
1. Identify top-level work streams (epics or major components)
2. Break each work stream into features or milestones
3. Decompose features into implementable tasks
4. Apply the "2-hour rule" — no task should exceed 2 hours of focused work
5. Ensure each task has a clear definition of done
6. Verify MECE (Mutually Exclusive, Collectively Exhaustive) coverage

### Phase 3: Dependency Mapping
1. Identify input/output dependencies between tasks
2. Classify dependency types (finish-to-start, start-to-start, etc.)
3. Build a directed acyclic graph (DAG) of dependencies
4. Identify the critical path (longest dependency chain)
5. Flag circular dependencies as errors to resolve
6. Mark external dependencies (API access, approvals, third-party)

### Phase 4: Parallelization Planning
1. Identify independent task clusters that can run concurrently
2. Group tasks by resource type (read, write, build, test)
3. Determine maximum parallelism based on resource constraints
4. Sequence tasks within each parallel track
5. Plan synchronization points (merge gates)

### Phase 5: Estimation and Prioritization
1. Estimate effort for each leaf task
2. Calculate critical path duration
3. Identify quick wins (low effort, high impact)
4. Prioritize by business value and dependency order
5. Create execution timeline with milestones

## Decomposition Rules

### The INVEST Criteria for Tasks
| Criterion | Question | Bad Example | Good Example |
|---|---|---|---|
| **I**ndependent | Can this be done without waiting for others? | "Implement auth after DB is ready" | "Implement auth with mock DB" |
| **N**egotiable | Is the approach flexible? | "Use Redis for caching" | "Add caching layer for user sessions" |
| **V**aluable | Does completing this deliver value? | "Set up folder structure" | "Create user registration endpoint" |
| **E**stimable | Can you estimate the effort? | "Improve performance" | "Add database index for user lookup query" |
| **S**mall | Can one person finish it in < 2 hours? | "Build the dashboard" | "Create dashboard chart component for revenue data" |
| **T**estable | Can you verify it's done? | "Make it better" | "Response time < 200ms for /api/users" |

### Granularity Guidelines
| Level | Name | Typical Duration | Example |
|---|---|---|---|
| L0 | Epic | 2-8 weeks | "User authentication system" |
| L1 | Feature | 2-5 days | "OAuth2 login flow" |
| L2 | Story | 0.5-2 days | "Google OAuth provider integration" |
| L3 | Task | 1-4 hours | "Implement Google callback handler" |
| L4 | Subtask | 15-60 minutes | "Parse OAuth token response" |

For autonomous loops (Ralph), decompose to L3 or L4. For sprint planning, L2-L3 is appropriate.

## Dependency Types

### Classification
| Type | Symbol | Meaning | Example |
|---|---|---|---|
| Finish-to-Start (FS) | A → B | B cannot start until A finishes | "Deploy" after "Build passes" |
| Start-to-Start (SS) | A ⇉ B | B can start when A starts | "Write docs" when "Write code" starts |
| Finish-to-Finish (FF) | A ⇶ B | B cannot finish until A finishes | "Testing" cannot finish until "Development" finishes |
| Start-to-Finish (SF) | A ↷ B | B cannot finish until A starts | Rare — shift handoff scenarios |

### Dependency Notation
```
# Text-based dependency graph
Task 1: Set up database schema
Task 2: Create data access layer         [depends: 1]
Task 3: Implement API endpoints          [depends: 2]
Task 4: Write unit tests for DAL         [depends: 2]
Task 5: Write API integration tests      [depends: 3, 4]
Task 6: Create frontend components       [depends: none]
Task 7: Connect frontend to API          [depends: 3, 6]
Task 8: End-to-end testing               [depends: 5, 7]

# Parallel tracks:
# Track A: 1 → 2 → 3 → 5 → 8
# Track B: 1 → 2 → 4 → 5 → 8
# Track C: 6 → 7 → 8
# Critical path: 1 → 2 → 3 → 7 → 8  (or 1 → 2 → 3 → 5 → 8)
```

## Work Breakdown Structure Template

```markdown
# WBS: [Project Name]

## 1. [Work Stream A]
### 1.1 [Feature]
- [ ] 1.1.1 [Task] — Est: 2h — Deps: none — Priority: P0
- [ ] 1.1.2 [Task] — Est: 1h — Deps: 1.1.1 — Priority: P0
- [ ] 1.1.3 [Task] — Est: 3h — Deps: 1.1.1 — Priority: P1

### 1.2 [Feature]
- [ ] 1.2.1 [Task] — Est: 1h — Deps: none — Priority: P0
- [ ] 1.2.2 [Task] — Est: 2h — Deps: 1.2.1, 1.1.2 — Priority: P1

## 2. [Work Stream B]
### 2.1 [Feature]
- [ ] 2.1.1 [Task] — Est: 1h — Deps: none — Priority: P0
- [ ] 2.1.2 [Task] — Est: 4h — Deps: 2.1.1 — Priority: P0

## Summary
- Total tasks: N
- Estimated total effort: Xh
- Critical path duration: Yh
- Max parallelism: Z tracks
- External dependencies: [list]
```

## Parallelization Patterns

### Independent Clusters
```
Cluster 1 (Backend):     Cluster 2 (Frontend):     Cluster 3 (Infra):
  DB Schema                 Component library          CI pipeline
  ↓                         ↓                          ↓
  Data layer                Page layouts               Docker setup
  ↓                         ↓                          ↓
  API endpoints             State management           Deploy config
       ↘                    ↙                          ↓
         Integration                              Monitoring setup
              ↓
         E2E Testing
```

### Resource-Based Parallelism
| Resource Type | Max Parallel | Rationale |
|---|---|---|
| Code reading / analysis | Unlimited | No side effects |
| File creation / editing | 3-5 | Avoid merge conflicts |
| Build / compile | 1 | Resource contention |
| Test execution | 1-2 | Shared state, ports |
| Database migrations | 1 | Sequential by nature |
| Documentation | Unlimited | Independent files |

### Synchronization Points
```
  ┌──────┐     ┌──────┐     ┌──────┐
  │Task A│     │Task B│     │Task C│
  └──┬───┘     └──┬───┘     └──┬───┘
     │            │            │
     ▼            ▼            ▼
  ╔══════════════════════════════════╗
  ║     SYNC GATE: All Complete     ║
  ║  Verify: no conflicts, tests    ║
  ╚══════════════╤═══════════════════╝
                 │
                 ▼
          ┌──────────┐
          │ Next Phase│
          └──────────┘
```

## Estimation Techniques

### T-Shirt Sizing to Hours
| Size | Hours | Confidence | Example |
|---|---|---|---|
| XS | 0.5-1h | High | Rename a variable, fix a typo |
| S | 1-2h | High | Add a simple endpoint, write a test |
| M | 2-4h | Medium | Implement a feature with known pattern |
| L | 4-8h | Low | New feature with research needed |
| XL | 8h+ | Very Low | **Must be decomposed further** |

### Estimation Heuristics
- **Known pattern**: Estimate based on similar past work, add 20% buffer
- **Unknown pattern**: Double the estimate, add research spike task first
- **Integration work**: 1.5x the sum of individual components
- **First-time technology**: 3x the "if I knew how" estimate
- **Bug fixes**: Time-box investigation (2h), then re-estimate

### Three-Point Estimation
```
Expected = (Optimistic + 4 * Most Likely + Pessimistic) / 6

Example:
  Optimistic:  2 hours (everything goes smoothly)
  Most Likely: 4 hours (normal development pace)
  Pessimistic: 10 hours (major unexpected issues)
  Expected:    (2 + 16 + 10) / 6 = 4.7 hours
```

## Critical Path Analysis

### How to Find the Critical Path
1. List all tasks with durations and dependencies
2. Forward pass: calculate earliest start (ES) and earliest finish (EF)
3. Backward pass: calculate latest start (LS) and latest finish (LF)
4. Float = LS - ES (tasks with zero float are on the critical path)
5. The critical path is the longest chain through the dependency graph

### Optimization Strategies
| Strategy | When | Effect |
|---|---|---|
| Parallelize | Independent tasks on critical path | Reduces calendar time |
| Fast-track | Overlap sequential tasks | Reduces duration, increases risk |
| Crash | Add resources to critical tasks | Reduces duration, increases cost |
| Scope reduction | Remove non-essential tasks | Reduces total work |
| Spike first | Unknown tasks blocking the path | De-risks estimates early |

## Anti-Patterns

- Tasks too large to estimate ("Build the backend" is not a task)
- Missing dependencies that surface during implementation
- Circular dependencies indicating unclear architecture
- All tasks on a single sequential chain (no parallelism)
- Estimation without decomposition (guessing at L0 level)
- Not identifying external dependencies until they block progress
- Over-decomposition into trivial subtasks (noise, not signal)
- Ignoring the critical path when prioritizing work
- Not re-estimating after learning new information during execution
- Decomposing without clear acceptance criteria for each task

## Skill Type

**RIGID** — Follow the decomposition phases in order. Every task must meet the INVEST criteria and have explicit dependencies, estimates, and acceptance criteria. The dependency graph and critical path analysis are mandatory for multi-day work.
