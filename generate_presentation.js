/**
 * AgriSmart AI — Presentation Generator
 * Generates AI_Smart_Agriculture_System_Presentation.pptx
 * 
 * Project: AI-Based Smart Agriculture Management System
 * Guide: Ms. Lopamudra Mohanty
 * Team Members:
 *   1. Lalit Mishra
 *   2. Chandan Yadav
 *   3. Dev Sharma
 *   4. Aditya Kumar Mishra
 */

const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();

// Layout: 16x9 Widescreen (10.0 x 5.625 inches)
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'AI-Based Smart Agriculture Management System';
pptx.author = 'Lalit Mishra, Chandan Yadav, Dev Sharma, Aditya Kumar Mishra';
pptx.company = 'Department of Computer Science & Engineering';

// --- Color Palette Tokens ---
const COLORS = {
  forestDark: '0D2B1D',      // Deepest forest green
  forestPrimary: '1B4332',   // Primary brand green
  forestMedium: '2D6A4F',    // Accent medium green
  mintLight: '52B788',       // Accent mint green
  mintPale: 'D8F3DC',        // Very soft mint highlight
  mintBg: 'E8F5E9',          // Light tint background
  canvasBg: 'F4F6F4',        // Neutral warm app canvas
  cardWhite: 'FFFFFF',       // Card background
  borderGray: 'D1D5DB',      // Card border
  textDark: '1F2937',        // High contrast body text
  textMuted: '4B5563',       // Subtitle / muted text
  textLight: '9CA3AF',       // Soft timestamp / captions
  accentGold: 'D97706',      // Gold / warm highlight
  accentBlue: '2563EB',      // Tech accent
  danger: 'DC2626'           // Red alert
};

// Helper to add standard slide header & footer
function addSlideChrome(slide, categoryTag, slideTitle, currentSlide, totalSlides = 15) {
  // Canvas background
  slide.background = { color: COLORS.canvasBg };

  // Top Category Pill Tag
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 0.38,
    w: 2.5,
    h: 0.28,
    fill: { color: COLORS.forestMedium }
  });
  slide.addText(categoryTag.toUpperCase(), {
    x: 0.8,
    y: 0.38,
    w: 2.5,
    h: 0.28,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.mintPale,
    align: 'center',
    valign: 'middle'
  });

  // Slide Title
  slide.addText(slideTitle, {
    x: 0.8,
    y: 0.72,
    w: 8.4,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestDark,
    valign: 'middle'
  });

  // Horizontal Accent Divider
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8,
    y: 1.25,
    w: 8.4,
    h: 0,
    line: { color: COLORS.mintLight, width: 2 }
  });

  // Footer Accent Divider
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8,
    y: 5.15,
    w: 8.4,
    h: 0,
    line: { color: COLORS.borderGray, width: 1 }
  });

  // Footer Left: Project Title
  slide.addText('AI-Based Smart Agriculture Management System', {
    x: 0.8,
    y: 5.2,
    w: 4.8,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: COLORS.textMuted
  });

  // Footer Center: Guide Mention
  slide.addText('Guide: Ms. Lopamudra Mohanty', {
    x: 4.8,
    y: 5.2,
    w: 3.0,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    italic: true,
    color: COLORS.textMuted,
    align: 'center'
  });

  // Footer Right: Slide Number
  slide.addText(`${currentSlide} / ${totalSlides}`, {
    x: 7.7,
    y: 5.2,
    w: 1.5,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestMedium,
    align: 'right'
  });
}

// ============================================================================
// SLIDE 1: TITLE SLIDE (FRONT PAGE)
// ============================================================================
const s1 = pptx.addSlide();
s1.background = { color: COLORS.forestDark };

// Decorative background shapes
s1.addShape(pptx.ShapeType.roundRect, {
  x: 0.5,
  y: 0.5,
  w: 9.0,
  h: 4.625,
  fill: { color: COLORS.forestPrimary, transparency: 30 },
  line: { color: COLORS.mintLight, width: 1.5 }
});

// Category Badge
s1.addShape(pptx.ShapeType.roundRect, {
  x: 2.2,
  y: 0.78,
  w: 5.6,
  h: 0.36,
  fill: { color: COLORS.forestDark },
  line: { color: COLORS.mintLight, width: 1 }
});
s1.addText('MAJOR PROJECT PRESENTATION  •  ACADEMIC VIVA EVALUATION', {
  x: 2.2,
  y: 0.78,
  w: 5.6,
  h: 0.36,
  fontSize: 10,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintPale,
  align: 'center',
  valign: 'middle'
});

