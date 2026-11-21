# Apertrust Guide

How to edit photos with [Apertrust](https://github.com/apertrust/apertrust), a free raw photo editor: the site at [guide.apertrust.org](https://guide.apertrust.org), built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) and published on GitHub Pages. The app's Help opens its pages.

## Working on it

```sh
npm ci            # install the pinned dependencies
npm run dev       # the development version at http://localhost:4321/development/en/
npm run build     # the development version into dist/
npm run topics    # the Help topics the pages claim
tools/build-site.sh   # every version into site-build/, as GitHub Pages serves it
```

Astro needs Node.js 22.23.4 or later.

## How it is organised

- **Pages** are Markdown in `src/content/docs/<language>/`, English (`en`, in British English) the source. A page missing in Ukrainian (`uk`) or Polish (`pl`) shows the English page with a note saying so.
- **Four kinds of page**, after [Diátaxis](https://diataxis.fr/): `getting-started/`, `how-to/`, `tools/` and `concepts/`. Tools are split by kind: processing tools in `tools/processing/`, such as `tools/processing/exposure`, and utility tools, which edit nothing of their own, in `tools/utility/`, such as `tools/utility/export`.
- **Help topics:** the app opens `/{version}/{language}/{topic}/`, and a topic is a page's own path, so `tools/processing/exposure` is the Exposure page. A page's front matter lists the topics it answers, its own path implied, a path it had before it moved among them; the build makes a page at each topic that is not its own path, sending the reader on:

  ```yaml
  topics:
    - tools/processing/exposure
    - tools/exposure                         # its path before it moved
    - workspaces/hidden-tools#hidden-tools   # a heading on the page
  ```

  A topic no page claims lands on the site's 404 page, which says the page is not written yet.
- **The look** is the website's: `src/styles/theme.css` sets Starlight's colours, light the website's paper and ink and dark its footer's, with Fraunces for reading, DM Mono for navigation and labels and Caveat for a Tip's label. The fonts are served from the Guide itself (Fontsource), with Literata and IBM Plex Mono for the Cyrillic that Fraunces and DM Mono lack. The header's title and its apertrust.org link are `src/components/`.
- **Screenshots** of the app, in its dark theme on both of the Guide's, go through `src/components/Screenshot.astro`, which frames them and shows them at the app's own size (see AGENTS.md).
- **Versions:** `main` is published as `/development/`, and each `release-X.Y` branch as `/X.Y/`. `/latest/` and the site's root go to the newest release. Every push to one of them publishes the whole site (`.github/workflows/deploy.yml`).

The design is the app's decision 97, [Help topics and the Apertrust Guide](https://github.com/apertrust/apertrust/blob/main/docs/decisions/0097-help-topics-and-the-apertrust-guide.md).
