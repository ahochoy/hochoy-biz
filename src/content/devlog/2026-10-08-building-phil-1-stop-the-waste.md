---
title: "Building Phil, part 1: Stop the waste"
description: "A one-line change took my coding agent 50 minutes and 438 model calls. The model wasn't the problem. Here's what the run logs showed, what I changed, and the before-and-after numbers."
pubDate: 2026-10-08
tags: ["phil", "coding-agent", "langchain", "langgraph", "python", "ai", "devlog"]
---

Phil is a coding agent I've been building on the side. The idea is a careful teammate rather than a magic button: you describe a goal in chat, Phil plans it with you, does the work in its own git worktree test-first, reviews the result, opens the PR, and cleans up after the merge. By the end of September all of that worked end to end.

Then I gave it a trivial job, and it fell over.

## The one-line change that took fifty minutes

The job: add a hidden `<meta name="easter-egg" content="hello world">` tag to a one-page Astro site. Nothing renders, nothing to test. Any frontier coding agent does this in seconds.

Phil took about 50 minutes. It made 438 model calls, read more than 3 million input tokens, and wrote about 80 thousand. It split the change into three tasks, finished two, then failed the third three times in a row before I stopped the run.

I was using a cheaper model on purpose, so the easy explanation was "the model is weak." I didn't buy it. A modest model should be slow, not incapable, and a decent harness should still get a small job done with one. So I treated the run as evidence and went through the logs call by call.

## Hypothesis: the model isn't the bottleneck, the guardrails are

The logs backed that up. Phil's own safety and quality rules were tripping it into loops:

| What happened | What it cost |
|---|---|
| The agent explored with `ls`, `grep`, `cat` and `git status`. None were on the shell allow list, so each one paused the run for human approval. | 13 pauses. After every one the agent started over and re-explored the whole repo: 186 `ls` calls and 166 file reads. |
| The model cited file-tool calls ("I read `index.astro`") as evidence. Phil only accepted shell commands as evidence. | 26 correct answers rejected on a technicality, each followed by a retry. |
| Every retry, approval or resume spun up a brand-new agent with no memory of the last attempt. | Nearly all of the 3 million input tokens: the same context sent again and again, not new work. |
| The test command was wrong for the repo, and once a run started it could never change. | Every test step failed, even after I fixed the config. |
| The planner split one tag into three tasks, including a new JSON data file "to match conventions" and a task whose only job was to verify. | A verification-only task can't start from a failing test, so it could never pass Phil's test-first rule. |

Nothing exotic here. Each one came from a reasonable rule, applied without asking what it costs when the work is small.

## What I changed

I wrote up a design and a plan, then built it in eight reviewed steps:

- **A benchmark first.** Before touching anything, I built a live benchmark: two tiny sample repos (a Python package with tests, and a static site with only a build step) and three goals (add a function, add the hidden meta tag, fix a typo). It runs the real planner and worker end to end and records time, model calls, tokens, cost, and pass or fail. That's what makes the before-and-after honest instead of remembered.
- **Read-only exploration without asking.** Agents can now list, read and search the repo without pausing for approval. Test and check commands from a plan you've already approved are allowed too. Anything that reaches outside the run's worktree is still refused. This got the most scrutiny: four rounds of security review, each tested against the real `grep`, `rg` and `git`, closing escape routes through symlinks, values attached to flags, and options that follow links or run programs.
- **Evidence that matches how agents actually work.** A claim can now cite the file tool that produced it.
- **Check tasks.** Not everything is testable. Copy, markup and config changes can now be *check* tasks: make the change, then prove it with a command like the site's build. They skip the failing-test step, and the planner is told never to create a task that only verifies.
- **Memory between attempts.** Each attempt leaves a short work summary. The next attempt gets that summary plus the current diff instead of starting from zero. If I approve a command mid-task, the agent picks up where it stopped.
- **A test command that fits the repo.** Phil detects it from the repository, and if I fix it in the config while a run is paused, the run picks up the change.
- **Leaner prompts.** Every agent gets the same short rules: explore with the file tools, don't re-read what you already have, don't build more than the task needs, stop when the goal is met.

## The results

Same benchmark, same model for every role (`gemini-3.8-flash`), before and after:

| Goal | Before | After |
|---|---|---|
| Add a Python function (test-first) | ✅ 3.0 min · 32 model calls · $0.15 | ✅ **2.0 min** · 31 calls · **$0.13** |
| Add the hidden meta tag | ⏸ stuck waiting for approval after 4.2 min · $0.16 | ✅ **1.8 min** · 30 calls · **$0.11** |
| Fix a typo | ⏸ stuck waiting for approval after 3.8 min · $0.18 | ✅ **1.8 min** · 24 calls · **$0.09** |

- **Every goal finishes now.** Before, both web-page goals stalled waiting for someone to approve running the site's own build.
- **Each goal is planned as one task of the right kind:** a check task for the page changes, a test-first task for the function.
- **Small tasks finish in under two minutes** from goal to reviewed, committed change. That's roughly a third faster on the one goal that finished before, with about half the output tokens and lower cost.
- **Stalled runs don't burn tokens.** The "before" costs for the stalled goals are only what they spent before stopping. Finishing them would have cost more.

## What I took from it

The fixes that mattered weren't clever. They came from reading the logs carefully and asking, for every rule Phil enforces, what it costs when the work is small. Safe doesn't have to mean slow. Phil now lets agents explore freely inside a strict sandbox, and approving a command means exactly that command, nothing wider. That's safer where it counts and a lot faster everywhere else.

The process mattered too. Every change started from written evidence and every step got an independent review. The benchmark shipped first, so the "before" numbers were real.

## What's next

Two minutes and 25 to 30 model calls is still a lot for a one-line change. Next up:

- **Configuration and models:** set preferences once, globally. Pick a strong tier and a light tier instead of one model per agent. Bring any provider, including local models.
- **Proportional orchestration:** classify each request and use only as much process as it deserves. A one-line fix should get one worker and one check, not the full planning ceremony.
- **Visibility:** a terminal view that shows what Phil is doing as it happens, with costs, tool calls and failures explained plainly.

I'll log each win here as it lands.
