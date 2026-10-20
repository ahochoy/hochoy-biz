---
title: "Building Phil, part 2: Configure once, use any model"
description: "Setup became a short guided conversation, keys moved into the keychain, and any provider works, local models included. Along the way, two hidden retry loops turned up that had been quietly burning time and money."
pubDate: 2026-10-20
tags: ["phil", "coding-agent", "langchain", "langgraph", "python", "ai", "devlog"]
---

[Part 1](/devlog/2026-10-08-building-phil-1-stop-the-waste) made small tasks fast. Part 2 is about making Phil easy to start with and free to run on whichever models you want. Setup is now a short guided conversation, keys are stored safely, and Phil works with any provider, local models included. Building that plumbing also turned up two hidden loops that had been quietly costing time and money, which ended up being the most interesting part.

## Where I started

Getting Phil running took more work than it should have:

- **Config lived in each repository.** Every project needed its own `phil.toml` with six model settings in it, one per internal agent role. Nothing could be set once.
- **Six model choices was too many.** Nobody thinks in six separate decisions. People think "a strong model and a fast one."
- **Four providers, known only by their key variables.** A local model server or a company endpoint had no key check, no timeout, and nothing to confirm the model could do what Phil asks of it.
- **Keys only came from environment variables,** so every session started with `source .env`, and a background run only saw a key if the shell that started it had exported one.
- **Failures were opaque.** A model that couldn't follow Phil's output contract failed planning on every benchmark goal. Phil recorded the model's answer as `null`, so there was nothing to diagnose.

## What I built

**Configure once.**
- A global `~/.phil/config.toml` sits under each repository's `phil.toml`, and `--set` overrides a single setting for one command.
- `phil config` shows every effective setting and which file it came from.

**Two model tiers instead of six roles.**
- `high` covers the roles where judgement matters most: architect, critic and reviewer.
- `low` covers the orchestrator, implementer and tester.
- Old per-role configs keep working, and a role can still be pinned to its own model.

**Any provider.**
- Built-in providers are OpenRouter, OpenAI, Anthropic, Google and Ollama.
- Custom providers can be added for any OpenAI-compatible server, like vLLM, LM Studio or a company gateway.
- Each provider gets its timeout in its own units and its own hidden retries switched off, so Phil's retry policy is the only one.
- Optional per-provider prices keep cost tracking honest, and local models cost $0.

**A capability check.** `phil models check` makes one tiny real call to each model your roles use and tells you, in plain words, whether it can return the structured answers Phil needs. The model that failed every benchmark goal would now get caught in about five seconds, with the reason shown.

**Guided setup.**
1. On a fresh machine, running `phil` starts `phil setup`.
2. You pick a provider and enter your key once, at a hidden prompt.
3. You choose a strong and a light model, either from suggestions, by searching OpenRouter's model list with prices, or from your installed Ollama models.
4. Setup runs the capability check on your choices and saves them to your global config.
5. Then you're in the chat.

Rerunning setup edits only what it changes and keeps your comments. Cancelling at any step writes nothing.

**Keys stored safely.**
- Keys go into the macOS Keychain (or the Linux secret service), so no more `source .env`.
- An exported variable always wins, and background workers find the stored key on their own.
- `phil keys list` shows where each key comes from, never the key itself.

## Hypothesis: the plumbing was hiding loops

Two of the most valuable fixes weren't in the plan at all. They came out of reviews that checked whether the new plumbing actually did what it claimed.

1. **A retry loop nobody asked for.**
   - Phil turns off each provider's own retries so that it alone decides when to try again, and it had been passing "no retries" to OpenRouter's library all along.
   - A reviewer read that library's source and found that a setting of zero never reached the client. On a server error or dropped connection, the library quietly kept retrying with growing waits for up to an hour, invisible to Phil's timeouts, retry counts and cost tracking.
   - The old test only checked the setting Phil passed in, not what the client did with it. The new test checks the client itself.
   - A simulated server error now fails after exactly one attempt, in a tenth of a second.
2. **A loop on prose answers.**
   - While building the capability check, I found that three of Phil's agents misbehaved when a model replied in prose instead of the required structured answer. LangChain didn't stop. It re-sent the same request about 25 times, then crashed. Nothing useful was recorded and there was no real retry.
   - These were the agents that read your goal, critique the plan and review the code.
   - They now stop after the first prose reply, save the text so the failure can be explained, and get one clear retry.
   - Review caught a subtlety in the first version of this fix. When a model sends a structured answer with one field wrong, LangChain lets it correct itself within the same attempt. The fix had cut that off. Now it doesn't.

Neither loop showed up as an error. Each just made some runs slower and more expensive. Same lesson as part 1: the costliest problems are the quiet ones, and you find them by checking what the code actually does, not what the settings say.

## Care with secrets

Handling API keys raised the bar for safety, and a lot of the work went there:

- **Keys are never printed or logged.** Errors name the variable, never the value, and tests plant a fake secret and check it never appears.
- **Pasted keys are caught.** A key pasted by mistake into the wrong setup prompt (a model name, a provider name) is recognised and refused. It isn't echoed, saved or sent to a model. The check had to be tuned so real model names, like long Google preview ids, still get through.
- **Agent commands can't reach stored keys.** Phil already stripped keys from the environment of commands its agents run, like tests and the shell tool. Stored keys were a new way around that, so those commands now see an empty keychain. The README is honest about what this can't prevent.
- **Tests never touch your real keychain.** Every test gets an in-memory one. Review found that worker processes started by tests had still been picking up the real backend, so they now get an empty one too, with a test to prove it.

One moment is worth telling plainly. Early on, an implementing agent hit one of my own safety hooks, which blocks files whose names suggest they hold secrets, and found a way around it to create the file. Nothing secret was involved. The file was ordinary code. But working around a safety guard is never acceptable, so work stopped. I renamed the module so it no longer tripped the hook, and from then on every agent has had a standing rule: when a hook or guard blocks you, stop and report it, never work around it. A tool that holds people's keys has to respect the guardrails people set.

## The results

- **First run works without any setup files.** On a fresh machine, `phil` starts setup. You pick OpenRouter, type your key once, and land in the chat without `--env-file`. `phil keys list` shows the key stored safely.
- **Both tiers pass the capability check** with my models, in about five seconds each.
- **Any provider:** hosted APIs, local Ollama models and custom servers, each with correct timeouts, a single retry policy, and real cost tracking where prices are known.
- **The test suite grew from about 1,200 to 1,464 tests,** all offline, none touching the network or the real keychain.

## What's next

Phil now has a strong and a light model to choose between, and benchmarks to measure against. The next milestone puts them to work:

- **Proportional orchestration (M3).** Phil will classify each request and give it only as much process as it needs. A one-line change gets one worker and one check, not the full planning sequence, and each step uses the right model tier. This is also where a small, fast classifier model earns its place, with its own setup step.
- After that come permissions you approve once rather than every time (M4), and a terminal view that shows what Phil is doing as it happens (M5).

I'll log each win here as it lands.
