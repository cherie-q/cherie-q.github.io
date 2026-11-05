---
title: "The next level needed software engineering"
description: "A desert-to-dessert typo helped my son imagine his own game worlds. Software engineering helped me keep building them: Everything vs. Zombies grew from 8 worlds to 22."
summary: "Google Playground helped unlock my son's imagination. Tests, specifications and a reusable base helped me keep up."
date: 2026-11-05
toc:
  - { id: "playground-gave-us-something-worth-continuing", title: "What Playground made possible" }
  - { id: "the-problem-changed-when-he-wanted-more", title: "When adding more got harder" }
  - { id: "what-i-changed", title: "What I changed" }
  - { id: "the-payoff-from-8-worlds-to-22", title: "From 8 worlds to 22" }
  - { id: "ai-could-build-i-still-had-to-steer", title: "Why engineering still mattered" }
---

My son wanted a desert level. I typed "dessert."

I'd started using [Google Playground](https://playground.google/), Google's tool for creating playable games from text prompts, for a personal project: making games for my young son.

This game started as **Sprout Siege**, inspired by *Plants vs. Zombies*: place plants on a grid, upgrade them and defend a garden against approaching zombies.

As we added more worlds, he asked for a desert level. My extra "s" took us somewhere else entirely: a world of sweets instead of sand.

That little accident opened something up for him. He didn't have to stick to gardens, or places he'd already seen in another game. Many of the worlds that followed were his ideas and designs. **My job became building a system that could keep up with his imagination.**

As a mom, watching that happen was amazing.

The game grew into **Everything vs. Zombies**, or EvZ. Plants were only the beginning: candy, snakes, toys and bugs could defend their own worlds, too.

He loved it. Then he wanted more.

<figure class="gameplay-screenshot">
  <img src="/images/engineering-the-next-level/dessert-gameplay.webp" srcset="/images/engineering-the-next-level/dessert-gameplay@2x.webp 2x" alt="Dessert Kingdom in the rebuilt game, with lollipop sunflowers, cupcake cannons and candy-cane defenders facing a giant cake mixer." width="1480" height="832" loading="lazy" />
  <figcaption>Dessert Kingdom in the rebuilt game, with a team set up for this screenshot. Its new machine finale is an end-of-world battle against a giant cake mixer.</figcaption>
</figure>

## Playground gave us something worth continuing

Playground supplied the artwork, initial rules, design and music that made this feel like a game, not just code that ran. Short prompts made the distance between his idea and something he could play wonderfully short.

By the time I exported EvZ, it had **8 worlds, each with 6 levels: 48 levels altogether**. That was a substantial game, not a throwaway demo.

But as I kept adding to it in the same way, bugs started appearing.

## The problem changed when he wanted more

There is a difference between making a game work and making a game you can keep adding to.

The exported game's main file had grown to **15,400 lines**. More importantly, the same rules were repeated in different places.

One concrete example: the code that handled tapping an explosive defender listed the explosive types from six worlds, but missed the ones from Brickland and Bug Meadow. Their explosion effects existed, but tapping couldn't trigger them.

That wasn't a lack of creative ideas. It was a rule that had to be remembered and updated in too many places.

My short prompts described the next thing I wanted. They weren't a reliable record of everything I wanted to preserve.

Once my son wanted more worlds, I needed a base I could build on repeatedly, not just another successful change to the latest version.

## What I changed

I moved out of Playground into a separate codebase, working with an AI coding assistant on the rebuild. I kept the original export as a reference, but built around shared game rules. New worlds supplied characters, levels and artwork rather than another copy of the same behaviour.

I recorded the rules in specifications: written descriptions of how the game should behave. For new ideas, I used small pilots: separate previews I could review before changing the full game. Once I'd approved a pilot, AI integrated it into the shared base, with tests to check existing behaviour.

As I repeated that cycle for new worlds, I captured the steps in runbooks: step-by-step processes I tested and refined. Once a process was proven, fixed-rule tasks became repeatable scripts. Tasks that still needed judgement became skills: reusable instructions for the AI coding assistant.

<figure class="build-workflow">
  <div class="build-workflow-cycle">
    <svg class="build-workflow-ring" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <circle cx="300" cy="300" r="264" fill="none" stroke="var(--line)" stroke-width="2" vector-effect="non-scaling-stroke" />
      <g fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 558 292 L 564 300 L 570 292" transform="rotate(-60 300 300)" vector-effect="non-scaling-stroke" />
        <path d="M 558 292 L 564 300 L 570 292" vector-effect="non-scaling-stroke" />
        <path d="M 558 292 L 564 300 L 570 292" transform="rotate(60 300 300)" vector-effect="non-scaling-stroke" />
        <path d="M 558 292 L 564 300 L 570 292" transform="rotate(120 300 300)" vector-effect="non-scaling-stroke" />
        <path d="M 558 292 L 564 300 L 570 292" transform="rotate(180 300 300)" vector-effect="non-scaling-stroke" />
        <path d="M 558 292 L 564 300 L 570 292" transform="rotate(240 300 300)" vector-effect="non-scaling-stroke" />
      </g>
      <g class="build-workflow-feedback" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 500.05 415.5 C 360 415.5 360 184.5 500.05 184.5" vector-effect="non-scaling-stroke" />
        <path d="M 99.95 415.5 C 180 415.5 180 365 240 365 Q 300 365 300 425 L 300 531" vector-effect="non-scaling-stroke" />
        <g stroke-dasharray="none">
          <path d="M 389 308 L 395 300 L 401 308" vector-effect="non-scaling-stroke" />
          <path d="M 276 378 L 285 380 L 283 371" vector-effect="non-scaling-stroke" />
        </g>
      </g>
    </svg>
    <p class="build-workflow-center" aria-hidden="true">Each new feature</p>
    <span class="build-workflow-feedback-label build-workflow-revise" aria-hidden="true">Revise</span>
    <span class="build-workflow-feedback-label build-workflow-fix" aria-hidden="true">Fix</span>
    <ol class="build-workflow-steps" aria-label="Feature-building loop, with review and playtesting feeding back into earlier stages">
      <li class="steering-step"><strong>I set direction</strong><span>Goal, rules, scope</span></li>
      <li><strong>AI builds a pilot</strong><span>Try the idea</span></li>
      <li class="steering-step"><strong>I review</strong><span>Approve or revise</span></li>
      <li><strong>AI integrates</strong><span>Shared base + checks</span></li>
      <li class="steering-step"><strong>We playtest</strong><span>Does it work? Is it fun?</span></li>
      <li><strong>We capture lessons</strong><span>Runbooks and skills</span></li>
    </ol>
  </div>
  <figcaption>Review can send a pilot back for revision; playtesting can send a feature back for fixes. What worked feeds the next feature.</figcaption>
