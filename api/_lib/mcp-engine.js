/**
 * NutriSafe MCP Query Engine
 * Strict matching rules and deterministic lookups against bundled demo dataset.
 * Every lookup returns null unless exactly one record fits.
 */

import {
  ADDITIVES_DATA,
  NUTRITION_DATA,
  PESTICIDES_DATA,
  DATASET_COUNTS,
  DEMO_SENTENCE
} from './ingredients-data.js';

export { DATASET_COUNTS, DEMO_SENTENCE };

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalizes spelling variants for search:
 * colour/color, flavour/flavor, sulphite/sulfite, sulphur/sulfur
 */
export function normalizeVariant(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\bcolou?rs?\b/g, 'color')
    .replace(/\bflavou?rs?\b/g, 'flavor')
    .replace(/\bsulph/g, 'sulf');
}

/**
 * Singularizes crop names for robust comparison:
 * tomatoes -> tomato, strawberries -> strawberry, apples -> apple, etc.
 */
export function singularizeCrop(crop) {
  if (!crop) return '';
  let s = crop.trim().toLowerCase();
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('oes')) return s.slice(0, -2);
  if (s.endsWith('s') && !s.endsWith('ss')) return s.slice(0, -1);
  return s;
}

/**
 * Generates verified aliases for an additive per prompt specification:
 * - name and chemical name, with and without any "(...)" part
 * - text inside the brackets on its own ("MSG", "Vitamin C", "Ace-K", "BHA")
 * - singular of plural name of 6 letters or more ("lecithins" -> "lecithin")
 * - ignores names shorter than 3 letters
 * - specific label spellings for INGR-PALM, INGR-TRANSFAT, E471, E150d, E322, INGR-HFCS
 * - Never matches on the first word of a name alone.
 */
export function getAdditiveAliases(item) {
  const aliases = new Set();

  function processName(raw) {
    if (!raw || typeof raw !== 'string') return;
    const clean = raw.trim().toLowerCase();
    if (clean.length < 3) return;

    // Full name
    aliases.add(clean);

    // If it contains brackets: "Ascorbic Acid (Vitamin C)"
    const match = raw.match(/^(.*?)\s*\((.*?)\)\s*$/);
    if (match) {
      const outside = match[1].trim().toLowerCase();
      const inside = match[2].trim().toLowerCase();
      if (outside.length >= 3) aliases.add(outside);
      if (inside.length >= 3) aliases.add(inside);
    }
  }

  processName(item.name);
  if (item.chemicalName) processName(item.chemicalName);
  if (item.chemical_name) processName(item.chemical_name);

  // Singular of a plural name of 6 letters or more
  const current = Array.from(aliases);
  for (const a of current) {
    if (a.length >= 6 && a.endsWith('s') && !a.endsWith('ss')) {
      const sing = a.slice(0, -1);
      if (sing.length >= 3) aliases.add(sing);
    }
  }

  // Explicit label spellings
  if (item.id === 'INGR-PALM') {
    aliases.add('palm oil');
    aliases.add('palm fat');
  }
  if (item.id === 'INGR-TRANSFAT') {
    aliases.add('partially hydrogenated');
    aliases.add('hydrogenated vegetable oil');
    aliases.add('hydrogenated soybean oil');
    aliases.add('trans fat');
  }
  if (item.id === 'E471') {
    aliases.add('mono- and diglycerides');
    aliases.add('mono and diglycerides');
    aliases.add('monoglycerides');
  }
  if (item.id === 'E150d') {
    aliases.add('caramel color');
    aliases.add('caramel colour');
  }
  if (item.id === 'E322') {
    aliases.add('lecithin');
    aliases.add('soy lecithin');
    aliases.add('sunflower lecithin');
  }
  if (item.id === 'INGR-HFCS') {
    aliases.add('hfcs');
    aliases.add('glucose-fructose syrup');
  }

  return Array.from(aliases).filter(a => a.length >= 3);
}