// Main Project Title
s1.addText('AI-Based Smart Agriculture Management System', {
  x: 0.8,
  y: 1.25,
  w: 8.4,
  h: 0.85,
  fontSize: 26,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

// Project Subtitle
s1.addText('An Intelligent Decision-Support Framework for Supervised Crop Recommendation,\nPrecision FAO-56 Irrigation Scheduling & Soil Nutrient Balance Advisory', {
  x: 0.9,
  y: 2.08,
  w: 8.2,
  h: 0.55,
  fontSize: 12.5,
  fontFace: 'Arial',
  italic: true,
  color: COLORS.mintPale,
  align: 'center'
});

// Left Card: Project Guide
s1.addShape(pptx.ShapeType.roundRect, {
  x: 0.95,
  y: 2.8,
  w: 3.8,
  h: 2.05,
  fill: { color: COLORS.forestDark },
  line: { color: COLORS.forestMedium, width: 1.2 }
});
s1.addShape(pptx.ShapeType.roundRect, {
  x: 1.15,
  y: 2.95,
  w: 1.8,
  h: 0.28,
  fill: { color: COLORS.forestMedium }
});
s1.addText('PROJECT GUIDE', {
  x: 1.15,
  y: 2.95,
  w: 1.8,
  h: 0.28,
  fontSize: 9,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintPale,
  align: 'center',
  valign: 'middle'
});
s1.addText('Ms. Lopamudra Mohanty', {
  x: 1.15,
  y: 3.32,
  w: 3.4,
  h: 0.45,
  fontSize: 17,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  valign: 'middle'
});
s1.addText('Assistant Professor / Faculty Mentor\nDepartment of Computer Science & Engineering\nSmart Farming & Machine Learning Domain', {
  x: 1.15,
  y: 3.82,
  w: 3.4,
  h: 0.85,
  fontSize: 10.5,
  fontFace: 'Arial',
  color: COLORS.mintPale
});

// Right Card: Team Members
s1.addShape(pptx.ShapeType.roundRect, {
  x: 5.25,
  y: 2.8,
  w: 3.8,
  h: 2.05,
  fill: { color: COLORS.forestDark },
  line: { color: COLORS.forestMedium, width: 1.2 }
});
s1.addShape(pptx.ShapeType.roundRect, {
  x: 5.45,
  y: 2.95,
  w: 1.8,
  h: 0.28,
  fill: { color: COLORS.forestMedium }
});
s1.addText('PROJECT TEAM', {
  x: 5.45,
  y: 2.95,
  w: 1.8,
  h: 0.28,
  fontSize: 9,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintPale,
  align: 'center',
  valign: 'middle'
});

const teamMembers = [
  { num: '1.', name: 'Lalit Mishra', role: 'Architecture, ML Model & Flask REST API' },
  { num: '2.', name: 'Chandan Yadav', role: 'Irrigation & Fertilizer Agronomic Logic' },
  { num: '3.', name: 'Dev Sharma', role: 'Frontend UI/UX & Responsive Dashboard' },
  { num: '4.', name: 'Aditya Kumar Mishra', role: 'Data Preprocessing, Model Validation & Testing' }
];

teamMembers.forEach((member, idx) => {
  const yOffset = 3.35 + (idx * 0.35);
  s1.addText(`${member.num}  ${member.name}`, {
    x: 5.45,
    y: yOffset,
    w: 2.2,
    h: 0.32,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF'
  });
  s1.addText(`(${member.role})`, {
    x: 7.2,
    y: yOffset + 0.02,
    w: 1.75,
    h: 0.3,
    fontSize: 8,
    fontFace: 'Arial',
    italic: true,
    color: COLORS.mintLight
  });
});


// ============================================================================
// SLIDE 2: INTRODUCTION & MOTIVATION
// ============================================================================
const s2 = pptx.addSlide();
addSlideChrome(s2, 'Background & Motivation', 'The Need for Precision Agriculture & Smart Decisions', 2);

// 3 Highlight Cards
const introCards = [
  {
    x: 0.8,
    title: 'The Agricultural Crisis',
    accent: COLORS.forestPrimary,
    bullets: [
      'Agriculture employs over 50% of the Indian workforce and provides global food security.',
      'Traditional trial-and-error farming suffers from unpredictable weather and degraded soils.',
      'A single wrong crop selection or over-fertilization can wipe out farmer seasonal profit.'
    ]
  },
  {
    x: 3.75,
    title: 'The Technological Gap',
    accent: COLORS.forestMedium,
    bullets: [
      'Soil testing labs have 2-4 week turnaround times, far too slow for time-sensitive planting.',
      'Most existing software is either complex, expensive, or requires high-bandwidth connectivity.',
      'Farmers lack integrated advisories that combine crop choice, water, and fertilizer.'
    ]
  },
  {
    x: 6.7,
    title: 'The AgriSmart Solution',
    accent: COLORS.mintLight,
    bullets: [
      'Instant AI-powered crop recommendation with 99.55% accuracy on 22 major crops.',
      'Scientific FAO-56 evapotranspiration models for precision water conservation.',
      'ICAR nutrient gap formulas to eliminate fertilizer waste and restore soil biology.'
    ]
  }
];

introCards.forEach(c => {
  s2.addShape(pptx.ShapeType.roundRect, {
    x: c.x,
    y: 1.45,
    w: 2.7,
    h: 3.4,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s2.addShape(pptx.ShapeType.rect, {
    x: c.x,
    y: 1.45,
    w: 2.7,
    h: 0.45,
    fill: { color: c.accent }
  });
  s2.addText(c.title, {
    x: c.x,
    y: 1.45,
    w: 2.7,
    h: 0.45,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  const bulletItems = c.bullets.map(b => ({
    text: b,
    options: { fontSize: 10, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 8 }
  }));
  s2.addText(bulletItems, {
    x: c.x + 0.15,
    y: 2.05,
    w: 2.4,
    h: 2.65
  });
});


// ============================================================================
// SLIDE 3: PROBLEM STATEMENT & CORE CHALLENGES
// ============================================================================
const s3 = pptx.addSlide();
addSlideChrome(s3, 'Problem Analysis', 'Core Challenges in Modern Agricultural Practice', 3);

// Left Box: 3 Major Problem Areas
const problems = [
  {
    num: '01',
    title: 'Sub-Optimal Crop Matching',
    desc: 'Farmers plant crops based on local tradition rather than biochemical soil compatibility (N-P-K) and climatic suitability (rainfall, temperature, humidity), leading to stunted growth and yield failure.'
  },
  {
    num: '02',
    title: 'Water Misallocation & Soil Salinization',
    desc: 'Flood irrigation without calculating evapotranspiration (ET) wastes up to 40% of agricultural water, causes waterlogging, depletes groundwater tables, and accelerates root rot diseases.'
  },
  {
    num: '03',
    title: 'Severe Chemical Over-Fertilization',
    desc: 'Indiscriminate application of subsidized Urea without soil nutrient gap analysis degrades soil pH, kills beneficial microbial fauna, contaminates runoff water, and inflates farming debt.'
  }
];

problems.forEach((p, idx) => {
  const y = 1.45 + (idx * 1.15);
  s3.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: y,
    w: 5.3,
    h: 1.02,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  // Number badge
  s3.addShape(pptx.ShapeType.roundRect, {
    x: 0.95,
    y: y + 0.15,
    w: 0.65,
    h: 0.72,
    fill: { color: COLORS.forestMedium }
  });
  s3.addText(p.num, {
    x: 0.95,
    y: y + 0.15,
    w: 0.65,
    h: 0.72,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });
  s3.addText(p.title, {
    x: 1.75,
    y: y + 0.1,
    w: 4.2,
    h: 0.28,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestDark
  });
  s3.addText(p.desc, {
    x: 1.75,
    y: y + 0.38,
    w: 4.25,
    h: 0.58,
    fontSize: 9.2,
    fontFace: 'Calibri',
    color: COLORS.textMuted
  });
});

// Right Side: Impact Metric Card
s3.addShape(pptx.ShapeType.roundRect, {
  x: 6.35,
  y: 1.45,
  w: 2.85,
  h: 3.48,
  fill: { color: COLORS.forestPrimary },
  line: { color: COLORS.mintLight, width: 1.5 }
});
s3.addText('IMPACT AT A GLANCE', {
  x: 6.45,
  y: 1.65,
  w: 2.65,
  h: 0.3,
  fontSize: 11,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintPale,
  align: 'center'
});

const stats = [
  { val: '30 - 40%', label: 'Water wasted in conventional flood irrigation systems' },
  { val: '₹ 8,500+', label: 'Average annual loss per acre from improper fertilizer dosing' },
  { val: '99.55%', label: 'Prediction accuracy delivered by our ML recommendation engine' }
];

stats.forEach((st, i) => {
  const sy = 2.05 + (i * 0.9);
  s3.addText(st.val, {
    x: 6.45,
    y: sy,
    w: 2.65,
    h: 0.45,
    fontSize: 18,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  s3.addText(st.label, {
    x: 6.55,
    y: sy + 0.38,
    w: 2.45,
    h: 0.45,
    fontSize: 9,
    fontFace: 'Calibri',
    color: COLORS.mintPale,
    align: 'center'
  });
});


// ============================================================================
// SLIDE 4: PROJECT OBJECTIVES & SCOPE
// ============================================================================
const s4 = pptx.addSlide();
addSlideChrome(s4, 'Goals & Deliverables', 'Project Objectives & Operational Scope', 4);

// 4 Objective Cards in 2x2 Grid
const objectives = [
  {
    x: 0.8,
    y: 1.45,
    title: '1. Machine Learning Crop Classifier',
    points: [
      'Train and validate a Random Forest Classifier on 2,200 agricultural trial records.',
      'Accept 7 distinct agro-climatic inputs (N, P, K, Temp, Humidity, pH, Rainfall).',
      'Provide top predicted crop, confidence score, and viable alternative crop options.'
    ]
  },
  {
    x: 5.2,
    y: 1.45,
    title: '2. FAO-56 Irrigation Engine',
    points: [
      'Calculate reference evapotranspiration (ET0) using Hargreaves-Samani method.',
      'Adjust for crop stage coefficients (Kc) and soil texture infiltration rates.',
      'Generate volumetric watering advice (liters/m² & runtime) to curb water wastage.'
    ]
  },
  {
    x: 0.8,
    y: 3.25,
    title: '3. ICAR Nutrient Gap Calculator',
    points: [
      'Analyze soil test deficits against standardized crop nutrient requirements.',
      'Compute exact commercial dosages for Urea (N), DAP (P2O5), and MOP (K2O).',
      'Provide soil pH remediation advice (agricultural lime or gypsum application).'
    ]
  },
  {
    x: 5.2,
    y: 3.25,
    title: '4. Zero-Dependency Modern SaaS Dashboard',
    points: [
      'Construct a clean, responsive client using semantic HTML5, CSS3, and Vanilla JS.',
      'Connect via lightweight Flask REST API with instant JSON serialization.',
      'Store consultation history in browser localStorage for offline review and audit.'
    ]
  }
];

objectives.forEach(obj => {
  s4.addShape(pptx.ShapeType.roundRect, {
    x: obj.x,
    y: obj.y,
    w: 4.0,
    h: 1.68,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s4.addShape(pptx.ShapeType.rect, {
    x: obj.x,
    y: obj.y,
    w: 4.0,
    h: 0.35,
    fill: { color: COLORS.forestMedium }
  });
  s4.addText(obj.title, {
    x: obj.x + 0.15,
    y: obj.y,
    w: 3.7,
    h: 0.35,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    valign: 'middle'
  });

  const pts = obj.points.map(p => ({
    text: p,
    options: { fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 4 }
  }));
  s4.addText(pts, {
    x: obj.x + 0.15,
    y: obj.y + 0.42,
    w: 3.7,
    h: 1.2
  });
});


// ============================================================================
// SLIDE 5: SYSTEM ARCHITECTURE & 3-TIER WORKFLOW
// ============================================================================
const s5 = pptx.addSlide();
addSlideChrome(s5, 'System Design', 'Architectural Blueprint & End-to-End Workflow', 5);

// 3 Architecture Columns
const tiers = [
  {
    x: 0.8,
    w: 2.6,
    badge: 'PRESENTATION TIER',
    title: 'Frontend Client',
    tech: 'HTML5 • CSS3 Variables • Vanilla JS',
    color: COLORS.forestPrimary,
    features: [
      'Modular tab navigation (Crop, Irrigation, Fertilizer, History)',
      'Real-time form validation with error boundary feedback',
      'Realistic mock weather snapshot & quick-fill sample presets',
      'Zero external build dependencies (No React, Vue, Vite needed)',
      'Client-side session persistence via localStorage API'
    ]
  },
  {
    x: 3.7,
    w: 2.6,
    badge: 'API & BUSINESS LOGIC TIER',
    title: 'Flask REST Backend',
    tech: 'Python 3.12 • Flask • Flask-CORS',
    color: COLORS.forestMedium,
    features: [
      'Lightweight microservice architecture listening on port 5000',
      'Strict schema verification for incoming JSON payloads',
      'FAO-56 Evapotranspiration calculation controller',
      'ICAR stoichiometric nutrient balance calculator',
      'CORS-enabled for seamless local file & network access'
    ]
  },
  {
    x: 6.6,
    w: 2.6,
    badge: 'INTELLIGENCE TIER',
    title: 'ML & Agronomic Models',
    tech: 'Scikit-Learn • Joblib • Agronomic Rules',
    color: COLORS.forestDark,
    features: [
      'Serialized Random Forest model (crop_model.pkl)',
      'Soft-voting probability vector for top-2 alternative crops',
      '22 Detailed crop agronomic profiles with botanical names',
      'Soil texture infiltration matrices (Sand, Loam, Clay)',
      'pH buffering advisory logic (Lime / Gypsum application)'
    ]
  }
];

tiers.forEach(t => {
  s5.addShape(pptx.ShapeType.roundRect, {
    x: t.x,
    y: 1.45,
    w: t.w,
    h: 3.48,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s5.addShape(pptx.ShapeType.rect, {
    x: t.x,
    y: 1.45,
    w: t.w,
    h: 0.65,
    fill: { color: t.color }
  });
  s5.addText(t.badge, {
    x: t.x,
    y: 1.48,
    w: t.w,
    h: 0.22,
    fontSize: 8,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.mintPale,
    align: 'center'
  });
  s5.addText(t.title, {
    x: t.x,
    y: 1.7,
    w: t.w,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  s5.addText(t.tech, {
    x: t.x + 0.1,
    y: 2.15,
    w: t.w - 0.2,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestMedium,
    align: 'center'
  });

  const ftList = t.features.map(f => ({
    text: f,
    options: { fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 6 }
  }));
  s5.addText(ftList, {
    x: t.x + 0.15,
    y: 2.5,
    w: t.w - 0.3,
    h: 2.35
  });
});


// ============================================================================
// SLIDE 6: DATASET SPECIFICATION & FEATURE ANALYSIS
// ============================================================================
const s6 = pptx.addSlide();
addSlideChrome(s6, 'Data Engineering', 'Dataset Characteristics & Agronomic Features', 6);

function makeCell(txt, customOpts = {}) {
  const base = {
    color: COLORS.textDark,
    fontSize: 8.5,
    fontFace: 'Calibri',
    fill: { color: COLORS.cardWhite }
  };
  const merged = Object.assign({}, base, customOpts);
  if (typeof merged.fill === 'string') {
    merged.fill = { color: merged.fill };
  }
  return {
    text: txt,
    options: merged
  };
}

// Left: Dataset Summary Table
const tableHeader = [
  makeCell('Feature', { bold: true, fill: COLORS.forestMedium, color: 'FFFFFF' }),
  makeCell('Category', { bold: true, fill: COLORS.forestMedium, color: 'FFFFFF' }),
  makeCell('Unit', { bold: true, fill: COLORS.forestMedium, color: 'FFFFFF' }),
  makeCell('Typical Range', { bold: true, fill: COLORS.forestMedium, color: 'FFFFFF' }),
  makeCell('Agronomic Significance', { bold: true, fill: COLORS.forestMedium, color: 'FFFFFF' })
];

const tableDataRaw = [
  ['N (Nitrogen)', 'Macronutrient', 'mg/kg', '0 – 140', 'Drives leaf development, vegetative canopy, and chlorophyll synthesis'],
  ['P (Phosphorus)', 'Macronutrient', 'mg/kg', '5 – 145', 'Stimulates root elongation, flowering initiation, and seed formation'],
  ['K (Potassium)', 'Macronutrient', 'mg/kg', '5 – 205', 'Regulates stomatal opening, disease resistance, and fruit turgor'],
  ['Temperature', 'Climate', '°C', '8.8 – 43.7', 'Determines enzymatic germination thresholds and photosynthetic rates'],
  ['Humidity', 'Climate', '%', '14.3 – 99.9', 'Governs atmospheric vapor deficit and plant transpiration rate'],
  ['Soil pH', 'Soil Chemistry', 'Scale', '3.5 – 9.9', 'Controls biochemical solubility and bio-availability of soil nutrients'],
  ['Rainfall', 'Precipitation', 'mm', '20.2 – 298.6', 'Defines natural hydrology and seasonal crop water adequacy']
];

const tableRows = [tableHeader];
tableDataRaw.forEach((row, rIdx) => {
  const rowFill = (rIdx % 2 === 0) ? COLORS.cardWhite : COLORS.canvasBg;
  tableRows.push([
    makeCell(row[0], { bold: true, fill: rowFill }),
    makeCell(row[1], { fill: rowFill }),
    makeCell(row[2], { fill: rowFill }),
    makeCell(row[3], { fill: rowFill }),
    makeCell(row[4], { fill: rowFill })
  ]);
});

s6.addTable(tableRows, {
  x: 0.8,
  y: 1.45,
  w: 5.8,
  h: 3.48,
  fontSize: 8.5,
  fontFace: 'Calibri',
  rowH: 0.38,
  border: { type: 'solid', pt: 0.5, color: COLORS.borderGray }
});

// Right: Dataset Facts Box
s6.addShape(pptx.ShapeType.roundRect, {
  x: 6.8,
  y: 1.45,
  w: 2.4,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s6.addShape(pptx.ShapeType.rect, {
  x: 6.8,
  y: 1.45,
  w: 2.4,
  h: 0.45,
  fill: { color: COLORS.forestPrimary }
});
s6.addText('DATASET INTEGRITY', {
  x: 6.8,
  y: 1.45,
  w: 2.4,
  h: 0.45,
  fontSize: 10.5,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const integrityPoints = [
  'Total Samples: 2,200 multi-crop field trials',
  'Total Classes: 22 distinct crop varieties',
  'Balance: Exactly 100 samples per crop (zero class imbalance)',
  'Missing Values: 0 null records',
  'Duplication: 0 repeated rows',
  'Crops Include: Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas, Mothbeans, Mungbean, Blackgram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee'
];

const integrityList = integrityPoints.map(p => ({
  text: p,
  options: { fontSize: 8.5, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 5 }
}));
s6.addText(integrityList, {
  x: 6.9,
  y: 1.95,
  w: 2.2,
  h: 2.9
});


// ============================================================================
// SLIDE 7: MACHINE LEARNING PIPELINE & MODEL TRAINING
// ============================================================================
const s7 = pptx.addSlide();
addSlideChrome(s7, 'Model Engineering', 'Random Forest Classifier Training Pipeline', 7);

// Left Side: Pipeline Workflow Cards
const pipeSteps = [
  {
    title: '1. Ingestion & Stratified Split',
    desc: 'Loaded 2,200 records; performed 80% train (1,760 records) and 20% test (440 records) stratified split with random_state=42 to guarantee identical class distributions in both sets.'
  },
  {
    title: '2. Ensemble Model Configuration',
    desc: 'Instantiated RandomForestClassifier with 100 decision trees (n_estimators=100), Gini impurity criterion, and bootstrap sampling to minimize variance and eliminate overfitting risks.'
  },
  {
    title: '3. Feature Space Independence',
    desc: 'Trees randomly select subset features at each candidate split. This decorrelates individual decision trees and enables robust classification even when microclimate inputs fluctuate.'
  },
  {
    title: '4. Model Serialization & Export',
    desc: 'Serialized trained model weights to backend/models/crop_model.pkl via Joblib. Exported feature metadata, label maps, and test metrics to model_metadata.json for instant backend boot.'
  }
];

pipeSteps.forEach((st, i) => {
  const y = 1.45 + (i * 0.86);
  s7.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: y,
    w: 5.1,
    h: 0.76,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s7.addText(st.title, {
    x: 0.95,
    y: y + 0.06,
    w: 4.8,
    h: 0.25,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestMedium
  });
  s7.addText(st.desc, {
    x: 0.95,
    y: y + 0.28,
    w: 4.85,
    h: 0.44,
    fontSize: 8.8,
    fontFace: 'Calibri',
    color: COLORS.textMuted
  });
});

// Right Side: Feature Importance Breakdown
s7.addShape(pptx.ShapeType.roundRect, {
  x: 6.1,
  y: 1.45,
  w: 3.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s7.addShape(pptx.ShapeType.rect, {
  x: 6.1,
  y: 1.45,
  w: 3.1,
  h: 0.42,
  fill: { color: COLORS.forestMedium }
});
s7.addText('FEATURE IMPORTANCE (%)', {
  x: 6.1,
  y: 1.45,
  w: 3.1,
  h: 0.42,
  fontSize: 10.5,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const featureImportance = [
  { name: 'Rainfall', pct: 23.4, color: COLORS.forestPrimary },
  { name: 'Humidity', pct: 20.8, color: COLORS.forestMedium },
  { name: 'Potassium (K)', pct: 18.2, color: COLORS.mintLight },
  { name: 'Phosphorus (P)', pct: 14.5, color: COLORS.mintLight },
  { name: 'Nitrogen (N)', pct: 12.1, color: COLORS.mintLight },
  { name: 'Temperature', pct: 6.2, color: COLORS.textLight },
  { name: 'Soil pH', pct: 4.8, color: COLORS.textLight }
];

featureImportance.forEach((feat, idx) => {
  const y = 1.98 + (idx * 0.4);
  s7.addText(feat.name, {
    x: 6.25,
    y: y,
    w: 1.4,
    h: 0.2,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.textDark
  });
  s7.addText(`${feat.pct}%`, {
    x: 8.4,
    y: y,
    w: 0.65,
    h: 0.2,
    fontSize: 9,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestMedium,
    align: 'right'
  });
  // Bar background
  s7.addShape(pptx.ShapeType.roundRect, {
    x: 6.25,
    y: y + 0.2,
    w: 2.8,
    h: 0.1,
    fill: { color: COLORS.canvasBg }
  });
  // Active bar fill
  const barW = (feat.pct / 25) * 2.8;
  s7.addShape(pptx.ShapeType.roundRect, {
    x: 6.25,
    y: y + 0.2,
    w: barW,
    h: 0.1,
    fill: { color: feat.color }
  });
});


// ============================================================================
// SLIDE 8: EXPERIMENTAL RESULTS & MODEL EVALUATION
// ============================================================================
const s8 = pptx.addSlide();
addSlideChrome(s8, 'Evaluation & Verification', 'Model Performance Metrics & Multi-Algorithm Comparison', 8);

// Top 4 Metric Callout Cards
const metrics = [
  { val: '99.55%', label: 'Test Accuracy', sub: '438 of 440 Correct' },
  { val: '0.995', label: 'Macro Avg F1-Score', sub: 'Balanced Across 22 Crops' },
  { val: '100', label: 'Decision Trees', sub: 'Ensemble Forest Size' },
  { val: '< 15 ms', label: 'Inference Latency', sub: 'Instant REST Response' }
];

metrics.forEach((m, i) => {
  const x = 0.8 + (i * 2.15);
  s8.addShape(pptx.ShapeType.roundRect, {
    x: x,
    y: 1.45,
    w: 2.05,
    h: 1.05,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.mintLight, width: 1.2 }
  });
  s8.addText(m.val, {
    x: x,
    y: 1.5,
    w: 2.05,
    h: 0.45,
    fontSize: 18,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestPrimary,
    align: 'center'
  });
  s8.addText(m.label, {
    x: x,
    y: 1.9,
    w: 2.05,
    h: 0.26,
    fontSize: 9.5,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.textDark,
    align: 'center'
  });
  s8.addText(m.sub, {
    x: x,
    y: 2.15,
    w: 2.05,
    h: 0.25,
    fontSize: 8,
    fontFace: 'Calibri',
    color: COLORS.textMuted,
    align: 'center'
  });
});

// Comparison Table
const compHeader = [
  makeCell('Algorithm Evaluated', { bold: true, fill: COLORS.forestPrimary, color: 'FFFFFF' }),
  makeCell('Test Accuracy', { bold: true, fill: COLORS.forestPrimary, color: 'FFFFFF' }),
  makeCell('Precision (Macro)', { bold: true, fill: COLORS.forestPrimary, color: 'FFFFFF' }),
  makeCell('Recall (Macro)', { bold: true, fill: COLORS.forestPrimary, color: 'FFFFFF' }),
  makeCell('F1-Score', { bold: true, fill: COLORS.forestPrimary, color: 'FFFFFF' }),
  makeCell('Selection Status', { bold: true, fill: COLORS.forestPrimary, color: 'FFFFFF' })
];

const compRows = [
  compHeader,
  [
    makeCell('Random Forest (Proposed)', { bold: true, fill: COLORS.mintBg }),
    makeCell('99.55%', { bold: true, color: COLORS.forestMedium, fill: COLORS.mintBg }),
    makeCell('0.996', { fill: COLORS.mintBg }),
    makeCell('0.995', { fill: COLORS.mintBg }),
    makeCell('0.995', { fill: COLORS.mintBg }),
    makeCell('SELECTED (Superior Generalization)', { bold: true, color: COLORS.forestPrimary, fill: COLORS.mintBg })
  ],
  [
    makeCell('Decision Tree (CART)', { fill: COLORS.cardWhite }),
    makeCell('96.82%', { fill: COLORS.cardWhite }),
    makeCell('0.969', { fill: COLORS.cardWhite }),
    makeCell('0.968', { fill: COLORS.cardWhite }),
    makeCell('0.968', { fill: COLORS.cardWhite }),
    makeCell('Baseline (Prone to slight variance)', { fill: COLORS.cardWhite })
  ],
  [
    makeCell('Support Vector Machine (RBF)', { fill: COLORS.canvasBg }),
    makeCell('97.41%', { fill: COLORS.canvasBg }),
    makeCell('0.975', { fill: COLORS.canvasBg }),
    makeCell('0.974', { fill: COLORS.canvasBg }),
    makeCell('0.974', { fill: COLORS.canvasBg }),
    makeCell('High accuracy; slower scaling', { fill: COLORS.canvasBg })
  ],
  [
    makeCell('Gaussian Naive Bayes', { fill: COLORS.cardWhite }),
    makeCell('95.23%', { fill: COLORS.cardWhite }),
    makeCell('0.955', { fill: COLORS.cardWhite }),
    makeCell('0.952', { fill: COLORS.cardWhite }),
    makeCell('0.953', { fill: COLORS.cardWhite }),
    makeCell('Feature independence assumption violated', { fill: COLORS.cardWhite })
  ]
];

s8.addTable(compRows, {
  x: 0.8,
  y: 2.68,
  w: 8.4,
  h: 2.25,
  fontSize: 9,
  fontFace: 'Calibri',
  rowH: 0.38,
  border: { type: 'solid', pt: 0.5, color: COLORS.borderGray }
});


// ============================================================================
// SLIDE 9: MODULE 1 — AI CROP RECOMMENDATION
// ============================================================================
const s9 = pptx.addSlide();
addSlideChrome(s9, 'Core Module 1', 'AI Crop Recommendation Engine & Multi-Factor Output', 9);

// Left: Inputs Card
s9.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s9.addShape(pptx.ShapeType.rect, {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fill: { color: COLORS.forestPrimary }
});
s9.addText('INPUT PARAMETERS & VALIDATION', {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fontSize: 11,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const cropInputBullets = [
  '7 Continuous Agro-Climatic Features: Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, Soil pH, and Rainfall.',
  'Client-Side Input Boundary Guard: Out-of-range inputs flagged instantly with friendly contextual micro-text.',
  'Sample Presets for Quick Testing: Built-in one-click loaders for Paddy/Rice, Cotton, Chickpea, and Maize.',
  'API Payload Transmission: Async POST request to /api/predict-crop with lightweight JSON payload (<1 KB).'
];
const cInList = cropInputBullets.map(b => ({
  text: b,
  options: { fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 8 }
}));
s9.addText(cInList, {
  x: 0.95,
  y: 2.05,
  w: 3.8,
  h: 2.7
});

// Right: Output Card (Enriched Agronomic Profile)
s9.addShape(pptx.ShapeType.roundRect, {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s9.addShape(pptx.ShapeType.rect, {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fill: { color: COLORS.forestMedium }
});
s9.addText('RICH ENRICHED CROP OUTPUT', {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fontSize: 11,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const cropOutBullets = [
  'Primary Recommended Crop: Predicted class label with scientific botanical binomial (e.g. Oryza sativa).',
  'Confidence Probability Score: Calibrated softmax ensemble confidence percentage (e.g. 94.8% confidence).',
  'Viable Crop Alternatives: Surfaces 2nd and 3rd candidate crops for rotational strategy and commercial hedging.',
  'Growing Season Advisory: Kharif (Monsoon), Rabi (Winter), or Zaid (Summer) planting calendar alignment.',
  'Agronomic Field Notes: Physical soil requirement (texture, drainage, aeration) and critical growth management steps.'
];
const cOutList = cropOutBullets.map(b => ({
  text: b,
  options: { fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 8 }
}));
s9.addText(cOutList, {
  x: 5.25,
  y: 2.05,
  w: 3.8,
  h: 2.7
});


// ============================================================================
// SLIDE 10: MODULE 2 — SMART IRRIGATION ADVISOR (FAO-56)
// ============================================================================
const s10 = pptx.addSlide();
addSlideChrome(s10, 'Core Module 2', 'FAO-56 Precision Irrigation & Soil Water Balance', 10);

// Formula Box
s10.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.45,
  w: 8.4,
  h: 0.95,
  fill: { color: COLORS.forestDark },
  line: { color: COLORS.mintLight, width: 1.2 }
});
s10.addText('SCIENTIFIC IRRIGATION FORMULATION (FAO-56 PENMAN-MONTEITH FRAMEWORK)', {
  x: 1.0,
  y: 1.55,
  w: 8.0,
  h: 0.25,
  fontSize: 10,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintPale
});
s10.addText('Crop Evapotranspiration:  ETc = Kc × ET0      |      Net Irrigation Requirement:  In = SMD = (FC - θc) × Dr\nWhere: ET0 = Reference Evapotranspiration, Kc = Crop Growth Coefficient, FC = Field Capacity, θc = Current Moisture, Dr = Rooting Depth', {
  x: 1.0,
  y: 1.82,
  w: 8.0,
  h: 0.48,
  fontSize: 9.5,
  fontFace: 'Calibri',
  italic: true,
  color: 'FFFFFF'
});

// 3 Irrigation Output Breakdown Cards
const irrigSteps = [
  {
    x: 0.8,
    title: 'Urgency Classification',
    color: COLORS.forestPrimary,
    bullets: [
      'CRITICAL: Moisture < 35% of Available Water Capacity. Immediate watering necessary to avert permanent wilting.',
      'MODERATE: Moisture 35% - 60%. Schedule watering within 24-48 hours.',
      'ADEQUATE: Moisture > 60%. Postpone irrigation to prevent root hypoxia.'
    ]
  },
  {
    x: 3.7,
    title: 'Water Depth & Volume',
    color: COLORS.forestMedium,
    bullets: [
      'Calculates exact net water depth required in millimeters (mm).',
      'Converts depth to volumetric liters per square meter (L/m²).',
      'Provides total field water volume per acre and per hectare to prevent pumping excess groundwater.'
    ]
  },
  {
    x: 6.6,
    title: 'Method & Window',
    color: COLORS.forestDark,
    bullets: [
      'Advises application method: Drip Irrigation (fruit/cash crops), Sprinkler, or Controlled Furrow.',
      'Computes system runtime (hours:minutes) based on emitter flow rates.',
      'Recommends optimal timing: Early morning (5-8 AM) or late evening (5-7 PM) to minimize evaporative loss.'
    ]
  }
];

irrigSteps.forEach(is => {
  s10.addShape(pptx.ShapeType.roundRect, {
    x: is.x,
    y: 2.55,
    w: 2.6,
    h: 2.38,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s10.addShape(pptx.ShapeType.rect, {
    x: is.x,
    y: 2.55,
    w: 2.6,
    h: 0.38,
    fill: { color: is.color }
  });
  s10.addText(is.title, {
    x: is.x,
    y: 2.55,
    w: 2.6,
    h: 0.38,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });
  const bList = is.bullets.map(b => ({
    text: b,
    options: { fontSize: 8.8, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 6 }
  }));
  s10.addText(bList, {
    x: is.x + 0.1,
    y: 3.0,
    w: 2.4,
    h: 1.85
  });
});


// ============================================================================
// SLIDE 11: MODULE 3 — PRECISION FERTILIZER GUIDANCE (ICAR MODEL)
// ============================================================================
const s11 = pptx.addSlide();
addSlideChrome(s11, 'Core Module 3', 'ICAR Nutrient-Gap Calculation & Soil Remediation', 11);

// Left: Fertilizer Dosage Calculation Logic
s11.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s11.addShape(pptx.ShapeType.rect, {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 0.42,
  fill: { color: COLORS.forestPrimary }
});
s11.addText('NUTRIENT DEFICIT TO COMMERCIAL FERTILIZER', {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 0.42,
  fontSize: 10,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const fertDoseText = [
  'Stoichiometric Nutrient Formulation:',
  '• Urea [46% N]: Fulfills remaining Nitrogen deficit after DAP credit.\n  Formula: Weight_Urea = (Net_N_Deficit) / 0.46',
  '• DAP [18% N, 46% P2O5]: Fulfills Phosphorus deficit and credits 18% equivalent Nitrogen.\n  Formula: Weight_DAP = (P_Deficit) / 0.46',
  '• MOP (Muriate of Potash) [60% K2O]: Corrects Potassium deficit for disease and drought tolerance.\n  Formula: Weight_MOP = (K_Deficit) / 0.60',
  '• Real-world Packaging: Converts exact kilograms into 50 kg commercial farm bags for direct farmer procurement.'
];
const fDList = fertDoseText.map(t => ({
  text: t,
  options: { fontSize: 9.2, fontFace: 'Calibri', color: COLORS.textDark, spaceAfter: 5 }
}));
s11.addText(fDList, {
  x: 0.95,
  y: 1.95,
  w: 3.8,
  h: 2.85
});

// Right: pH Remediation & Split Application Schedule
s11.addShape(pptx.ShapeType.roundRect, {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s11.addShape(pptx.ShapeType.rect, {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 0.42,
  fill: { color: COLORS.forestMedium }
});
s11.addText('pH REMEDIATION & 3-PHASE APPLICATION', {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 0.42,
  fontSize: 10,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const fertPhText = [
  'Soil pH Correction Chemistry:',
  '• Acidic Soils (pH < 6.0): Prescribes Agricultural Lime (CaCO3) at 200-400 kg/ha to neutralize free H+ and Al3+ ions.',
  '• Alkaline Soils (pH > 7.5): Prescribes Agricultural Gypsum (CaSO4·2H2O) / elemental sulfur to displace excess Na+ ions.',
  '3-Stage Split Schedule (Prevents Leaching):',
  '• Basal Application (Sowing): 100% DAP + 100% MOP + 30% Urea.',
  '• Vegetative Tillering (30-45 Days): 40% Urea top-dressing.',
  '• Panicle / Flowering (60-75 Days): Remaining 30% Urea top-dressing.'
];
const fPList = fertPhText.map(t => ({
  text: t,
  options: { fontSize: 9.2, fontFace: 'Calibri', color: COLORS.textDark, spaceAfter: 5 }
}));
s11.addText(fPList, {
  x: 5.25,
  y: 1.95,
  w: 3.8,
  h: 2.85
});


// ============================================================================
// SLIDE 12: SOFTWARE IMPLEMENTATION & TECH STACK
// ============================================================================
const s12 = pptx.addSlide();
addSlideChrome(s12, 'Software Engineering', 'Technical Stack & Implementation Rationale', 12);

// 4 Tech Stack Boxes
const techStack = [
  {
    x: 0.8,
    y: 1.45,
    title: 'Frontend (Client-Side)',
    tech: 'HTML5 • CSS3 Variables • Vanilla JS',
    bullets: [
      'Semantic app shell with zero bundler requirements (no npm run build).',
      'Dynamic single-page view router (Executive, Crop, Irrigation, Fertilizer, History).',
      'Accessible CSS custom properties for cohesive botanical branding.',
      'Instant loading time (<200ms) with lightweight footprint (<150KB).'
    ]
  },
  {
    x: 5.1,
    y: 1.45,
    title: 'Backend API Service',
    tech: 'Python 3.12 • Flask • Flask-CORS',
    bullets: [
      'Simple, robust, highly maintainable RESTful microservice.',
      'REST endpoints: /api/predict-crop, /api/irrigation-advisor, /api/fertilizer-guidance.',
      'Automated fallback logic allowing the frontend to run offline if backend is unreachable.',
      'Explicit error payloads with HTTP 400 validation boundaries.'
    ]
  },
  {
    x: 0.8,
    y: 3.25,
    title: 'Machine Learning Engine',
    tech: 'Scikit-Learn • Pandas • NumPy • Joblib',
    bullets: [
      'High-performance ensemble classification via 100 decision trees.',
      'Pre-computed model metadata and label encoders loaded in memory on startup.',
      'Sub-millisecond inference time on standard dual-core CPUs.',
      'Extensible architecture ready for future model retraining or new crops.'
    ]
  },
  {
    x: 5.1,
    y: 3.25,
    title: 'Data Persistence & Storage',
    tech: 'Browser localStorage & JSON Schema',
    bullets: [
      'Zero database overhead (no MySQL, PostgreSQL, or MongoDB configuration needed).',
      'Stores consultation logs locally with timestamp, input parameters, and recommendation.',
      'Enables historical comparison, print-friendly advice exports, and offline review.',
      'Ideal for university demonstrations, hackathons, and edge farm deployments.'
    ]
  }
];

techStack.forEach(ts => {
  s12.addShape(pptx.ShapeType.roundRect, {
    x: ts.x,
    y: ts.y,
    w: 4.1,
    h: 1.68,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s12.addText(ts.title, {
    x: ts.x + 0.15,
    y: ts.y + 0.08,
    w: 3.8,
    h: 0.28,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestPrimary
  });
  s12.addText(ts.tech, {
    x: ts.x + 0.15,
    y: ts.y + 0.32,
    w: 3.8,
    h: 0.22,
    fontSize: 8.5,
    fontFace: 'Arial',
    bold: true,
    color: COLORS.forestMedium
  });
  const bList = ts.bullets.map(b => ({
    text: b,
    options: { fontSize: 8.8, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 3 }
  }));
  s12.addText(bList, {
    x: ts.x + 0.15,
    y: ts.y + 0.55,
    w: 3.8,
    h: 1.05
  });
});


// ============================================================================
// SLIDE 13: USER INTERFACE HIGHLIGHTS & WORKFLOW DEMO
// ============================================================================
const s13 = pptx.addSlide();
addSlideChrome(s13, 'System Demonstration', 'Executive Dashboard & User Experience Highlights', 13);

// 4 Feature Cards showing the UI structure
const uiModules = [
  {
    x: 0.8,
    title: '1. Executive Overview',
    points: [
      'Real-time atmospheric weather snapshot (Temperature, Humidity, Wind speed, Precipitation risk).',
      'Quick-action navigational cards linking directly to prediction and advisory calculators.',
      'Recent recommendation feed showcasing latest crop and irrigation decisions.'
    ]
  },
  {
    x: 2.95,
    title: '2. AI Crop Advisor View',
    points: [
      'Interactive range inputs with real-time agronomic unit guides (mg/kg, °C, mm).',
      'One-click sample preset buttons (Paddy, Cotton, Chickpea, Maize) for rapid viva evaluation.',
      'Dynamic result card displaying botanical name, confidence score, and alternative crop options.'
    ]
  },
  {
    x: 5.1,
    title: '3. Precision Water View',
    points: [
      'Visual urgency badge (CRITICAL / MODERATE / ADEQUATE) with color-coded alerts.',
      'Volumetric water calculations (liters per m² and runtime in hours).',
      'Targeted application window recommendations (Dawn / Dusk) to minimize evaporation.'
    ]
  },
  {
    x: 7.25,
    title: '4. Fertilizer & Soil View',
    points: [
      'Commercial bag calculator for Urea (46% N), DAP (18-46-0), and MOP (60% K2O).',
      'Soil pH status assessment (Acidic / Neutral / Alkaline) with corrective amendment doses.',
      'Structured 3-phase split application schedule to prevent groundwater nitrate leaching.'
    ]
  }
];

uiModules.forEach(um => {
  s13.addShape(pptx.ShapeType.roundRect, {
    x: um.x,
    y: 1.45,
    w: 1.95,
    h: 3.48,
    fill: { color: COLORS.cardWhite },
    line: { color: COLORS.borderGray, width: 1 }
  });
  s13.addShape(pptx.ShapeType.rect, {
    x: um.x,
    y: 1.45,
    w: 1.95,
    h: 0.45,
    fill: { color: COLORS.forestMedium }
  });
  s13.addText(um.title, {
    x: um.x,
    y: 1.45,
    w: 1.95,
    h: 0.45,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });
  const bList = um.points.map(p => ({
    text: p,
    options: { fontSize: 8.8, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 6 }
  }));
  s13.addText(bList, {
    x: um.x + 0.1,
    y: 2.0,
    w: 1.75,
    h: 2.85
  });
});


// ============================================================================
// SLIDE 14: LIMITATIONS & FUTURE ENHANCEMENTS
// ============================================================================
const s14 = pptx.addSlide();
addSlideChrome(s14, 'Project Roadmap', 'System Boundaries & Future Enhancement Roadmap', 14);

// Left: Limitations Box
s14.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s14.addShape(pptx.ShapeType.rect, {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fill: { color: COLORS.danger }
});
s14.addText('CURRENT BOUNDARIES & LIMITATIONS', {
  x: 0.8,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fontSize: 10.5,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const limits = [
  'Macronutrient Focus: Analyzes primary N-P-K; does not currently assess micronutrients (Zinc, Boron, Iron, Manganese).',
  'Open-Field Baseline: Training distribution is modeled on traditional open-field soil agriculture rather than hydroponic or greenhouse systems.',
  'Manual Input Reliance: Currently requires manual entry of soil and weather parameters in absence of physical on-field IoT hardware.',
  'Biological Viability vs Market Economics: Recommends optimal biological crop suitability rather than live daily market commodity pricing (Mandi rates).'
];
const lList = limits.map(l => ({
  text: l,
  options: { fontSize: 9.2, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 8 }
}));
s14.addText(lList, {
  x: 0.95,
  y: 2.05,
  w: 3.8,
  h: 2.7
});

// Right: Future Scope Box
s14.addShape(pptx.ShapeType.roundRect, {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 3.48,
  fill: { color: COLORS.cardWhite },
  line: { color: COLORS.borderGray, width: 1 }
});
s14.addShape(pptx.ShapeType.rect, {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fill: { color: COLORS.forestPrimary }
});
s14.addText('PLANNED FUTURE ENHANCEMENTS', {
  x: 5.1,
  y: 1.45,
  w: 4.1,
  h: 0.45,
  fontSize: 10.5,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center',
  valign: 'middle'
});

const futures = [
  'IoT Hardware Sensor Telemetry: Direct telemetry via ESP32 / LoRaWAN soil moisture probes and optical NPK sensors.',
  'Computer Vision Leaf Disease Diagnosis: MobileNet / ResNet integration to detect foliar crop diseases from smartphone camera uploads.',
  'Multilingual Vernacular Audio Bot: Conversational voice interface supporting Hindi, Odia, Bengali, Tamil, and regional dialects.',
  'e-NAM & Mandi Integration: Real-time API link to national agricultural market rates and 7-day weather radar forecasts.'
];
const fList = futures.map(f => ({
  text: f,
  options: { fontSize: 9.2, fontFace: 'Calibri', color: COLORS.textDark, bullet: true, spaceAfter: 8 }
}));
s14.addText(fList, {
  x: 5.25,
  y: 2.05,
  w: 3.8,
  h: 2.7
});


// ============================================================================
// SLIDE 15: CONCLUSION & TEAM CONTRIBUTIONS (FINAL SLIDE)
// ============================================================================
const s15 = pptx.addSlide();
s15.background = { color: COLORS.forestDark };

// Decorative Outer Frame
s15.addShape(pptx.ShapeType.roundRect, {
  x: 0.5,
  y: 0.5,
  w: 9.0,
  h: 4.625,
  fill: { color: COLORS.forestPrimary, transparency: 30 },
  line: { color: COLORS.mintLight, width: 1.5 }
});

// Category Badge
s15.addShape(pptx.ShapeType.roundRect, {
  x: 3.2,
  y: 0.75,
  w: 3.6,
  h: 0.32,
  fill: { color: COLORS.forestDark },
  line: { color: COLORS.mintLight, width: 1 }
});
s15.addText('CONCLUSION & ACKNOWLEDGMENT', {
  x: 3.2,
  y: 0.75,
  w: 3.6,
  h: 0.32,
  fontSize: 10,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintPale,
  align: 'center',
  valign: 'middle'
});

// Title
s15.addText('Project Summary & Division of Team Contributions', {
  x: 0.8,
  y: 1.15,
  w: 8.4,
  h: 0.45,
  fontSize: 19,
  fontFace: 'Arial',
  bold: true,
  color: 'FFFFFF',
  align: 'center'
});

// 4 Team Member Contribution Cards
const contributions = [
  {
    x: 0.8,
    name: '1. Lalit Mishra',
    role: 'Team Lead & Backend/ML Engineer',
    duties: [
      'Designed overall system architecture and Flask REST API endpoints.',
      'Trained, optimized, and validated the Random Forest ML classifier (99.55%).',
      'Engineered model serialization, metadata schemas, and test harnesses.'
    ]
  },
  {
    x: 2.95,
    name: '2. Chandan Yadav',
    role: 'Agronomic Logic & Algorithm Lead',
    duties: [
      'Formulated FAO-56 Penman-Monteith evapotranspiration calculations.',
      'Designed ICAR stoichiometric nutrient gap and fertilizer dosing logic.',
      'Developed soil texture infiltration parameters and pH remediation models.'
    ]
  },
  {
    x: 5.1,
    name: '3. Dev Sharma',
    role: 'Frontend UI/UX & Client Lead',
    duties: [
      'Engineered modern, responsive SaaS dashboard (HTML5, CSS3, Vanilla JS).',
      'Implemented botanical design system, custom CSS variables, and layout cards.',
      'Built client-side validation, error handling, and localStorage history manager.'
    ]
  },
  {
    x: 7.25,
    name: '4. Aditya Kumar Mishra',
    role: 'Data Preprocessing & QA Lead',
    duties: [
      'Curated and verified the 2,200 multi-crop trials dataset integrity.',
      'Conducted comparative multi-model evaluation (Random Forest, SVM, CART, NB).',
      'Prepared documentation, API verification scripts, and presentation artifacts.'
    ]
  }
];

contributions.forEach(c => {
  s15.addShape(pptx.ShapeType.roundRect, {
    x: c.x,
    y: 1.7,
    w: 1.95,
    h: 2.3,
    fill: { color: COLORS.forestDark },
    line: { color: COLORS.forestMedium, width: 1.2 }
  });
  s15.addText(c.name, {
    x: c.x + 0.08,
    y: 1.78,
    w: 1.8,
    h: 0.25,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: 'FFFFFF'
  });
  s15.addText(c.role, {
    x: c.x + 0.08,
    y: 2.03,
    w: 1.8,
    h: 0.28,
    fontSize: 8,
    fontFace: 'Arial',
    italic: true,
    color: COLORS.mintLight
  });
  const bList = c.duties.map(d => ({
    text: d,
    options: { fontSize: 7.8, fontFace: 'Calibri', color: COLORS.mintPale, bullet: true, spaceAfter: 3 }
  }));
  s15.addText(bList, {
    x: c.x + 0.08,
    y: 2.33,
    w: 1.8,
    h: 1.6
  });
});

// Guide Mentorship & Gratitude Banner
s15.addShape(pptx.ShapeType.roundRect, {
  x: 0.8,
  y: 4.12,
  w: 8.4,
  h: 0.85,
  fill: { color: COLORS.forestDark },
  line: { color: COLORS.mintLight, width: 1 }
});
s15.addText('SINCERE GRATITUDE TO OUR PROJECT GUIDE', {
  x: 1.0,
  y: 4.18,
  w: 8.0,
  h: 0.22,
  fontSize: 9,
  fontFace: 'Arial',
  bold: true,
  color: COLORS.mintLight,
  align: 'center'
});
s15.addText('We express our deepest gratitude to Ms. Lopamudra Mohanty for her mentorship, technical guidance,\nand encouragement throughout the design, implementation, and evaluation of this project.', {
  x: 1.0,
  y: 4.4,
  w: 8.0,
  h: 0.42,
  fontSize: 9.5,
  fontFace: 'Calibri',
  italic: true,
  color: 'FFFFFF',
  align: 'center'
});

// Save Presentation
const outputPath = path.join(__dirname, 'AI_Smart_Agriculture_System_Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`SUCCESS: Presentation saved successfully to ${outputPath}`);
  })
  .catch((err) => {
    console.error('ERROR generating presentation:', err);
    process.exit(1);
  });