</figure>

I could still try new ideas, but now I could test them separately before deciding whether to add them to the game.

<figure>
  <img src="/images/engineering-the-next-level/rainbow-art-pilot.png" alt="Rainbow's Reach art contact sheet showing the cloud, raindrop, comet, crescent moon, prism and storm-themed characters." width="1008" height="384" loading="lazy" />
  <figcaption>The Rainbow's Reach art pilot, reviewed before integration. An art reference, not a gameplay screenshot.</figcaption>
</figure>

## The payoff: from 8 worlds to 22

The rebuilt game now has **22 worlds and 154 levels**.

<div class="table-wrap">
  <table class="compare">
    <caption>EvZ content through October 27, 2026</caption>
    <thead>
      <tr><th scope="col">Content</th><th scope="col">Playground export</th><th scope="col">Rebuilt game</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">Worlds</th><td>8</td><td>22</td></tr>
      <tr><th scope="row">Ordinary levels</th><td>48</td><td>132</td></tr>
      <tr><th scope="row">Additional machine finales</th><td>0</td><td>22</td></tr>
      <tr><th scope="row">Total levels</th><td>48</td><td>154</td></tr>
    </tbody>
  </table>
</div>

That's **14 new worlds and 106 additional levels**: 98 levels across the new worlds, plus a new finale for each of the original eight. These counts describe the game through October 27, not a claim that every level has finished family playtesting.

The latest world, **Rainbow's Reach**, is a garden above the clouds, with living colours, weather creatures and a machine trying to bottle up the rainbow. It has six ordinary levels and a finale.

It took **about 1 hour 40 minutes to go from my first rainbow-world request to a playable world**, including pauses for me to approve artwork and make decisions along the way.

That didn't include later inspection, soundtrack work or deployment. The shared engine, saves, screens and tests already existed.

That last point is the lesson. The new world had somewhere to go.

<figure class="gameplay-screenshot">
  <img src="/images/engineering-the-next-level/rainbow-gameplay.webp" srcset="/images/engineering-the-next-level/rainbow-gameplay@2x.webp 2x" alt="Rainbow's Reach running in the rebuilt game, with sunbeam, raindrop, prism and cloud defenders facing the Rainbow Bottler." width="1480" height="832" loading="lazy" />
  <figcaption>Rainbow's Reach gameplay in the rebuilt game, with a team set up for this screenshot.</figcaption>
</figure>

I didn't need to design every future world in advance. I needed enough structure for the next change, not an elaborate system for every game we might one day imagine.

<aside class="callout" aria-labelledby="beyond-one-game">
  <p class="callout-label" id="beyond-one-game">Beyond one game</p>
  <p>Of my <strong>23 preserved Playground prototypes</strong>, I've rebuilt and extended <strong>four games</strong> so far.</p>
</aside>

## AI could build. I still had to steer.

Google Playground helped us find a game we wanted to keep building. I wouldn't have got there without it. The change wasn't that I stopped using AI. It was that I stopped relying on the next prompt to hold the whole design together.

**I could delegate the implementation. I still owned the engineering decisions.**

For Rainbow's Reach, I let AI propose a roster, generate artwork and build the world. I set the direction and reviewed what came back. I chose a thundercloud that stayed planted and recharged rather than disappearing after one use. When Indigo Moonmouth looked wrong, I asked for another art pass. I approved the artwork before asking for it to be integrated.

Those decisions needed guardrails, not just better prompts.

- **Specifications** recorded the agreed rules so they didn't live only in a conversation.
- **Scope** kept "add a world" from becoming "redesign the game."
- **Shared architecture** gave the new world existing rules to use instead of another set to copy.
- **Tests** checked that adding it hadn't broken behaviour such as unlocking defenders or resuming a saved battle.
- **Pilots** let me judge the art and actions before they became part of the full game.
- **Runbooks and automation** turned proven processes into repeatable scripts for fixed-rule tasks and AI skills for work that still needed judgement.

AI could help with all of that, too. The distinction wasn't that I did the engineering and AI did the typing. It was that I had to insist on those guardrails, review the results and decide when we were ready to move on. Passing tests still wasn't the same as my son enjoying the game.

**AI helped me build the next level. Software engineering helped me protect the game we already loved.**