/**
 * Normalize E-numbers in queries:
 * Turns "E 211" and "E-211" into "E211"
 */
export function normalizeENumberQuery(str) {
  if (!str) return '';
  return str.replace(/\bE[\s-]+(\d+[a-z]?)\b/gi, 'E$1');
}

/**
 * Checks an additive in the strict order:
 * 1) An E-number typed alone or found as a whole word, after turning "E 211" and "E-211" into "E211"
 * 2) An exact CAS number
 * 3) An exact name
 * 4) The longest name found in the query as whole words
 * 5) A part of a name of 4 letters or more that fits exactly one additive
 * Return null when query names two different additives, by E-number or by name, or when two additives tie.
 */
export function checkAdditive(query) {
  if (!query || typeof query !== 'string') return null;
  const raw = query.trim();
  if (!raw) return null;

  const normalized = normalizeENumberQuery(raw);

  const lowerQuery = raw.toLowerCase();

  // 1) E-number typed alone or found as a whole word
  const eNumberMatches = normalized.match(/\bE\d+[a-z]?\b/gi);
  if (eNumberMatches && eNumberMatches.length > 0) {
    const matchedAdditives = new Set();
    for (const code of eNumberMatches) {
      const upperCode = code.toUpperCase();
      const found = ADDITIVES_DATA.find(a => a.eNumber.toUpperCase() === upperCode || a.id.toUpperCase() === upperCode);
      if (found) {
        matchedAdditives.add(found);
      }
    }
    if (matchedAdditives.size > 1) {
      return null; // query names two different additives
    }
    if (matchedAdditives.size === 1) {
      const primary = Array.from(matchedAdditives)[0];
      // Also verify query doesn't name a different additive by name
      for (const item of ADDITIVES_DATA) {
        if (item.id !== primary.id) {
          const aliases = getAdditiveAliases(item);
          for (const alias of aliases) {
            const regex = new RegExp('(?:^|[^a-z0-9])' + escapeRegex(alias) + '(?:$|[^a-z0-9])', 'i');
            if (regex.test(lowerQuery)) {
              return null; // query names two different additives
            }
          }
        }
      }
      return primary;
    }
  }

  // 2) Exact CAS number
  const casMatches = ADDITIVES_DATA.filter(a => a.casNumber && a.casNumber.toLowerCase() === raw.toLowerCase());
  if (casMatches.length === 1) {
    return casMatches[0];
  }
  if (casMatches.length > 1) {
    return null;
  }

  // 3) Exact name
  const exactNameAdditives = new Set();
  for (const item of ADDITIVES_DATA) {
    const aliases = getAdditiveAliases(item);
    if (aliases.includes(lowerQuery)) {
      exactNameAdditives.add(item);
    }
  }
  if (exactNameAdditives.size === 1) {
    return Array.from(exactNameAdditives)[0];
  }
  if (exactNameAdditives.size > 1) {
    return null;
  }

  // 4) The longest name found in the query as whole words
  const wordMatched = []; // { additive, alias, length }
  for (const item of ADDITIVES_DATA) {
    const aliases = getAdditiveAliases(item);
    for (const alias of aliases) {
      // Whole-word boundary check allowing hyphens/special chars
      const regex = new RegExp('(?:^|[^a-z0-9])' + escapeRegex(alias) + '(?:$|[^a-z0-9])', 'i');
      if (regex.test(lowerQuery)) {
        wordMatched.push({
          additive: item,
          alias,
          length: alias.length
        });
      }
    }
  }

  if (wordMatched.length > 0) {
    // Check if query names two different additives by name
    const distinctAdditives = new Set(wordMatched.map(m => m.additive.id));
    if (distinctAdditives.size > 1) {
      return null;
    }

    const maxLength = Math.max(...wordMatched.map(m => m.length));
    const longestMatches = wordMatched.filter(m => m.length === maxLength);
    const longestDistinct = new Set(longestMatches.map(m => m.additive.id));

    // If query names two different additives or two tie
    if (longestDistinct.size === 1) {
      return longestMatches[0].additive;
    }
    return null;
  }

  // 5) A part of a name of four letters or more that fits exactly one additive
  if (lowerQuery.length >= 4) {
    const partMatches = new Set();
    for (const item of ADDITIVES_DATA) {
      const aliases = getAdditiveAliases(item);
      if (aliases.some(a => a.includes(lowerQuery))) {
        partMatches.add(item);
      }
    }
    if (partMatches.size === 1) {
      return Array.from(partMatches)[0];
    }
  }

  return null;
}

