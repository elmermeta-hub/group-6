/**
 * NutriSafe ToxiScan & Kinetic Pulse - Curated Demo Dataset
 * All records are demo records bundled with this app.
 * Traceability and limits state explicitly that this is a demo dataset.
 */

export const DEMO_SENTENCE = 'Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.';

export const ADDITIVES_DATA = [
  {
    id: 'E102',
    eNumber: 'E102',
    name: 'Tartrazine',
    chemicalName: 'Trisodium 5-hydroxy-1-(4-sulfonatophenyl)-4-(4-sulfonatophenylazo)pyrazole-3-carboxylate',
    casNumber: '1934-21-0',
    category: 'Color',
    riskLevel: 'MODERATE',
    adi: '0-10 mg/kg bw',
    description: 'Synthetic lemon yellow azo dye widely utilized in energy drinks, sports hydration powders, and confectionery.',
    fitnessContext: 'Common in neon pre-workout mixes and electrolyte beverages. Can trigger histamine release or bronchospasm in aspirin-sensitive athletes.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Azo dye sensitivity', 'Cross-reactive with salicylates'],
    bannedIn: ['Austria (historical)', 'Norway (historical)'],
    warningNotes: ['Southampton Six warning: May have an adverse effect on activity and attention in children.']
  },
  {
    id: 'E110',
    eNumber: 'E110',
    name: 'Sunset Yellow FCF',
    chemicalName: 'Disodium 6-hydroxy-5-[(4-sulfophenyl)azo]-2-naphthalenesulfonate',
    casNumber: '2783-94-0',
    category: 'Color',
    riskLevel: 'MODERATE',
    adi: '0-4 mg/kg bw',
    description: 'Synthetic orange azo dye used in recovery gels, flavored amino acid beverages, and sports nutrition bars.',
    fitnessContext: 'Used for orange/citrus pre-workout visual cues. Associated with allergic urticaria in susceptible athletes.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Azo dye sensitivity'],
    bannedIn: [],
    warningNotes: ['Southampton Six colorant.']
  },
  {
    id: 'E129',
    eNumber: 'E129',
    name: 'Allura Red AC',
    chemicalName: 'Disodium 6-hydroxy-5-[(2-methoxy-5-methyl-4-sulfophenyl)azo]-2-naphthalenesulfonate',
    casNumber: '25956-17-6',
    category: 'Color',
    riskLevel: 'MODERATE',
    adi: '0-7 mg/kg bw',
    description: 'Red azo dye common in pre-workout fruit punch formulations and intra-workout BCAA formulas.',
    fitnessContext: 'Provides vibrant red fruit-punch color in pre-workout stimulants; monitor for gut irritation during heavy training.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Azo dye sensitivity'],
    bannedIn: ['Denmark (restricted)', 'Belgium (restricted)'],
    warningNotes: ['Southampton Six colorant.']
  },
  {
    id: 'E133',
    eNumber: 'E133',
    name: 'Brilliant Blue FCF',
    chemicalName: 'Disodium 2-({4-[ethyl(3-sulfonatobenzyl)amino]phenyl}{4-[ethyl(3-sulfonatobenzyl)iminio]cyclohexa-2,5-dien-1-ylidene}methyl)benzenesulfonate',
    casNumber: '3844-45-9',
    category: 'Color',
    riskLevel: 'LOW',
    adi: '0-6 mg/kg bw',
    description: 'Triarylmethane synthetic blue colorant found in Blue Raspberry athletic supplements and isotonic beverages.',
    fitnessContext: 'Very low intestinal absorption (<5%); unabsorbed dye excreted intact.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E150d',
    eNumber: 'E150d',
    name: 'Sulfite Ammonia Caramel',
    chemicalName: 'Sulfite ammonia caramel color',
    casNumber: '8028-89-5',
    category: 'Color',
    riskLevel: 'MODERATE',
    adi: '0-200 mg/kg bw',
    description: 'Class IV caramel color prepared by controlled heat treatment of carbohydrates with ammonium and sulfite compounds.',
    fitnessContext: 'Found in cola-flavored athletic pre-workouts and dark protein shakes. May contain trace 4-MEI byproducts.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Contains trace sulfites'],
    bannedIn: [],
    warningNotes: ['Monitored for 4-methylimidazole (4-MEI) levels.']
  },
  {
    id: 'E171',
    eNumber: 'E171',
    name: 'Titanium Dioxide',
    chemicalName: 'Titanium(IV) oxide',
    casNumber: '13463-67-7',
    category: 'Color',
    riskLevel: 'BANNED',
    adi: 'Not established (Banned in EU)',
    description: 'White mineral pigment previously used for opacity in protein powders, capsules, and fitness glazes.',
    fitnessContext: 'Formally banned in food across the European Union (EFSA 2021) due to potential genotoxicity concerns with nanoparticle accumulation.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: ['European Union', 'Switzerland', 'Israel (phased out)'],
    warningNotes: ['EFSA concluded E171 can no longer be considered safe as a food additive due to genotoxicity concerns.']
  },
  {
    id: 'E200',
    eNumber: 'E200',
    name: 'Sorbic Acid',
    chemicalName: '2,4-Hexadienoic Acid',
    casNumber: '110-44-1',
    category: 'Preservative',
    riskLevel: 'LOW',
    adi: '0-11 mg/kg bw',
    description: 'Naturally derived or synthesized unsaturated fatty acid preservative active against molds and yeasts in athlete meal preps.',
    fitnessContext: 'Extensively metabolized via physiological beta-oxidation pathways identical to naturally occurring dietary fatty acids.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E202',
    eNumber: 'E202',
    name: 'Potassium Sorbate',
    chemicalName: 'Potassium (2E,4E)-hexa-2,4-dienoate',
    casNumber: '24634-61-5',
    category: 'Preservative',
    riskLevel: 'LOW',
    adi: '0-11 mg/kg bw',
    description: 'Potassium salt of sorbic acid used to inhibit yeast and fungal spoilage in liquid energy pouches and sports syrups.',
    fitnessContext: 'Rapidly broken down in the liver into water and carbon dioxide during normal metabolic activity.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E211',
    eNumber: 'E211',
    name: 'Sodium Benzoate',
    chemicalName: 'Sodium benzenecarboxylate',
    casNumber: '532-32-1',
    category: 'Preservative',
    riskLevel: 'MODERATE',
    adi: '0-5 mg/kg bw',
    description: 'Aromatic preservative widely used in acidic sports drinks, hydration concentrates, and fruit sauces.',
    fitnessContext: 'Caution when combined with Vitamin C (Ascorbic Acid) in liquid RTD drinks, as heat/light exposure can catalyze trace benzene formation.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Benzoate sensitivity'],
    bannedIn: [],
    warningNotes: ['Critical cocktail risk: When paired with Ascorbic Acid (E300) under acidic conditions and UV/heat, trace benzene may form.']
  },
  {
    id: 'E220',
    eNumber: 'E220',
    name: 'Sulfur Dioxide',
    chemicalName: 'Sulphur dioxide',
    casNumber: '7446-09-5',
    category: 'Preservative',
    riskLevel: 'HIGH',
    adi: '0-0.7 mg/kg bw',
    description: 'Antimicrobial and antioxidant gas used in dried fruits (athletic trail mixes, raisins, apricots) and sports bars.',
    fitnessContext: 'High allergen alert: potent trigger for exercise-induced bronchospasm (EIB) and asthmatic reactions.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Sulfites / Sulphites (Mandatory declaration if >10 mg/kg)'],
    bannedIn: [],
    warningNotes: ['Severe asthmatic bronchospasm risk.']
  },
  {
    id: 'E223',
    eNumber: 'E223',
    name: 'Sodium Metabisulfite',
    chemicalName: 'Disodium disulfite',
    casNumber: '7681-57-4',
    category: 'Preservative',
    riskLevel: 'HIGH',
    adi: '0-0.7 mg/kg bw',
    description: 'Inorganic sulfite salt utilized as a preservative and dough conditioner in commercial high-carb energy snacks.',
    fitnessContext: 'Inhibits thiamine (Vitamin B1) bioavailability; athletes dependent on B-vitamin carb metabolism should moderate intake.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Sulfites'],
    bannedIn: [],
    warningNotes: ['Destroys thiamine (Vitamin B1). High respiratory reactivity in athletes with asthma.']
  },
  {
    id: 'E250',
    eNumber: 'E250',
    name: 'Sodium Nitrite',
    chemicalName: 'Sodium nitrite',
    casNumber: '7632-00-0',
    category: 'Preservative',
    riskLevel: 'HIGH',
    adi: '0-0.07 mg/kg bw',
    description: 'Curing agent used in athlete jerky, turkey bacon, and processed meats to prevent Clostridium botulinum growth.',
    fitnessContext: 'While dietary nitrates from beet juice aid athletic vasodilation, high-heat cooking of nitrites forms carcinogenic nitrosamines.',
    dietary: {
      vegan: false,
      vegetarian: false,
      kosher: false,
      halal: false,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['Reacts with secondary amines at high cooking temperatures to yield nitrosamines.']
  },
  {
    id: 'E300',
    eNumber: 'E300',
    name: 'Ascorbic Acid (Vitamin C)',
    chemicalName: '(5R)-[(1S)-1,2-dihydroxyethyl]-3,4-dihydroxyfuran-2(5H)-one',
    casNumber: '50-81-7',
    category: 'Antioxidant',
    riskLevel: 'LOW',
    adi: 'Not limited',
    description: 'Essential water-soluble micronutrient and natural antioxidant used to protect nutrients and preserve freshness.',
    fitnessContext: 'Key for athletic collagen synthesis and immune defense; high doses immediately post-training (>1000mg) may blunt mitochondrial adaptation.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['Pairs with E211 in drinks to form benzene if unbuffered.']
  },
  {
    id: 'E320',
    eNumber: 'E320',
    name: 'Butylated Hydroxyanisole (BHA)',
    chemicalName: '2-tert-butyl-4-methoxyphenol',
    casNumber: '25013-16-5',
    category: 'Antioxidant',
    riskLevel: 'HIGH',
    adi: '0-1.0 mg/kg bw',
    description: 'Synthetic phenolic antioxidant used to retard oxidative rancidity in fats, oils, and sports energy chews.',
    fitnessContext: 'Classified by IARC as Group 2B (possibly carcinogenic); potential endocrine disruptor. Clean-label athletes prefer rosemary extract.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: ['Restricted in infant nutrition and EU organic foods'],
    warningNotes: ['Endocrine disrupting potential; possible carcinogen.']
  },
  {
    id: 'E321',
    eNumber: 'E321',
    name: 'Butylated Hydroxytoluene (BHT)',
    chemicalName: '2,6-di-tert-butyl-4-methylphenol',
    casNumber: '128-37-0',
    category: 'Antioxidant',
    riskLevel: 'MODERATE',
    adi: '0-0.25 mg/kg bw',
    description: 'Lipophilic organic compound used to prevent oxidation in lipid-rich nutrition supplements and omega capsules.',
    fitnessContext: 'Fat-soluble antioxidant that bioaccumulates in adipose tissue; European limits were lowered due to liver stress markers.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['Accumulates in fatty tissues.']
  },
  {
    id: 'E322',
    eNumber: 'E322',
    name: 'Lecithins',
    chemicalName: 'Phosphatidylcholine mixture',
    casNumber: '8028-43-5',
    category: 'Emulsifier',
    riskLevel: 'LOW',
    adi: 'Not limited',
    description: 'Natural phospholipid emulsifier extracted from soybeans, sunflower seeds, or egg yolks for instantizing protein powders.',
    fitnessContext: 'Crucial for smooth mixing of whey protein isolate shakes and pre-workout formulas without clumping. Provides dietary choline.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['May be derived from Soy (requires allergen disclosure if soy-derived)'],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E330',
    eNumber: 'E330',
    name: 'Citric Acid',
    chemicalName: '2-hydroxypropane-1,2,3-tricarboxylic acid',
    casNumber: '77-92-9',
    category: 'Acidity Regulator',
    riskLevel: 'LOW',
    adi: 'Not limited',
    description: 'Organic tricarboxylic acid produced commercially via Aspergillus niger fermentation of carbohydrate substrates.',
    fitnessContext: 'Core metabolic intermediate in the Krebs Cycle (citric acid cycle) for cellular ATP energy production during intense exercise.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E407',
    eNumber: 'E407',
    name: 'Carrageenan',
    chemicalName: 'Sulfated galactan polysaccharide',
    casNumber: '9000-07-1',
    category: 'Thickener',
    riskLevel: 'MODERATE',
    adi: '0-75 mg/kg bw',
    description: 'Hydrocolloid extracted from red edible seaweeds used to stabilize read-to-drink (RTD) dairy and plant protein shakes.',
    fitnessContext: 'Subject of gastrointestinal debate; degraded forms (poligeenan) induce colitis, while food-grade E407 causes bloating in sensitive gut athletes.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: ['Banned in infant formula in the EU'],
    warningNotes: ['Associated with athletic gut discomfort and low-grade mucosal irritation in susceptible individuals.']
  },
  {
    id: 'E412',
    eNumber: 'E412',
    name: 'Guar Gum',
    chemicalName: 'Galactomannan polysaccharide',
    casNumber: '9000-30-0',
    category: 'Thickener',
    riskLevel: 'LOW',
    adi: 'Not limited',
    description: 'Natural soluble dietary fiber milled from guar beans (Cyamopsis tetragonoloba) providing thickness and satiety.',
    fitnessContext: 'Slows gastric emptying which provides prolonged satiety; high doses prior to training can induce cramping or gas.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E415',
    eNumber: 'E415',
    name: 'Xanthan Gum',
    chemicalName: 'Polysaccharide from Xanthomonas campestris',
    casNumber: '11138-66-2',
    category: 'Thickener',
    riskLevel: 'LOW',
    adi: 'Not limited',
    description: 'Fermented polysaccharide hydrocolloid used to create rich texture and emulsion stability in gluten-free athlete meals and smoothies.',
    fitnessContext: 'Zero caloric absorption; acts as prebiotic fiber. Well tolerated up to 15g/day.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'E471',
    eNumber: 'E471',
    name: 'Mono- and Diglycerides of Fatty Acids',
    chemicalName: 'Mono- and diglycerides of fatty acids',
    casNumber: '67701-33-1',
    category: 'Emulsifier',
    riskLevel: 'LOW',
    adi: 'Not limited',
    description: 'Food emulsifier produced from plant or animal fats used to preserve softness in athlete energy bars and bakery items.',
    fitnessContext: 'May contain trace industrially produced trans fats; clean fitness nutrition prefers whole food fat sources.',
    dietary: {
      vegan: false, // may be animal derived unless specified
      vegetarian: true,
      kosher: false,
      halal: false,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['Source origin can be animal tallow or vegetable oil. Trace trans-fat byproduct risk.']
  },
  {
    id: 'E621',
    eNumber: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    chemicalName: 'Sodium 2-aminopentanedioate',
    casNumber: '142-47-2',
    category: 'Flavor Enhancer',
    riskLevel: 'LOW',
    adi: '30 mg/kg bw (EFSA 2017)',
    description: 'Sodium salt of glutamic acid producing savory umami flavor profile in savory pre-meal broths and athlete meal preps.',
    fitnessContext: 'Glutamate is a key neuro-excitatory amino acid and fuel for enterocytes; safe for athletes despite historic anecdotal myths.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['Mild flushing or headache in small subset of hyper-responsive individuals.']
  },
  {
    id: 'E924a',
    eNumber: 'E924a',
    name: 'Potassium Bromate',
    chemicalName: 'Potassium bromate',
    casNumber: '7758-01-2',
    category: 'Flour Treatment Agent',
    riskLevel: 'BANNED',
    adi: 'Banned in food',
    description: 'Oxidizing agent previously used as a flour improver to strengthen dough elasticity and bread volume.',
    fitnessContext: 'Recognized category 2B carcinogen causing renal and thyroid tumors in animal toxicology; strictly banned across the EU, Canada, and UK.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: ['European Union', 'United Kingdom', 'Canada', 'Brazil', 'China', 'India'],
    warningNotes: ['Banned carcinogen. Causes oxidative DNA damage.']
  },
  {
    id: 'E950',
    eNumber: 'E950',
    name: 'Acesulfame Potassium (Ace-K)',
    chemicalName: 'Potassium 6-methyl-2,2-dioxo-2H-1,2λ6,3-oxathiazin-4-olate',
    casNumber: '55589-62-3',
    category: 'Sweetener',
    riskLevel: 'MODERATE',
    adi: '0-9 mg/kg bw',
    description: 'Calorie-free artificial sweetener 200x sweeter than sucrose, commonly blended with sucralose in zero-sugar pre-workouts.',
    fitnessContext: 'Excreted unchanged via kidneys without glycemic or insulin response; ongoing investigations regarding gut microbiome shifts.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['Heat stable. Often combined with sucralose for synergy.']
  },
  {
    id: 'E951',
    eNumber: 'E951',
    name: 'Aspartame',
    chemicalName: 'Methyl L-alpha-aspartyl-L-phenylalaninate',
    casNumber: '22839-47-0',
    category: 'Sweetener',
    riskLevel: 'MODERATE',
    adi: '0-40 mg/kg bw',
    description: 'Low-calorie dipeptide artificial sweetener used in diet sodas, flavored BCAAs, and electrolyte chews.',
    fitnessContext: 'Metabolized to phenylalanine, aspartic acid, and trace methanol. Unsuitable for individuals with rare genetic phenylketonuria (PKU).',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Phenylketonuria (PKU) warning mandatory'],
    bannedIn: [],
    warningNotes: ['Contains a source of phenylalanine. IARC Group 2B classification.']
  },
  {
    id: 'E955',
    eNumber: 'E955',
    name: 'Sucralose',
    chemicalName: '1,6-Dichloro-1,6-dideoxy-beta-D-fructofuranosyl-4-chloro-4-deoxy-alpha-D-galactopyranoside',
    casNumber: '56038-13-2',
    category: 'Sweetener',
    riskLevel: 'LOW',
    adi: '0-15 mg/kg bw',
    description: 'Chlorinated disaccharide sweetener 600x sweeter than sucrose, standard in sports whey protein and fitness drinks.',
    fitnessContext: 'Zero glycemic spike; optimal for ketogenic and cutting phases. High-heat baking (>120°C) may form chloropropanols.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: []
  },
  {
    id: 'INGR-PALM',
    eNumber: 'INGR-PALM',
    name: 'Palm Oil',
    chemicalName: 'Elaeis guineensis fruit lipid',
    casNumber: '8002-75-3',
    category: 'Fat / Lipid',
    riskLevel: 'MODERATE',
    adi: 'Not limited',
    description: 'Tropical vegetable oil high in palmitic acid saturated fats, utilized in commercial peanut butters and workout protein bars.',
    fitnessContext: 'High saturated fatty acid proportion (~50% palmitic acid); heavy consumption elevates LDL-cholesterol markers compared to olive or avocado oils.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: [],
    warningNotes: ['High palmitic saturated fat content. Environmental and cardiovascular impact.']
  },
  {
    id: 'INGR-TRANSFAT',
    eNumber: 'INGR-TRANSFAT',
    name: 'Partially Hydrogenated Oil (Trans Fat)',
    chemicalName: 'Trans-isomer fatty acid triglycerides',
    casNumber: '68334-00-9',
    category: 'Fat / Lipid',
    riskLevel: 'BANNED',
    adi: '0 (Prohibited)',
    description: 'Industrially hydrogenated vegetable oils containing trans double bonds, formerly widespread in baked sports snacks.',
    fitnessContext: 'Directly impairs athletic endothelial vascular function, spikes systemic inflammation (hs-CRP), and elevates cardiovascular risk.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: [],
    bannedIn: ['United States (FDA PHO ban)', 'European Union (<2g/100g fat)', 'Israel'],
    warningNotes: ['Major cardiovascular hazard. Completely banned as GRAS by FDA.']
  },
  {
    id: 'INGR-HFCS',
    eNumber: 'INGR-HFCS',
    name: 'High Fructose Corn Syrup',
    chemicalName: 'Glucose-fructose syrup',
    casNumber: '977042-84-4',
    category: 'Sweetener / Syrup',
    riskLevel: 'HIGH',
    adi: 'Should be minimized',
    description: 'Enzymatically processed cornstarch liquid sweetener with elevated free fructose content (typically HFCS-55 or HFCS-42).',
    fitnessContext: 'Hepatic fructose overload bypasses phosphofructokinase, stimulating hepatic de novo lipogenesis and visceral fat storage.',
    dietary: {
      vegan: true,
      vegetarian: true,
      kosher: true,
      halal: true,
      traceability: 'Demo record: no batch or certification data'
    },
    allergens: ['Corn derivative'],
    bannedIn: [],
    warningNotes: ['Associated with hepatic steatosis, metabolic dysfunction, and visceral adiposity.']
  }
];

export const NUTRITION_DATA = [
  {
    id: 'food-hummus',
    name: 'Hummus',
    hebrewName: 'חומוס',
    serving: '100g',
    calories: 166,
    protein: 7.9,
    carbs: 14.3,
    fat: 9.6,
    fiber: 6.0,
    category: 'Legume / Dip',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Post-workout complex carbohydrates and plant protein. Rich in tahini healthy fats, iron, and slow-burning energy.',
    micronutrients: {
      potassium: 289,
      sodium: 379,
      iron: 2.4,
      magnesium: 71,
      calcium: 38
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-banana',
    name: 'Banana',
    hebrewName: 'בננה',
    serving: '100g (1 medium)',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    category: 'Fruit / Fast Carb',
    exerciseTiming: 'pre-workout',
    exerciseRecommendation: 'Ideal pre-workout fuel 30-45 minutes before training. Rapid gastric emptying, easily digestible glucose/fructose, and high potassium to prevent cramping.',
    micronutrients: {
      potassium: 358,
      sodium: 1,
      vitaminC: 8.7,
      magnesium: 27,
      vitaminB6: 0.4
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-oats',
    name: 'Rolled Oats',
    hebrewName: 'שיבולת שועל',
    serving: '100g dry',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    category: 'Whole Grain',
    exerciseTiming: 'pre-workout',
    exerciseRecommendation: 'Premier sustained pre-exercise endurance fuel eaten 90-120 minutes prior. Low glycemic index with beta-glucan soluble fiber for prolonged glycogen preservation.',
    micronutrients: {
      potassium: 429,
      iron: 4.7,
      magnesium: 177,
      zinc: 4.0,
      thiamine: 0.7
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-whey',
    name: 'Whey Protein',
    hebrewName: 'חלבון מי גבינה',
    serving: '30g scoop',
    calories: 120,
    protein: 25.0,
    carbs: 1.5,
    fat: 1.0,
    fiber: 0.0,
    category: 'Protein Supplement',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Rapid post-workout muscle protein synthesis (MPS) initiator. High leucine content (~2.7g) swiftly triggers mTOR signaling for maximum hypertrophy and recovery.',
    micronutrients: {
      calcium: 150,
      potassium: 160,
      sodium: 70,
      bcaaTotal: 5.5
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-chicken',
    name: 'Chicken Breast',
    hebrewName: 'חזה עוף',
    serving: '100g grilled',
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    fiber: 0.0,
    category: 'Poultry',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Clean lean animal protein for post-workout repair and meal prep. Extremely high protein-to-calorie density with comprehensive essential amino acid profile.',
    micronutrients: {
      potassium: 256,
      sodium: 74,
      phosphorus: 228,
      niacin: 13.7,
      vitaminB6: 0.6
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-sweetpotato',
    name: 'Sweet Potato',
    hebrewName: 'בטטה',
    serving: '100g baked',
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    fiber: 3.0,
    category: 'Tuber / Complex Carb',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Post-workout glycogen recovery complex carb. High in beta-carotene antioxidants to fight exercise-induced oxidative stress, plus gentle on sensitive digestive tracts.',
    micronutrients: {
      potassium: 337,
      vitaminA: 709,
      vitaminC: 2.4,
      manganese: 0.26
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-greekyogurt',
    name: 'Greek Yogurt',
    hebrewName: 'יוגורט יווני',
    serving: '100g 0% fat',
    calories: 59,
    protein: 10.0,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0.0,
    category: 'Dairy',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Excellent blend of fast whey and slow-digesting micellar casein protein. Delivers sustained amino acid release alongside live probiotics for athlete gut microbiome health.',
    micronutrients: {
      calcium: 110,
      potassium: 141,
      sodium: 36,
      phosphorus: 135
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-salmon',
    name: 'Salmon',
    hebrewName: 'סלמון',
    serving: '100g cooked',
    calories: 208,
    protein: 20.4,
    carbs: 0.0,
    fat: 13.4,
    fiber: 0.0,
    category: 'Fish / Healthy Fat',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Anti-inflammatory athletic recovery powerhouse. High in EPA/DHA omega-3 fatty acids that mitigate delayed-onset muscle soreness (DOMS) and accelerate joint tissue repair.',
    micronutrients: {
      potassium: 384,
      vitaminD: 11.0,
      vitaminB12: 3.2,
      selenium: 36.5
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-rice',
    name: 'White Rice',
    hebrewName: 'אורז לבן',
    serving: '100g cooked',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fat: 0.3,
    fiber: 0.4,
    category: 'Grain',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Premier fast-glycogen post-exercise replenishment staple. Hypoallergenic, virtually zero antinutrients, and rapid insulinogenic spike for glycogen shuttling.',
    micronutrients: {
      potassium: 35,
      sodium: 1,
      iron: 1.2,
      thiamine: 0.2
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-egg',
    name: 'Egg',
    hebrewName: 'ביצה',
    serving: '100g (2 large)',
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    fat: 9.5,
    fiber: 0.0,
    category: 'Protein',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Biological Value 100 gold standard whole protein. Egg yolks supply lutein, zeaxanthin, choline, and micronutrients essential for hormone synthesis.',
    micronutrients: {
      choline: 294,
      vitaminD: 2.0,
      vitaminB12: 0.89,
      iron: 1.75
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-peanutbutter',
    name: 'Peanut Butter',
    hebrewName: 'חמאת בוטנים',
    serving: '32g (2 tbsp)',
    calories: 188,
    protein: 8.0,
    carbs: 6.4,
    fat: 16.0,
    fiber: 1.9,
    category: 'Nut Butter',
    exerciseTiming: 'pre-workout',
    exerciseRecommendation: 'Calorie-dense sustained energy for high-volume training days. Consume 2-3 hours before exercise with whole-grain toast or oatmeal for balanced endurance output.',
    micronutrients: {
      magnesium: 49,
      potassium: 208,
      vitaminE: 2.9,
      niacin: 4.2
    },
    traceability: 'Demo record: no batch or certification data'
  },
  {
    id: 'food-tartcherry',
    name: 'Tart Cherry',
    hebrewName: 'דובדבן חמוץ',
    serving: '100g juice',
    calories: 60,
    protein: 1.0,
    carbs: 14.0,
    fat: 0.1,
    fiber: 0.5,
    category: 'Recovery Drink',
    exerciseTiming: 'post-workout',
    exerciseRecommendation: 'Evidence-backed athletic recovery drink. Rich in anthocyanins and natural melatonin, proven to blunt inflammatory cytokines, alleviate DOMS, and enhance restorative sleep.',
    micronutrients: {
      potassium: 173,
      anthocyanins: 60,
      vitaminC: 10,
      melatonin: 0.01
    },
    traceability: 'Demo record: no batch or certification data'
  }
];

export const PESTICIDES_DATA = [
  {
    id: 'pest-glyphosate',
    name: 'Glyphosate',
    casNumber: '1071-83-6',
    chemicalFamily: 'Organophosphonate',
    crops: ['barley', 'oat', 'soybean', 'wheat'],
    mrlMgKg: 10.0,
    gaugeStatus: 'Within demo limits',
    toxicityClass: 'WHO Class III (Slightly hazardous)',
    fitnessNote: 'Broad-spectrum systemic herbicide. Heavy athletic consumption of non-organic grain meals monitored for potential intestinal epithelial permeability impact.'
  },
  {
    id: 'pest-chlorpyrifos',
    name: 'Chlorpyrifos',
    casNumber: '2921-88-2',
    chemicalFamily: 'Organophosphate',
    crops: ['citrus', 'apple', 'grape'],
    mrlMgKg: 0.01,
    gaugeStatus: 'Above demo limit',
    toxicityClass: 'WHO Class II (Moderately hazardous)',
    fitnessNote: 'Cholinesterase inhibitor banned for agricultural food use in the EU and US. Neurodevelopmental toxin requiring zero-tolerance screening.'
  },
  {
    id: 'pest-mancozeb',
    name: 'Mancozeb',
    casNumber: '8018-01-7',
    chemicalFamily: 'Dithiocarbamate',
    crops: ['potato', 'tomato', 'grape'],
    mrlMgKg: 2.0,
    gaugeStatus: 'Within demo limits',
    toxicityClass: 'WHO Class U (Unlikely to present acute hazard)',
    fitnessNote: 'Fungicide breaking down to ethylene thiourea (ETU); evaluated for potential endocrine disruption of athletic thyroid hormone production.'
  },
  {
    id: 'pest-imidacloprid',
    name: 'Imidacloprid',
    casNumber: '138261-41-3',
    chemicalFamily: 'Neonicotinoid',
    crops: ['lettuce', 'pepper', 'cucumber'],
    mrlMgKg: 0.5,
    gaugeStatus: 'Within demo limits',
    toxicityClass: 'WHO Class II (Moderately hazardous)',
    fitnessNote: 'Systemic insecticide acting on nicotinic acetylcholine receptors. Strictly restricted in the EU to protect pollinators and prevent dietary bioaccumulation.'
  },
  {
    id: 'pest-cypermethrin',
    name: 'Cypermethrin',
    casNumber: '52315-07-8',
    chemicalFamily: 'Pyrethroid',
    crops: ['cotton', 'brassica', 'wheat'],
    mrlMgKg: 0.05,
    gaugeStatus: 'Within demo limits',
    toxicityClass: 'WHO Class II (Moderately hazardous)',
    fitnessNote: 'Synthetic pyrethroid sodium-channel modulator used on outdoor commercial crops; rapidly cleared through urine but strictly regulated on fresh produce.'
  },
  {
    id: 'pest-boscalid',
    name: 'Boscalid',
    casNumber: '188425-85-6',
    chemicalFamily: 'Carboxamide',
    crops: ['strawberry'],
    mrlMgKg: 3.0,
    gaugeStatus: 'Within demo limits',
    toxicityClass: 'WHO Class U (Unlikely to present acute hazard)',
    fitnessNote: 'Succinate dehydrogenase inhibitor fungicide applied to pre-harvest berries. High stability in soil; monitored in endurance athlete fruit smoothies.'
  }
];

export const DATASET_COUNTS = {
  additivesCount: ADDITIVES_DATA.length,
  nutritionCount: NUTRITION_DATA.length,
  pesticidesCount: PESTICIDES_DATA.length,
  demoSentence: DEMO_SENTENCE
};
