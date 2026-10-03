import { useState, useMemo, useCallback } from "react";
import { getSiteSearchIndex } from "@/data/searchIndex";

const STORAGE_KEY = "1st_om_recent_searches";
const MAX_RECENT = 6;

export const TRENDING_QUERIES = [
  "Patna to Delhi",
  "Car Transportation",
  "Home Shifting",
  "Pricing Calculator",
  "Office Relocation",
  "Patna to Bengaluru",
  "Warehousing Storage",
  "Transit Insurance",
];

export const CATEGORY_ORDER = [
  "Services",
  "Interstate Routes",
  "Cities & Locations",
  "Pages & Tools",
  "Instant Actions",
  "Legal & Policies",
];

/**
 * Normalizes string by trimming, lowercasing, and stripping punctuation
 */
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes match score for a search item given search tokens
 */
function computeRelevanceScore(item, rawQuery, tokens) {
  const normQuery = normalize(rawQuery);
  const normTitle = normalize(item.title);
  const normSubtitle = normalize(item.subtitle || "");
  const normDesc = normalize(item.description || "");
  const normKeywords = Array.isArray(item.keywords)
    ? item.keywords.map((k) => normalize(k)).join(" ")
    : "";

  let score = 0;

  // 1. Exact full query matches
  if (normTitle === normQuery) score += 120;
  else if (normTitle.startsWith(normQuery)) score += 80;
  else if (normTitle.includes(normQuery)) score += 50;

  // 2. Exact keyword / route matches
  if (normKeywords.includes(normQuery)) score += 45;
  if (normSubtitle && normSubtitle.includes(normQuery)) score += 35;
  if (normDesc.includes(normQuery)) score += 20;

  // 3. Token-by-token scoring (multi-word searches like "patna car shifting")
  let allTokensMatched = true;

  for (const token of tokens) {
    if (!token) continue;
    let tokenFound = false;

    if (normTitle.includes(token)) {
      score += 25;
      tokenFound = true;
    }
    if (normKeywords.includes(token)) {
      score += 18;
      tokenFound = true;
    }
    if (normSubtitle.includes(token)) {
      score += 15;
      tokenFound = true;
    }
    if (normDesc.includes(token)) {
      score += 8;
      tokenFound = true;
    }

    if (!tokenFound) {
      allTokensMatched = false;
    }
  }

  // Bonus if all tokens in a multi-word search are present
  if (tokens.length > 1 && allTokensMatched) {
    score += 40;
  }

  // Slight boost for primary hub / high-volume services
  if (item.isHub) score += 5;
  if (item.category === "Services") score += 3;

  return score;
}

export function useSiteSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");

  // Read / write recent searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecentSearch = useCallback((term) => {
    if (!term || typeof term !== "string") return;
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 2) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
      const next = [cleanTerm, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota / private mode storage error
      }
      return next;
    });
  }, []);

  const removeRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => {
      const next = prev.filter((item) => item !== term);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Search evaluation
  const searchIndex = useMemo(() => getSiteSearchIndex(), []);

  const { results, groupedResults, categoryCounts, totalMatches } = useMemo(() => {
    const raw = query.trim();
    if (!raw) {
      return {
        results: [],
        groupedResults: {},
        categoryCounts: { All: 0 },
        totalMatches: 0,
      };
    }

    const tokens = normalize(raw).split(/\s+/).filter(Boolean);

    // Compute scores
    const scoredItems = [];
    const counts = { All: 0 };

    for (const item of searchIndex) {
      const score = computeRelevanceScore(item, raw, tokens);
      if (score > 0) {
        scoredItems.push({ ...item, score });
        counts.All += 1;
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    }

    // Sort descending by score
    scoredItems.sort((a, b) => b.score - a.score);

    // Filter by active category if selected
    const filteredResults =
      activeCategory === "All"
        ? scoredItems
        : scoredItems.filter((item) => item.category === activeCategory);

    // Group by category respecting CATEGORY_ORDER
    const grouped = {};
    for (const item of scoredItems) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }

    return {
      results: filteredResults,
      groupedResults: grouped,
      categoryCounts: counts,
      totalMatches: scoredItems.length,
    };
  }, [query, activeCategory, searchIndex]);

  return {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    results,
    groupedResults,
    categoryCounts,
    totalMatches,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    trendingQueries: TRENDING_QUERIES,
  };
}