/**
 * Scans an ingredient list:
 * - Flags an additive only when a whole-word E-number (normalised) or one of its names appears in list
 * - Whole-word checks for combinations, banned notes, allergens and dietary flags (e.g. 'eggplant' never flags 'egg')
 */
export function scanIngredientList(ingredients) {
  if (!ingredients || typeof ingredients !== 'string') {
    return {
      flaggedCount: 0,
      flaggedAdditives: [],
      allergens: [],
      combinations: [],
      bannedAlerts: [],
      dietaryFlags: []
    };
  }

  const normalized = normalizeENumberQuery(ingredients);
  const flaggedAdditives = [];
  const flaggedIds = new Set();

  for (const item of ADDITIVES_DATA) {
    let matched = false;

    // Check whole word E-number
    if (item.eNumber && item.eNumber.startsWith('E')) {
      const eRegex = new RegExp('(?:^|[^a-z0-9])' + item.eNumber + '(?:$|[^a-z0-9])', 'i');
      if (eRegex.test(normalized)) {
        matched = true;
      }
    }

    // Check aliases as whole words
    if (!matched) {
      const aliases = getAdditiveAliases(item);
      for (const alias of aliases) {
        const regex = new RegExp('(?:^|[^a-z0-9])' + escapeRegex(alias) + '(?:$|[^a-z0-9])', 'i');
        if (regex.test(normalized)) {
          matched = true;
          break;
        }
      }
    }

    if (matched && !flaggedIds.has(item.id)) {
      flaggedIds.add(item.id);
      flaggedAdditives.push(item);
    }
  }

  // Whole-word allergen checks
  const allergens = [];
  const allergenDefs = [
    { name: 'Egg', regex: /\b(eggs?|egg\s+whites?|egg\s+yolks?|albumen)\b/i },
    { name: 'Milk / Dairy', regex: /\b(milks?|dairy|whey|casein|caseinates?|cheese|butter|cream|lactose)\b/i },
    { name: 'Soy', regex: /\b(soya?|soybeans?|tofu|edamame)\b/i },
    { name: 'Gluten / Wheat', regex: /\b(wheat|barley|rye|gluten|spelt|flour)\b/i },
    { name: 'Peanut', regex: /\b(peanuts?|groundnuts?)\b/i },
    { name: 'Tree Nut', regex: /\b(almonds?|walnuts?|cashews?|pistachios?|pecans?|hazelnuts?|macadamias?)\b/i },
    { name: 'Fish', regex: /\b(fish|salmon|tuna|cod|anchov(y|ies))\b/i },
    { name: 'Crustacean / Shellfish', regex: /\b(crustaceans?|shrimps?|prawns?|crabs?|lobsters?|clams?|mussels?)\b/i },
    { name: 'Sulfites', regex: /\b(sulfites?|sulphites?|sulfur\s+dioxide|sulphur\s+dioxide)\b/i },
    { name: 'Sesame', regex: /\b(sesame|tahini)\b/i }
  ];

  for (const a of allergenDefs) {
    if (a.regex.test(normalized)) {
      allergens.push(a.name);
    }
  }

  // Combinations & Synergy checks
  const combinations = [];
  const hasBenzoate = flaggedIds.has('E211') || /\b(sodium\s+benzoate|benzoate)\b/i.test(normalized);
  const hasAscorbic = flaggedIds.has('E300') || /\b(ascorbic\s+acid|vitamin\s+c)\b/i.test(normalized);
  if (hasBenzoate && hasAscorbic) {
    combinations.push('Critical Cocktail: Sodium Benzoate (E211) + Ascorbic Acid (E300) in acidic solution can catalyze benzene formation.');
  }

  const hasSouthamptonColor = ['E102', 'E110', 'E129'].some(id => flaggedIds.has(id));
  if (hasSouthamptonColor && hasBenzoate) {
    combinations.push('Southampton Synergy: Synthetic azo colorants paired with sodium benzoate exacerbate hyperactivity and histamine response.');
  }

  // Banned substance alerts
  const bannedAlerts = [];
  for (const item of flaggedAdditives) {
    if (item.riskLevel === 'BANNED' || (item.bannedIn && item.bannedIn.length > 0)) {
      bannedAlerts.push(`${item.name} (${item.eNumber}): Regulatory restrictions or bans present.`);
    }
  }

  // Dietary flags
  const dietaryFlags = [];
  if (/\b(pork|gelatin|lard|bacon|tallow|carmine|cochineal)\b/i.test(normalized)) {
    dietaryFlags.push('Contains animal-derived ingredients (Not vegan/vegetarian/halal/kosher).');
  }

  return {
    flaggedCount: flaggedAdditives.length,
    flaggedAdditives,
    allergens,
    combinations,
    bannedAlerts,
    dietaryFlags
  };
}

