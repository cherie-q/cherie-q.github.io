# cherie-q.github.io

Personal site and writing, built with [Astro](https://astro.build) and published to GitHub Pages.

## Run it

```sh
npm ci
npm run dev      # http://localhost:4321
npm run verify   # type check, build, then scripts/check-dist.ts
npm run og       # build, then render link-preview cards into public/og/
```

`verify` is what CI runs. `scripts/check-dist.ts` fails the build on broken internal links or anchors, em dashes in prose, internal details that shouldn't be published, lockfile URLs that aren't on registry.npmjs.org, and pages whose link-preview image is missing.

Link-preview cards (1200x630) are rendered from each page's own title and scene by `scripts/og.ts` and committed, so CI needs no browser. Rerun `npm run og` after changing a title, description or scene. It needs Chromium once: `npx playwright install chromium`.

## Layout

- `src/content/posts/` holds post metadata (frontmatter). New posts can be plain Markdown here; the renderer applies paragraph, figure and heading spacing through the `.post-body` wrapper.
- The home page's Writing section uses illustrated cards, newest first, with each series grouped into one card dated from its first part. Cards reuse the title scene fragments. Posts marked `draft: true` appear in local development, but are excluded from production pages, lists and RSS.
- `src/fragments/` holds hand-built HTML bodies (inline SVG diagrams) for posts that need them, matched to a post by path.
- Title illustrations use a sibling `_scene-<post-name>.html` fragment, including standalone posts. A post's frontmatter `toc` adds the right-hand contents navigation; each `id` must match a heading anchor.
- `src/data/site.ts` holds site and series settings.
- `.github/workflows/deploy.yml` builds on every push and PR, and deploys `main` to Pages once the repo is public.
