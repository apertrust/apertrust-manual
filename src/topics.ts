import { getCollection } from "astro:content";

/** Where a topic leads: a page, by its path under its language, and a heading on it. */
export interface Claim {
  topic: string;
  page: string;
  anchor?: string;
  claimedBy: string;
}

/**
 * Every topic the English pages claim that needs a redirect, each with the page that
 * claims it. A page answers its own path with nothing listed, so a topic that is the
 * claiming page's own path needs none. Two pages claiming one topic, or a page claiming
 * another page's path, fail the build, so a topic always has one place to go.
 */
export async function redirects(): Promise<Claim[]> {
  const pages = await getCollection("docs", (entry) => entry.id.startsWith("en/") || entry.id === "en");
  const pathOf = (id: string) => (id === "en" ? "" : id.replace(/^en\//, ""));
  const paths = new Map(pages.map((entry) => [pathOf(entry.id), entry.id]));
  const found = new Map<string, Claim>();
  for (const entry of pages) {
    const page = pathOf(entry.id);
    for (const claimed of entry.data.topics ?? []) {
      const [topic, anchor] = claimed.split("#");
      if (topic === page) continue;
      const owner = paths.get(topic);
      if (owner) {
        throw new Error(`topic "${topic}", claimed by ${entry.id}, is the path of ${owner}`);
      }
      const other = found.get(topic);
      if (other) {
        throw new Error(`topic "${topic}" is claimed by ${other.claimedBy} and ${entry.id}`);
      }
      found.set(topic, { topic, page, anchor, claimedBy: entry.id });
    }
  }
  return [...found.values()].sort((a, b) => a.topic.localeCompare(b.topic));
}