/**
 * Searches additives:
 * - Treats colour/color, flavour/flavor, sulphite/sulfite, sulphur/sulfur as same word
 * - Category 'banned' matches E171, E924a and any additive whose risk level says BANNED
 * Returns list (empty list is valid)
 */
export function searchAdditives({ query, category } = {}) {
  let list = ADDITIVES_DATA;

  if (category) {
    const normCat = normalizeVariant(category.trim());
    if (normCat === 'banned') {
      list = list.filter(
        a => a.id === 'E171' || a.id === 'E924a' || (a.riskLevel && a.riskLevel.toUpperCase() === 'BANNED')
      );
    } else {
      list = list.filter(a => normalizeVariant(a.category).includes(normCat));
    }
  }

  if (query) {
    const normQuery = normalizeVariant(query.trim());
    list = list.filter(item => {
      const inName = normalizeVariant(item.name).includes(normQuery);
      const inCode = item.eNumber.toLowerCase().includes(normQuery);
      const inChem = item.chemicalName ? normalizeVariant(item.chemicalName).includes(normQuery) : false;
      const inDesc = normalizeVariant(item.description).includes(normQuery);
      const inAliases = getAdditiveAliases(item).some(a => normalizeVariant(a).includes(normQuery));
      return inName || inCode || inChem || inDesc || inAliases;
    });
  }

  return list;
}

/**
 * Checks nutrition:
 * 1) Exact English or Hebrew name
 * 2) Query that contains a full name
 * 3) Start-of-word part of 3 letters or more that fits one food only
 */
export function checkNutrition(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim();
  if (!q) return null;
  const lowerQ = q.toLowerCase();

  // 1) Exact English or Hebrew name
  const exactMatches = NUTRITION_DATA.filter(
    f => f.name.toLowerCase() === lowerQ || (f.hebrewName && f.hebrewName === q)
  );
  if (exactMatches.length === 1) return exactMatches[0];
  if (exactMatches.length > 1) return null;

  // 2) Query that contains a full name
  const containedFoods = [];
  for (const f of NUTRITION_DATA) {
    const enName = f.name.toLowerCase();
    const heName = f.hebrewName;
    const regexEn = new RegExp('(?:^|[^a-z0-9])' + escapeRegex(enName) + '(?:$|[^a-z0-9])', 'i');
    const hasEn = regexEn.test(lowerQ);
    const hasHe = heName && q.includes(heName);
    if (hasEn || hasHe) {
      containedFoods.push(f);
    }
  }
  if (containedFoods.length === 1) return containedFoods[0];
  if (containedFoods.length > 1) return null;

  // 3) Start-of-word part of 3 letters or more that fits one food only
  if (q.length >= 3) {
    const prefixMatches = NUTRITION_DATA.filter(f => {
      const enWords = f.name.toLowerCase().split(/\s+/);
      const enMatch = enWords.some(w => w.startsWith(lowerQ));
      const heMatch = f.hebrewName ? f.hebrewName.startsWith(q) : false;
      return enMatch || heMatch;
    });
    if (prefixMatches.length === 1) return prefixMatches[0];
  }

  return null;
}

