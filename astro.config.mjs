// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { existsSync, readdirSync } from "node:fs";
import { basename } from "node:path";

// Each version of the Guide is built on a base of its own (tools/build-site.sh):
// /development/ from main, /X.Y/ from release-X.Y. A plain `npm run build` or
// `npm run dev` is the development version.
const base = process.env.GUIDE_BASE ?? "/development";

// A sidebar group for a folder of English pages, left out while the folder has no page,
// whatever else it holds: screenshots alone would give an empty group. A page is a file
// Starlight's docs loader reads, Markdown whose name does not start with `_`.
const pageFile = /^[^_].*\.(markdown|mdown|mkdn|mkd|mdwn|md|mdx)$/;
const group = (label, translations, directory) => {
  const folder = new URL(`./src/content/docs/en/${directory}`, import.meta.url);
  const pages =
    existsSync(folder) && readdirSync(folder, { recursive: true }).some((name) => pageFile.test(basename(String(name))));
  return pages ? [{ label, translations, items: [{ autogenerate: { directory } }] }] : [];
};

export default defineConfig({
  site: "https://guide.apertrust.org",
  base,
  trailingSlash: "always",
  integrations: [
    starlight({
      title: {
        "en-GB": "Apertrust Guide",
        uk: "Посібник Apertrust",
        pl: "Przewodnik Apertrust",
      },
      favicon: "/favicon.svg",
      // The website's look (src/styles/theme.css), its fonts served from the Guide itself.
      customCss: [
        "@fontsource-variable/fraunces/full.css",
        "@fontsource-variable/fraunces/full-italic.css",
        "@fontsource-variable/literata/wght.css",
        "@fontsource/dm-mono/400.css",
        "@fontsource/dm-mono/500.css",
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/caveat/700.css",
        "./src/styles/theme.css",
      ],
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
        SocialIcons: "./src/components/SocialIcons.astro",
      },
      // Every language in a folder of its own, English the source; a page not yet
      // translated shows the English page with Starlight's note saying so.
      defaultLocale: "en",
      locales: {
        en: { label: "English", lang: "en-GB" },
        uk: { label: "Українська", lang: "uk" },
        pl: { label: "Polski", lang: "pl" },
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/apertrust/apertrust",
        },
      ],
      // Diátaxis's four kinds, how-to's first after the walk through.
      sidebar: [
        {
          label: "Getting started",
          translations: { uk: "Початок роботи", pl: "Pierwsze kroki" },
          items: [{ autogenerate: { directory: "getting-started" } }],
        },
        {
          label: "How-to's",
          translations: { uk: "Як зробити", pl: "Jak to zrobić" },
          items: [{ autogenerate: { directory: "how-to" } }],
        },
        {
          label: "Tools",
          translations: { uk: "Інструменти", pl: "Narzędzia" },
          // A tool's page by its kind: processing tools edit the photo, utility tools edit
          // nothing of their own (Collections, History, Scopes, Export and the rest).
          items: [
            ...group("Processing tools", { uk: "Інструменти обробки", pl: "Narzędzia przetwarzania" }, "tools/processing"),
            ...group("Utility tools", { uk: "Допоміжні інструменти", pl: "Narzędzia pomocnicze" }, "tools/utility"),
          ],
        },
        {
          label: "Concepts",
          translations: { uk: "Поняття", pl: "Pojęcia" },
          items: [{ autogenerate: { directory: "concepts" } }],
        },
      ],
    }),
  ],
});
