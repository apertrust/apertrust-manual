# Apertrust Guide

The Apertrust Guide: how to edit photos with Apertrust, an [Astro](https://astro.build) site with [Starlight](https://starlight.astro.build), published on GitHub Pages at guide.apertrust.org by `.github/workflows/deploy.yml`. The app lives in [apertrust/apertrust](https://github.com/apertrust/apertrust); its decision 97 designs Help and this site.

## Commands

```sh
npm ci
npm run dev
npm run build
npm run topics
tools/build-site.sh
```

## Rules

- **Readers edit photos.** Write how-to's: name a page by what a person wants ("Make a photo brighter"), not by a tool; numbered steps; a picture where it helps. Follow [Diátaxis](https://diataxis.fr/): every page is one of `getting-started/`, `how-to/`, `tools/` (the reference a tool's Help opens: what it is for, when to use it, its how-to's, then each control) or `concepts/`. A tool's page is `tools/processing/<tool>` for a processing tool, every darktable processing module's, and `tools/utility/<tool>` for a utility tool, one that edits nothing of its own: Collections, History, Scopes, Export, the Colour picker, Metadata, Keywords, Styles and Tagging.
- **Topics are a contract with the app.** A topic is a page's own path, which the app opens as `/{version}/{language}/{topic}/`. A topic the app has released is never renamed or dropped: a page may move, and lists its old path among its `topics`, which the build turns into a redirect to it. Only English pages claim topics, one page each, and never another page's path.
- **English is the source,** in British English, plain and short. Translations are `src/content/docs/uk/` and `pl/`, the same paths as the English pages.
- **Screenshots:** the app in its default dark theme, whatever the Guide's theme; taken at 2x on a HiDPI display and cropped to what the page explains (a tool's section, a menu), never the whole window without reason; beside the page that uses them; through `Screenshot.astro` in an `.mdx` page, which shows them at half their pixels, the app's own size, with `alt` saying what they show and a caption. Numbers and notes over a screenshot are the page's, never drawn into the image, so they translate. A Ukrainian or Polish page takes its own language's screenshots when it has them.
- **The theme** is `src/styles/theme.css`, the wireframe's Guide boards: change a colour there, never in a page.
- **Name things as the app does:** the Toolbar, the Tools panel, the Viewer, the Browser, Collections; a tool, never a module, but where darktable's own modules are meant. Never name commercial raw editors; say "commercial raw editors".
- **Versions:** `main` is the development version; a fix for a released version goes to its `release-X.Y` branch as well.
- Pin dependencies to exact versions and commit `package-lock.json`; pin every action by its commit SHA with the version in a comment.
- Every commit carries a human's `Signed-off-by:` (`git commit -s`).
- Personal notes for this checkout go in `AGENTS.local.md`, which git ignores.