/**
 * Checks pesticide MRL:
 * - A pesticide named as a whole word, or its exact CAS number, wins over a crop.
 * - Compare crops in singular form on both sides (tomatoes to tomato, strawberries to strawberry, apples to apple).
 * - A crop answers only when the query names nothing but crops and exactly one pesticide lists that crop;
 *   "mancozeb wheat" and "wheat" return null.
 */
export function checkPesticideMrl(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim();
  if (!q) return null;
  const lowerQ = q.toLowerCase();

  // All known crops in dataset singularized
  const allKnownCrops = new Set();
  for (const p of PESTICIDES_DATA) {
    for (const c of p.crops) {
      allKnownCrops.add(singularizeCrop(c));
    }
  }

  // Check if any pesticide is named as a whole word, or exact CAS
  const pesticideMatches = [];
  for (const p of PESTICIDES_DATA) {
    const isCas = p.casNumber.toLowerCase() === lowerQ;
    const nameRegex = new RegExp('(?:^|[^a-z0-9])' + escapeRegex(p.name) + '(?:$|[^a-z0-9])', 'i');
    const isName = nameRegex.test(lowerQ);
    if (isCas || isName) {
      pesticideMatches.push(p);
    }
  }

  if (pesticideMatches.length > 1) {
    return null; // multiple pesticides named
  }

  if (pesticideMatches.length === 1) {
    const matchedPesticide = pesticideMatches[0];

    // Check if the query ALSO mentions any crops
    const queryTokens = lowerQ
      .split(/[^a-z0-9]+/)
      .filter(t => t.length > 0)
      .map(singularizeCrop);

    const cropsInQuery = queryTokens.filter(t => allKnownCrops.has(t));

    // If query mentioned crops: does this pesticide list ALL of those crops?
    if (cropsInQuery.length > 0) {
      const pesticideCropsSingular = matchedPesticide.crops.map(singularizeCrop);
      const allCropsCovered = cropsInQuery.every(c => pesticideCropsSingular.includes(c));
      if (!allCropsCovered) {
        // e.g. "mancozeb wheat" where mancozeb does not cover wheat
        return null;
      }
    }

    return matchedPesticide;
  }

  // No pesticide name or CAS in query.
  // "A crop answers only when the query names nothing but crops and exactly one pesticide lists that crop"
  const tokens = lowerQ
    .split(/[^a-z0-9]+/)
    .filter(t => t.length > 0);

  if (tokens.length === 0) return null;

  // Verify that EVERY token in the query is a recognized crop
  const cropsQueried = [];
  for (const token of tokens) {
    const sing = singularizeCrop(token);
    if (!allKnownCrops.has(sing)) {
      return null; // query does not name "nothing but crops"
    }
    cropsQueried.push(sing);
  }

  // Find pesticides that cover all crops queried
  const matchingPesticides = PESTICIDES_DATA.filter(p => {
    const pCropsSingular = p.crops.map(singularizeCrop);
    return cropsQueried.every(cq => pCropsSingular.includes(cq));
  });

  if (matchingPesticides.length === 1) {
    return matchingPesticides[0];
  }

  // If 0 or >1 (like "wheat" which is in both glyphosate and cypermethrin), return null
  return null;
}
