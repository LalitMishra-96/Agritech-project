/**
 * AgriSmart AI — Presentation PDF Generator
 * Generates AI_Smart_Agriculture_System_Presentation.pdf
 * 
 * Dimensions: 960 x 540 pt (16:9 Widescreen HD)
 * Front Page Details:
 *   - Project Name: AI-Based Smart Agriculture Management System
 *   - Project Guide: Ms. Lopamudra Mohanty
 *   - Team Members:
 *       1. Lalit Mishra
 *       2. Chandan Yadav
 *       3. Dev Sharma
 *       4. Aditya Kumar Mishra
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const W = 960;
const H = 540;

const COLORS = {
  forestDark: '#0D2B1D',
  forestPrimary: '#1B4332',
  forestMedium: '#2D6A4F',
  mintLight: '#52B788',
  mintPale: '#D8F3DC',
  mintBg: '#E8F5E9',
  canvasBg: '#F4F6F4',
  cardWhite: '#FFFFFF',
  borderGray: '#D1D5DB',
  borderLight: '#E5E7EB',
  textDark: '#1F2937',
  textMuted: '#4B5563',
  textLight: '#9CA3AF',
  accentGold: '#D97706',
  accentBlue: '#2563EB',
  danger: '#DC2626'
};

const doc = new PDFDocument({
  size: [W, H],
  margin: 0,
  autoFirstPage: false,
  info: {
    Title: 'AI-Based Smart Agriculture Management System — Presentation',
    Author: 'Lalit Mishra, Chandan Yadav, Dev Sharma, Aditya Kumar Mishra',
    Subject: 'Project Guide: Ms. Lopamudra Mohanty',
    Keywords: 'Smart Agriculture, Machine Learning, Random Forest, FAO-56, Precision Farming'
  }
});

const outputPath = path.join(__dirname, 'AI_Smart_Agriculture_System_Presentation.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Helper: Standard Slide Chrome (Header, Category Tag, Footer)
function addSlideChrome(categoryTag, slideTitle, currentSlide, totalSlides = 15) {
  doc.addPage();

  // Canvas background
  doc.rect(0, 0, W, H).fill(COLORS.canvasBg);

  // Top Category Pill Tag
  doc.roundedRect(48, 28, 200, 22, 5).fill(COLORS.forestMedium);
  doc.fillColor(COLORS.mintPale)
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text(categoryTag.toUpperCase(), 48, 34, { width: 200, align: 'center' });

  // Main Slide Title
  doc.fillColor(COLORS.forestDark)
     .font('Helvetica-Bold')
     .fontSize(19)
     .text(slideTitle, 48, 56, { width: 864 });

  // Horizontal Accent Divider
  doc.rect(48, 86, 864, 2.5).fill(COLORS.mintLight);

  // Footer Divider Line
  doc.rect(48, 502, 864, 0.8).fill(COLORS.borderGray);

  // Footer Text Left
  doc.fillColor(COLORS.textMuted)
     .font('Helvetica')
     .fontSize(8.5)
     .text('AI-Based Smart Agriculture Management System', 48, 512, { width: 400 });

  // Footer Text Center (Guide)
  doc.fillColor(COLORS.textMuted)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text('Guide: Ms. Lopamudra Mohanty', 450, 512, { width: 250, align: 'center' });

  // Footer Text Right (Slide Number)
  doc.fillColor(COLORS.forestMedium)
     .font('Helvetica-Bold')
     .fontSize(9)
     .text(`${currentSlide} / ${totalSlides}`, 762, 512, { width: 150, align: 'right' });
}

// Helper: Draw Card with colored header bar
function drawCard(x, y, w, h, title, headerColor = COLORS.forestPrimary) {
  // Card base
  doc.roundedRect(x, y, w, h, 8)
     .fillAndStroke(COLORS.cardWhite, COLORS.borderLight);

  // Header banner
  doc.path(`M ${x + 8} ${y} L ${x + w - 8} ${y} Q ${x + w} ${y} ${x + w} ${y + 8} L ${x + w} ${y + 32} L ${x} ${y + 32} L ${x} ${y + 8} Q ${x} ${y} ${x + 8} ${y} Z`)
     .fill(headerColor);

  // Header Title
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text(title, x + 12, y + 10, { width: w - 24, align: 'left' });
}

// Helper: Draw Bullet Points inside card
function drawBullets(bullets, x, y, w, lineHeight = 13, fontSize = 9) {
  let currY = y;
  bullets.forEach(b => {
    doc.fillColor(COLORS.forestMedium)
       .font('Helvetica-Bold')
       .fontSize(fontSize + 1)
       .text('•', x, currY - 1);

    doc.fillColor(COLORS.textDark)
       .font('Helvetica')
       .fontSize(fontSize)
       .text(b, x + 12, currY, { width: w - 16, lineGap: 3 });

    // Calculate vertical offset
    const textHeight = doc.heightOfString(b, { width: w - 16, lineGap: 3 });
    currY += textHeight + 6;
  });
}

// ============================================================================
// SLIDE 1: COVER / TITLE SLIDE (FRONT PAGE)
// ============================================================================
doc.addPage();
// Deep forest gradient simulation
doc.rect(0, 0, W, H).fill(COLORS.forestDark);

// Decorative subtle inner frame
doc.roundedRect(28, 24, W - 56, H - 48, 12)
   .lineWidth(1.5)
   .strokeColor(COLORS.forestMedium)
   .stroke();

// Top Academic Badge
doc.roundedRect(260, 42, 440, 26, 13)
   .fillAndStroke(COLORS.forestPrimary, COLORS.mintLight);
doc.fillColor(COLORS.mintPale)
   .font('Helvetica-Bold')
   .fontSize(9)
   .text('MAJOR PROJECT PRESENTATION  •  ACADEMIC VIVA EVALUATION', 260, 50, { width: 440, align: 'center' });

// Main Project Title
doc.fillColor('#FFFFFF')
   .font('Helvetica-Bold')
   .fontSize(27)
   .text('AI-Based Smart Agriculture Management System', 48, 92, { width: W - 96, align: 'center' });

// Project Subtitle
doc.fillColor(COLORS.mintPale)
   .font('Helvetica-Oblique')
   .fontSize(12)
   .text('An Intelligent Decision-Support Framework for Supervised Crop Recommendation,\nPrecision FAO-56 Irrigation Scheduling & Soil Nutrient Balance Advisory', 70, 140, { width: W - 140, align: 'center', lineGap: 3 });

// Card 1: Project Guide (Left)
const cardW = 390;
const cardH = 210;
const cardY = 220;

doc.roundedRect(68, cardY, cardW, cardH, 10)
   .lineWidth(1)
   .fillAndStroke('#0A2317', COLORS.forestMedium);

doc.roundedRect(88, cardY + 18, 140, 22, 5).fill(COLORS.forestMedium);
doc.fillColor(COLORS.mintPale)
   .font('Helvetica-Bold')
   .fontSize(8.5)
   .text('PROJECT GUIDE', 88, cardY + 24, { width: 140, align: 'center' });

doc.fillColor('#FFFFFF')
   .font('Helvetica-Bold')
   .fontSize(19)
   .text('Ms. Lopamudra Mohanty', 88, cardY + 54, { width: cardW - 40 });

doc.fillColor(COLORS.mintPale)
   .font('Helvetica')
   .fontSize(10.5)
   .text('Assistant Professor / Faculty Mentor\nDepartment of Computer Science & Engineering\nSmart Farming & Artificial Intelligence Domain', 88, cardY + 86, { width: cardW - 40, lineGap: 5 });

doc.fillColor(COLORS.textLight)
   .font('Helvetica-Oblique')
   .fontSize(9)
   .text('Project Review & Academic Viva Evaluation • 2026', 88, cardY + 168, { width: cardW - 40 });

// Card 2: Team Members (Right)
doc.roundedRect(502, cardY, cardW, cardH, 10)
   .lineWidth(1)
   .fillAndStroke('#0A2317', COLORS.forestMedium);

doc.roundedRect(522, cardY + 18, 140, 22, 5).fill(COLORS.forestMedium);
doc.fillColor(COLORS.mintPale)
   .font('Helvetica-Bold')
   .fontSize(8.5)
   .text('PROJECT TEAM', 522, cardY + 24, { width: 140, align: 'center' });

const team = [
  { name: '1. Lalit Mishra', role: 'Architecture, ML Model & Flask REST API' },
  { name: '2. Chandan Yadav', role: 'Irrigation & Fertilizer Agronomic Rules' },
  { name: '3. Dev Sharma', role: 'Frontend UI/UX & Responsive Client' },
  { name: '4. Aditya Kumar Mishra', role: 'Data Preprocessing, Model Validation & QA' }
];

team.forEach((m, idx) => {
  const itemY = cardY + 54 + (idx * 34);
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(11.5)
     .text(m.name, 522, itemY);

  doc.fillColor(COLORS.mintLight)
     .font('Helvetica-Oblique')
     .fontSize(8.5)
     .text(m.role, 680, itemY + 2, { width: 200, align: 'right' });

  // subtle divider
  if (idx < 3) {
    doc.rect(522, itemY + 24, cardW - 40, 0.5).fill('#1A3C2A');
  }
});

// Cover Slide Footer
doc.fillColor(COLORS.mintPale)
   .font('Helvetica')
   .fontSize(8.5)
   .text('Department of Computer Science & Engineering', 68, 474);
doc.text('Academic Year 2026', 480, 474, { align: 'center', width: 100 });
doc.text('Slide 1 / 15', 750, 474, { align: 'right', width: 142 });


// ============================================================================
// SLIDE 2: BACKGROUND & MOTIVATION
// ============================================================================
addSlideChrome('Background & Motivation', 'The Need for Precision Agriculture & Smart Decisions', 2);

const colW3 = 274;
const colY = 106;
const colH = 376;

// Card 1
drawCard(48, colY, colW3, colH, 'The Agricultural Crisis', COLORS.forestPrimary);
drawBullets([
  'Agriculture engages over 50% of the Indian workforce and provides national food security.',
  'Traditional guesswork farming faces erratic monsoons, groundwater depletion, and heatwaves.',
  'A single wrong crop selection or uncalibrated chemical treatment leads to acute seasonal financial ruin.'
], 60, colY + 46, colW3 - 24, 14, 9.5);

// Card 2
drawCard(343, colY, colW3, colH, 'The Technological Gap', COLORS.forestMedium);
drawBullets([
  'Soil testing laboratories have turnaround times of 2 to 4 weeks—too late for tight planting windows.',
  'Existing SaaS farm management solutions are costly, complex, or require continuous 4G connectivity.',
  'Farmers lack a unified tool that ties soil chemistry, evapotranspiration, and fertilizer into one interface.'
], 355, colY + 46, colW3 - 24, 14, 9.5);

// Card 3
drawCard(638, colY, colW3, colH, 'The AgriSmart Solution', COLORS.forestDark);
drawBullets([
  'Instantaneous, calibrated crop recommendations with 99.55% accuracy on 22 major crop species.',
  'Scientific FAO-56 evapotranspiration models to curb water waste by 30% to 40%.',
  'Translates raw N-P-K soil tests into commercial bags of Urea, DAP, and MOP via ICAR formulations.'
], 650, colY + 46, colW3 - 24, 14, 9.5);


// ============================================================================
// SLIDE 3: PROBLEM STATEMENT
// ============================================================================
addSlideChrome('Problem Analysis', 'Core Challenges in Modern Agricultural Practice', 3);

const probY = 108;
const probCards = [
  {
    num: '01',
    title: 'Sub-Optimal Crop Matching',
    desc: 'Farmers plant crops based on local habit rather than biological compatibility with soil macronutrients (N, P, K), rainfall, temperature, and pH, leading to stunted growth and catastrophic harvest failure.'
  },
  {
    num: '02',
    title: 'Severe Water Misallocation & Salinization',
    desc: 'Conventional flood irrigation without calculating crop evapotranspiration (ET) wastes up to 40% of applied water, causes root hypoxia, depletes aquifers, and accelerates soil salinization.'
  },
  {
    num: '03',
    title: 'Indiscriminate Chemical Fertilization',
    desc: 'Excessive application of subsidized Urea without soil nutrient gap analysis degrades soil pH, destroys microbial ecosystems, contaminates drinking water aquifers, and wastes ~₹8,500/acre annually.'
  }
];

probCards.forEach((p, idx) => {
  const y = probY + (idx * 122);
  doc.roundedRect(48, y, 560, 108, 8)
     .fillAndStroke(COLORS.cardWhite, COLORS.borderLight);

  // Number Badge
  doc.roundedRect(64, y + 16, 44, 44, 6).fill(COLORS.forestMedium);
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(16)
     .text(p.num, 64, y + 28, { width: 44, align: 'center' });

  // Title
  doc.fillColor(COLORS.forestDark)
     .font('Helvetica-Bold')
     .fontSize(12)
     .text(p.title, 122, y + 16);

  // Desc
  doc.fillColor(COLORS.textMuted)
     .font('Helvetica')
     .fontSize(9.5)
     .text(p.desc, 122, y + 36, { width: 468, lineGap: 3 });
});

// Right Side Impact Banner
doc.roundedRect(630, probY, 282, 352, 10)
   .fillAndStroke(COLORS.forestPrimary, COLORS.mintLight);

doc.fillColor(COLORS.mintPale)
   .font('Helvetica-Bold')
   .fontSize(10)
   .text('QUANTIFIABLE IMPACT', 630, probY + 22, { width: 282, align: 'center' });

const stats = [
  { val: '30 – 40%', label: 'Water lost in unscientific flood irrigation' },
  { val: '₹8,500+', label: 'Annual farmer loss per acre from fertilizer waste' },
  { val: '99.55%', label: 'Prediction accuracy achieved by our ML model' }
];

stats.forEach((st, idx) => {
  const sy = probY + 65 + (idx * 90);
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(23)
     .text(st.val, 630, sy, { width: 282, align: 'center' });

  doc.fillColor(COLORS.mintPale)
     .font('Helvetica')
     .fontSize(9)
     .text(st.label, 646, sy + 30, { width: 250, align: 'center' });

  if (idx < 2) {
    doc.rect(670, sy + 64, 202, 0.8).fill(COLORS.forestMedium);
  }
});


// ============================================================================
// SLIDE 4: OBJECTIVES & SCOPE
// ============================================================================
addSlideChrome('Goals & Deliverables', 'Project Objectives & Operational Scope', 4);

const objW = 422;
const objH = 180;

// Obj 1
drawCard(48, 106, objW, objH, '1. Supervised Machine Learning Classifier', COLORS.forestMedium);
drawBullets([
  'Train an ensemble Random Forest model on 2,200 multi-crop trials records.',
  'Ingest 7 agronomic inputs: N, P, K, Temperature, Humidity, pH, and Rainfall.',
  'Deliver top-ranked crop, confidence percentage, and alternative crops for rotation.'
], 60, 148, objW - 24, 12, 9);

// Obj 2
drawCard(490, 106, objW, objH, '2. Scientific FAO-56 Irrigation Engine', COLORS.forestMedium);
drawBullets([
  'Calculate Reference Evapotranspiration (ET0) using Hargreaves-Samani method.',
  'Scale water demand by crop-specific growth coefficients (Kc) and soil infiltration.',
  'Compute precise watering depth (mm), volumetric liters/m², and pump runtimes.'
], 502, 148, objW - 24, 12, 9);

// Obj 3
drawCard(48, 302, objW, objH, '3. ICAR Nutrient Gap Fertilizer Advisor', COLORS.forestDark);
drawBullets([
  'Quantify nutrient deficits by comparing soil tests against agronomic requirements.',
  'Compute commercial fertilizer quantities: Urea (46% N), DAP, and MOP (60% K2O).',
  'Prescribe soil pH correction (Lime or Gypsum) and 3-stage split application schedules.'
], 60, 344, objW - 24, 12, 9);

// Obj 4
drawCard(490, 302, objW, objH, '4. Zero-Dependency Modern SaaS Architecture', COLORS.forestDark);
drawBullets([
  'Construct responsive client in pure HTML5, CSS3, and Vanilla JavaScript.',
  'Build lightweight Python 3.12 Flask REST API with JSON schemas and CORS.',
  'Store consultation history in browser localStorage for offline review and viva stability.'
], 502, 344, objW - 24, 12, 9);


// ============================================================================
// SLIDE 5: SYSTEM ARCHITECTURE
// ============================================================================
addSlideChrome('System Design', '3-Tier Modular System Architecture & Data Flow', 5);

const archW = 274;
const archY = 106;
const archH = 376;

// Tier 1
drawCard(48, archY, archW, archH, 'Tier 1: Client Presentation', COLORS.forestPrimary);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('HTML5 • CSS3 Variables • Vanilla JS', 60, archY + 40);
drawBullets([
  'Modular tab navigation (Executive, Crop, Irrigation, Fertilizer, History).',
  'Real-time input validation with inline contextual error messaging.',
  'Atmospheric weather snapshot and quick-fill presets (Paddy, Cotton, Maize).',
  'Zero build toolchain (No Node compilation, Webpack, or React overhead).'
], 60, archY + 64, archW - 24, 13, 9);

// Tier 2
drawCard(343, archY, archW, archH, 'Tier 2: Flask REST Backend', COLORS.forestMedium);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('Python 3.12 • Flask • Flask-CORS', 355, archY + 40);
drawBullets([
  'Microservice architecture listening on REST port 5000.',
  'Payload validation boundaries and graceful client-side fallback handling.',
  'FAO-56 Evapotranspiration and Soil Moisture Deficit calculations.',
  'ICAR stoichiometric nutrient-gap translation into commercial fertilizer.'
], 355, archY + 64, archW - 24, 13, 9);

// Tier 3
drawCard(638, archY, archW, archH, 'Tier 3: ML & Agronomic Rules', COLORS.forestDark);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('Scikit-Learn • Joblib • Agronomic DB', 650, archY + 40);
drawBullets([
  'Serialized Random Forest model (crop_model.pkl, 100 trees).',
  'Softmax probability vector yielding primary crop and alternative options.',
  'Agronomic database storing botanical names and seasonal guidance for 22 crops.',
  'Soil texture infiltration matrices (Sand, Loam, Clay) and pH correction.'
], 650, archY + 64, archW - 24, 13, 9);


// ============================================================================
// SLIDE 6: DATASET & FEATURES
// ============================================================================
addSlideChrome('Data Engineering', 'Dataset Attributes, Distributions & Agronomic Significance', 6);

// Left Table
const tblX = 48;
const tblY = 106;
const tblW = 590;
const rowH = 34;

// Table Header
doc.roundedRect(tblX, tblY, tblW, 26, 4).fill(COLORS.forestPrimary);
doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
doc.text('Feature', tblX + 10, tblY + 8, { width: 100 });
doc.text('Category', tblX + 115, tblY + 8, { width: 85 });
doc.text('Unit', tblX + 205, tblY + 8, { width: 50 });
doc.text('Range', tblX + 260, tblY + 8, { width: 75 });
doc.text('Agronomic Significance', tblX + 340, tblY + 8, { width: 240 });

const tableRows = [
  ['N (Nitrogen)', 'Macronutrient', 'mg/kg', '0 – 140', 'Fosters vegetative vigor, leaf surface area, and chlorophyll synthesis'],
  ['P (Phosphorus)', 'Macronutrient', 'mg/kg', '5 – 145', 'Stimulates root depth, flower initiation, and seed viability'],
  ['K (Potassium)', 'Macronutrient', 'mg/kg', '5 – 205', 'Regulates stomatal opening, disease resistance, and fruit turgor'],
  ['Temperature', 'Climate', '°C', '8.8 – 43.7', 'Controls enzymatic metabolic thresholds and phenological stages'],
  ['Humidity', 'Climate', '%', '14.3 – 99.9', 'Governs atmospheric vapor deficit and plant transpiration rate'],
  ['Soil pH', 'Soil Chemistry', 'Scale', '3.5 – 9.9', 'Dictates biochemical solubility and bio-availability of soil minerals'],
  ['Rainfall', 'Precipitation', 'mm', '20.2 – 298.6', 'Supplies fundamental seasonal hydrology and soil moisture profile']
];

tableRows.forEach((r, idx) => {
  const y = tblY + 28 + (idx * rowH);
  const bg = idx % 2 === 0 ? COLORS.cardWhite : COLORS.canvasBg;
  doc.rect(tblX, y, tblW, rowH).fillAndStroke(bg, COLORS.borderLight);

  doc.fillColor(COLORS.forestDark).font('Helvetica-Bold').fontSize(8.5).text(r[0], tblX + 10, y + 10, { width: 100 });
  doc.fillColor(COLORS.textDark).font('Helvetica').fontSize(8.5);
  doc.text(r[1], tblX + 115, y + 10, { width: 85 });
  doc.text(r[2], tblX + 205, y + 10, { width: 50 });
  doc.text(r[3], tblX + 260, y + 10, { width: 75 });
  doc.text(r[4], tblX + 340, y + 6, { width: 240, lineGap: 1 });
});

// Right Quality Box
drawCard(654, tblY, 258, 376, 'Dataset Quality Metrics', COLORS.forestMedium);
drawBullets([
  '2,200 multi-crop agricultural trial observations collected across India.',
  '22 balanced crop categories (exactly 100 samples per crop class).',
  'Zero class imbalance (1:1 equal representation across all crops).',
  'Zero missing values and zero duplicated rows in all 7 feature columns.',
  'Covers cereals, pulses, fruits, and commercial cash crops.'
], 666, tblY + 46, 234, 13, 9);

doc.roundedRect(666, tblY + 310, 234, 46, 6).fill(COLORS.mintBg);
doc.fillColor(COLORS.forestPrimary).font('Helvetica-Bold').fontSize(9)
   .text('Data Integrity Status: 100% Complete, Clean & Stratified', 674, tblY + 326, { width: 218, align: 'center' });


// ============================================================================
// SLIDE 7: ML TRAINING & FEATURE IMPORTANCE
// ============================================================================
addSlideChrome('Model Engineering', 'Random Forest Classifier Training Pipeline & Importance', 7);

const mlY = 106;
const pipeCards = [
  {
    title: '1. Stratified Partitioning',
    desc: 'Partitioned 2,200 rows into 80% Training (1,760 samples) and 20% Held-Out Testing (440 samples) with stratified class distribution using random_state=42.'
  },
  {
    title: '2. Ensemble Model Construction',
    desc: 'Configured RandomForestClassifier with 100 decision trees (n_estimators=100) using Gini impurity criterion and bootstrap aggregation to prevent overfitting.'
  },
  {
    title: '3. Softmax Probability Estimation',
    desc: 'Aggregates votes across 100 trees into calibrated confidence probabilities, enabling the model to surface both primary winner and viable secondary crop alternatives.'
  },
  {
    title: '4. Production Model Serialization',
    desc: 'Serialized weights via Joblib to crop_model.pkl (3.5 MB). Stored feature names, label maps, and evaluation metrics in model_metadata.json for instant boot.'
  }
];

pipeCards.forEach((pc, idx) => {
  const y = mlY + (idx * 90);
  doc.roundedRect(48, y, 540, 80, 8).fillAndStroke(COLORS.cardWhite, COLORS.borderLight);
  doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(11).text(pc.title, 64, y + 12);
  doc.fillColor(COLORS.textMuted).font('Helvetica').fontSize(9).text(pc.desc, 64, y + 32, { width: 508, lineGap: 2.5 });
});

// Right: Feature Importance Bar Chart
drawCard(610, mlY, 302, 376, 'Feature Importance Analysis', COLORS.forestPrimary);

const feats = [
  { name: 'Rainfall', pct: 23.4, w: 220 },
  { name: 'Humidity', pct: 20.8, w: 195 },
  { name: 'Potassium (K)', pct: 18.2, w: 170 },
  { name: 'Phosphorus (P)', pct: 14.5, w: 136 },
  { name: 'Nitrogen (N)', pct: 12.1, w: 114 },
  { name: 'Temperature', pct: 6.2, w: 58 },
  { name: 'Soil pH', pct: 4.8, w: 45 }
];

feats.forEach((f, idx) => {
  const y = mlY + 50 + (idx * 40);
  doc.fillColor(COLORS.textDark).font('Helvetica-Bold').fontSize(9).text(f.name, 626, y);
  doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(9).text(`${f.pct}%`, 850, y, { width: 50, align: 'right' });

  // Track
  doc.roundedRect(626, y + 16, 260, 8, 4).fill('#E5E7EB');
  // Fill
  doc.roundedRect(626, y + 16, f.w, 8, 4).fill(COLORS.forestMedium);
});

doc.fillColor(COLORS.textMuted).font('Helvetica-Oblique').fontSize(8.5)
   .text('Rainfall, humidity, and potassium serve as the strongest crop discriminators.', 626, mlY + 340, { width: 260, align: 'center' });


// ============================================================================
// SLIDE 8: EXPERIMENTAL RESULTS
// ============================================================================
addSlideChrome('Evaluation & Verification', 'Model Performance Metrics & Multi-Algorithm Benchmarks', 8);

const evY = 106;

// 4 Stat Callout Boxes
const stats4 = [
  { val: '99.55%', label: 'Test Accuracy', sub: '438 of 440 Correct' },
  { val: '0.995', label: 'Macro Avg F1-Score', sub: 'Balanced Across 22 Crops' },
  { val: '100', label: 'Decision Trees', sub: 'Ensemble Forest Size' },
  { val: '< 15 ms', label: 'Inference Latency', sub: 'Instant REST Response' }
];

stats4.forEach((s, idx) => {
  const x = 48 + (idx * 220);
  doc.roundedRect(x, evY, 208, 92, 8).fillAndStroke(COLORS.cardWhite, COLORS.mintLight);
  doc.fillColor(COLORS.forestPrimary).font('Helvetica-Bold').fontSize(22).text(s.val, x, evY + 14, { width: 208, align: 'center' });
  doc.fillColor(COLORS.textDark).font('Helvetica-Bold').fontSize(10).text(s.label, x, evY + 48, { width: 208, align: 'center' });
  doc.fillColor(COLORS.textMuted).font('Helvetica').fontSize(8).text(s.sub, x, evY + 66, { width: 208, align: 'center' });
});

// Comparison Table
const benchY = evY + 112;
const benchW = 864;

doc.roundedRect(48, benchY, benchW, 28, 5).fill(COLORS.forestPrimary);
doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
doc.text('Algorithm Evaluated', 60, benchY + 9, { width: 200 });
doc.text('Test Accuracy', 270, benchY + 9, { width: 90 });
doc.text('Precision (Macro)', 370, benchY + 9, { width: 100 });
doc.text('Recall (Macro)', 480, benchY + 9, { width: 90 });
doc.text('F1-Score', 580, benchY + 9, { width: 75 });
doc.text('Selection Status & Rationale', 665, benchY + 9, { width: 230 });

const benchRows = [
  ['Random Forest (Proposed)', '99.55%', '0.996', '0.995', '0.995', 'SELECTED: Superior multi-class generalization without overfitting', true],
  ['Decision Tree (CART)', '96.82%', '0.969', '0.968', '0.968', 'Baseline: Prone to variance along overlapping microclimate boundaries', false],
  ['Support Vector Machine (RBF)', '97.41%', '0.975', '0.974', '0.974', 'High accuracy but significantly higher inference latency on scaling', false],
  ['Gaussian Naive Bayes', '95.23%', '0.955', '0.952', '0.953', 'Feature independence assumption violated due to N-P-K chemical synergy', false]
];

benchRows.forEach((br, idx) => {
  const y = benchY + 30 + (idx * 40);
  const bg = br[6] ? COLORS.mintBg : idx % 2 === 0 ? COLORS.cardWhite : COLORS.canvasBg;
  doc.rect(48, y, benchW, 40).fillAndStroke(bg, COLORS.borderLight);

  doc.fillColor(br[6] ? COLORS.forestPrimary : COLORS.forestDark)
     .font(br[6] ? 'Helvetica-Bold' : 'Helvetica')
     .fontSize(br[6] ? 9.5 : 9);
  doc.text(br[0], 60, y + 13, { width: 200 });
  doc.text(br[1], 270, y + 13, { width: 90 });
  doc.text(br[2], 370, y + 13, { width: 100 });
  doc.text(br[3], 480, y + 13, { width: 90 });
  doc.text(br[4], 580, y + 13, { width: 75 });
  doc.text(br[5], 665, y + 8, { width: 230, lineGap: 2 });
});


// ============================================================================
// SLIDE 9: MODULE 1 — CROP RECOMMENDATION
// ============================================================================
addSlideChrome('Core Module 1', 'AI Crop Recommendation Engine & Multi-Factor Output', 9);

const crW = 422;
const crH = 376;
const crY = 106;

// Left: Inputs
drawCard(48, crY, crW, crH, 'Input Acquisition & Validation', COLORS.forestPrimary);
drawBullets([
  '7 Continuous Agro-Climatic Features: Nitrogen, Phosphorus, Potassium (mg/kg), Temperature (°C), Humidity (%), Soil pH (0-14), and Rainfall (mm).',
  'Client-Side Boundary Guards: Real-time checks flag impossible values before dispatch.',
  'Sample Presets for Quick Testing: Built-in one-click loaders for Paddy/Rice, Cotton, Chickpea, and Maize for rapid demonstration.',
  'Asynchronous REST Transmission: Compact JSON payload dispatched to /api/predict-crop with sub-millisecond network turnaround.'
], 60, crY + 48, crW - 24, 14, 9.5);

// Right: Output
drawCard(490, crY, crW, crH, 'Enriched Agronomic Profile Output', COLORS.forestMedium);
drawBullets([
  'Primary Recommended Crop: Predicted class label with scientific botanical binomial (e.g. Oryza sativa, Gossypium hirsutum).',
  'Calibrated Confidence Score: Explicit softmax percentage showing recommendation certainty.',
  'Top 2 Alternative Crops: Surfaces secondary candidate crops for seasonal crop rotation and price volatility risk mitigation.',
  'Growing Season Advisory: Kharif (Monsoon), Rabi (Winter), or Zaid (Summer) planting calendar alignment.',
  'Soil & Agronomic Notes: Tailored soil texture recommendations, drainage guidance, and critical field management tips.'
], 502, crY + 48, crW - 24, 14, 9.5);


// ============================================================================
// SLIDE 10: MODULE 2 — SMART IRRIGATION ADVISOR
// ============================================================================
addSlideChrome('Core Module 2', 'FAO-56 Precision Irrigation & Soil Water Balance Modeling', 10);

const irY = 106;

// Formula Banner
doc.roundedRect(48, irY, 864, 56, 8).fill(COLORS.forestDark);
doc.fillColor(COLORS.mintPale).font('Helvetica-Bold').fontSize(9)
   .text('SCIENTIFIC FORMULATION: FAO-56 PENMAN-MONTEITH METHODOLOGY', 64, irY + 10);
doc.fillColor('#FFFFFF').font('Helvetica-Oblique').fontSize(9.5)
   .text('Crop Evapotranspiration:  ETc = Kc × ET0   |   Soil Moisture Deficit:  SMD = (Field_Capacity - Current_Moisture) × Root_Depth', 64, irY + 28);

// 3 Breakdown Cards
const irCardsY = irY + 70;
const irColW = 274;
const irColH = 306;

drawCard(48, irCardsY, irColW, irColH, 'Urgency Classification', COLORS.forestPrimary);
drawBullets([
  'CRITICAL: Moisture < 35% of Available Water Capacity. Immediate watering necessary to avert permanent wilting and yield loss.',
  'MODERATE: Moisture 35% - 60%. Schedule irrigation within the next 24 to 48 hours.',
  'ADEQUATE: Moisture > 60%. Withhold irrigation to protect against root hypoxia and fungal rot.'
], 60, irCardsY + 46, irColW - 24, 14, 9.5);

drawCard(343, irCardsY, irColW, irColH, 'Water Depth & Volume', COLORS.forestMedium);
drawBullets([
  'Calculates exact net water depth required in millimeters (mm).',
  'Converts depth to volumetric quantity in liters per square meter (L/m²).',
  'Extrapolates total required water volume per acre, avoiding pumping excess groundwater.'
], 355, irCardsY + 46, irColW - 24, 14, 9.5);

drawCard(638, irCardsY, irColW, irColH, 'Method & Optimal Window', COLORS.forestDark);
drawBullets([
  'Advises application method: Drip Irrigation for cash/fruit crops, Sprinkler, or Controlled Furrow.',
  'Estimates pump operating runtime (hours:minutes) based on standard emitter flow rates.',
  'Recommends optimal timing: Early morning (5-8 AM) or late evening to minimize evaporative loss.'
], 650, irCardsY + 46, irColW - 24, 14, 9.5);


// ============================================================================
// SLIDE 11: MODULE 3 — FERTILIZER GUIDANCE
// ============================================================================
addSlideChrome('Core Module 3', 'ICAR Nutrient-Gap Calculation & Soil Chemical Remediation', 11);

const ferY = 106;
const ferW = 422;
const ferH = 376;

// Left Card
drawCard(48, ferY, ferW, ferH, 'Nutrient-Gap Stoichiometric Dosing', COLORS.forestPrimary);
drawBullets([
  'Urea (46% N): Fulfills remaining Nitrogen deficit after DAP nitrogen credit is accounted for.\nFormula: Urea_kg = (Net_N_Deficit) / 0.46',
  'DAP (18% N, 46% P2O5): Fulfills Phosphorus deficiency while contributing 18% elemental Nitrogen credit.\nFormula: DAP_kg = (P_Deficit) / 0.46',
  'MOP (60% K2O): Corrects Potassium deficit for stalk strength, drought resistance, and fruit turgor.\nFormula: MOP_kg = (K_Deficit) / 0.60',
  'Commercial Packaging: Converts raw kilogram requirements into standard 50 kg farm bags for direct merchant procurement.'
], 60, ferY + 46, ferW - 24, 13, 9);

// Right Card
drawCard(490, ferY, ferW, ferH, 'pH Remediation & 3-Phase Application', COLORS.forestMedium);
drawBullets([
  'Acidic Soils (pH < 6.0): Prescribes Agricultural Lime (CaCO3) at 200-400 kg/ha to neutralize free toxic Al3+ and H+ ions.',
  'Alkaline Soils (pH > 7.5): Prescribes Agricultural Gypsum (CaSO4·2H2O) to displace exchangeable sodium and improve soil structure.',
  '3-Stage Split Schedule (Prevents Nitrate Leaching):',
  '• Basal (Sowing): 100% DAP + 100% MOP + 30% Urea.',
  '• Vegetative Tillering (30-45 Days): 40% Urea top-dressing.',
  '• Panicle / Flowering (60-75 Days): Remaining 30% Urea top-dressing.'
], 502, ferY + 46, ferW - 24, 13, 9);


// ============================================================================
// SLIDE 12: IMPLEMENTATION & TECH STACK
// ============================================================================
addSlideChrome('Software Engineering', 'Technical Stack & Implementation Rationale', 12);

const tsY = 106;
const tsW = 422;
const tsH = 180;

drawCard(48, tsY, tsW, tsH, 'Frontend Client Architecture', COLORS.forestPrimary);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('HTML5 • CSS3 Variables • Vanilla JS', 60, tsY + 38);
drawBullets([
  'Zero build toolchain overhead: No Webpack, Vite, or React compilation required.',
  'Sub-second page load (<200ms) with static asset footprint under 150 KB.',
  'Modular JavaScript separation (crop.js, irrigation.js, fertilizer.js, app.js).'
], 60, tsY + 56, tsW - 24, 13, 9);

drawCard(490, tsY, tsW, tsH, 'Backend REST Microservice', COLORS.forestMedium);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('Python 3.12 • Flask • Flask-CORS', 502, tsY + 38);
drawBullets([
  'Lightweight REST API service listening on port 5000.',
  'Automated graceful fallback logic allows frontend to run offline if API is down.',
  'Strict JSON schema validation and clean mathematical algorithm separation.'
], 502, tsY + 56, tsW - 24, 13, 9);

drawCard(48, tsY + 196, tsW, tsH, 'Machine Learning Engine', COLORS.forestDark);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('Scikit-Learn • Pandas • NumPy • Joblib', 60, tsY + 234);
drawBullets([
  'High-speed serialized model loading on server boot with zero cold-start delay.',
  'Sub-millisecond inference time on standard dual-core computing hardware.',
  'Validated against 22 distinct crop classes across 2,200 agricultural trials.'
], 60, tsY + 252, tsW - 24, 13, 9);

drawCard(490, tsY + 196, tsW, tsH, 'Storage & Session Persistence', COLORS.forestDark);
doc.fillColor(COLORS.forestMedium).font('Helvetica-Bold').fontSize(8.5).text('Browser localStorage & JSON Schema', 502, tsY + 234);
drawBullets([
  'Zero database configuration overhead (no SQL or MongoDB server setup needed).',
  'Stores consultation histories with timestamps and input snapshots.',
  'Enables offline comparison of historical trials and print-ready advice generation.'
], 502, tsY + 252, tsW - 24, 13, 9);


// ============================================================================
// SLIDE 13: DASHBOARD HIGHLIGHTS & DEMO
// ============================================================================
addSlideChrome('System Demonstration', 'Executive Dashboard & User Experience Highlights', 13);

const uiY = 106;
const uiColW = 202;
const uiColH = 376;

drawCard(48, uiY, uiColW, uiColH, '1. Executive Overview', COLORS.forestPrimary);
drawBullets([
  'Real-time atmospheric weather snapshot (Temperature, Humidity, Wind speed, Precipitation risk).',
  'Quick-action cards for direct jump to Crop, Irrigation, and Fertilizer tools.',
  'Recent consultation feed displaying past advisories.'
], 58, uiY + 46, uiColW - 20, 13, 8.8);

drawCard(268, uiY, uiColW, uiColH, '2. AI Crop Advisor', COLORS.forestMedium);
drawBullets([
  'Interactive range inputs with real-time agronomic unit guides (mg/kg, °C, mm).',
  'One-click sample preset buttons (Paddy, Cotton, Chickpea, Maize) for rapid evaluation.',
  'Dynamic result card displaying botanical name, confidence score, and alternative crop options.'
], 278, uiY + 46, uiColW - 20, 13, 8.8);

drawCard(488, uiY, uiColW, uiColH, '3. Precision Water', COLORS.forestMedium);
drawBullets([
  'Visual urgency badge (CRITICAL / MODERATE / ADEQUATE) with color-coded alerts.',
  'Volumetric water calculations (liters per m² and runtime in hours).',
  'Targeted application window recommendations (Dawn / Dusk) to minimize evaporation.'
], 498, uiY + 46, uiColW - 20, 13, 8.8);

drawCard(708, uiY, uiColW, uiColH, '4. Fertilizer & Soil', COLORS.forestDark);
drawBullets([
  'Commercial bag calculator for Urea (46% N), DAP (18-46-0), and MOP (60% K2O).',
  'Soil pH status assessment (Acidic / Neutral / Alkaline) with corrective amendment doses.',
  'Structured 3-phase split application schedule to prevent groundwater nitrate leaching.'
], 718, uiY + 46, uiColW - 20, 13, 8.8);


// ============================================================================
// SLIDE 14: LIMITATIONS & FUTURE SCOPE
// ============================================================================
addSlideChrome('Project Roadmap', 'Current System Boundaries & Future Enhancements', 14);

const limY = 106;
const limW = 422;
const limH = 376;

drawCard(48, limY, limW, limH, 'Current System Boundaries', COLORS.danger);
drawBullets([
  'Macronutrient Focus: Model evaluates primary N-P-K; does not currently assess micronutrients (Zinc, Boron, Iron, Manganese).',
  'Open-Field Baseline: Training distribution is modeled on open-field agriculture rather than greenhouse or hydroponic systems.',
  'Manual Data Input: Currently requires manual entry of soil test parameters in the absence of on-field IoT hardware sensors.',
  'Biological Viability vs Market Economics: Predicts agronomic crop viability, not daily fluctuating market commodity prices (Mandi rates).'
], 60, limY + 48, limW - 24, 14, 9.5);

drawCard(490, limY, limW, limH, 'Planned Future Enhancements', COLORS.forestPrimary);
drawBullets([
  'IoT Hardware Sensor Telemetry: Direct telemetry via ESP32 / LoRaWAN soil moisture probes and optical NPK sensors.',
  'Computer Vision Leaf Disease Diagnosis: MobileNet integration to detect foliar plant pathologies from mobile camera uploads.',
  'Multilingual Vernacular Audio Bot: Conversational voice interface supporting Hindi, Odia, Bengali, Tamil, and regional dialects.',
  'e-NAM & Mandi Integration: Real-time API link to national agricultural market rates and 7-day weather radar forecasts.'
], 502, limY + 48, limW - 24, 14, 9.5);


// ============================================================================
// SLIDE 15: CONCLUSION & TEAM CONTRIBUTIONS (FINAL SLIDE)
// ============================================================================
doc.addPage();
doc.rect(0, 0, W, H).fill(COLORS.forestDark);

// Subtle outer frame
doc.roundedRect(28, 24, W - 56, H - 48, 12)
   .lineWidth(1.5)
   .strokeColor(COLORS.forestMedium)
   .stroke();

// Category Badge
doc.roundedRect(330, 40, 300, 24, 12)
   .fillAndStroke(COLORS.forestPrimary, COLORS.mintLight);
doc.fillColor(COLORS.mintPale)
   .font('Helvetica-Bold')
   .fontSize(8.5)
   .text('CONCLUSION & ACKNOWLEDGMENT', 330, 47, { width: 300, align: 'center' });

doc.fillColor('#FFFFFF')
   .font('Helvetica-Bold')
   .fontSize(21)
   .text('Project Summary & Division of Team Responsibilities', 48, 76, { width: W - 96, align: 'center' });

// 4 Team Member Contribution Cards
const cColW = 202;
const cColH = 246;
const cColY = 118;

const teamDuties = [
  {
    name: '1. Lalit Mishra',
    role: 'Team Lead & Backend/ML',
    tasks: [
      'Architected Flask REST API microservice and communication.',
      'Trained and optimized Random Forest classifier (99.55% accuracy).',
      'Engineered model serialization and metadata schemas.'
    ]
  },
  {
    name: '2. Chandan Yadav',
    role: 'Agronomic Logic Lead',
    tasks: [
      'Formulated FAO-56 Penman-Monteith evapotranspiration engine.',
      'Engineered ICAR stoichiometric fertilizer dosing models.',
      'Calibrated soil infiltration and pH remediation models.'
    ]
  },
  {
    name: '3. Dev Sharma',
    role: 'Frontend UI/UX Lead',
    tasks: [
      'Designed responsive modern SaaS client interface.',
      'Created botanical design tokens, CSS variables, and layout cards.',
      'Built client validation and localStorage history engine.'
    ]
  },
  {
    name: '4. Aditya Kumar Mishra',
    role: 'Data Preprocessing & QA Lead',
    tasks: [
      'Curated and verified 2,200 multi-crop trials dataset integrity.',
      'Conducted comparative multi-model evaluation benchmarks.',
      'Authored test cases, documentation, and viva artifacts.'
    ]
  }
];

teamDuties.forEach((td, idx) => {
  const x = 48 + (idx * 220);
  doc.roundedRect(x, cColY, cColW, cColH, 8)
     .lineWidth(1)
     .fillAndStroke('#0A2317', COLORS.forestMedium);

  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text(td.name, x + 10, cColY + 12);
  doc.fillColor(COLORS.mintLight).font('Helvetica-Oblique').fontSize(8).text(td.role, x + 10, cColY + 28);
  doc.rect(x + 10, cColY + 44, cColW - 20, 0.5).fill('#1A3C2A');

  drawBullets(td.tasks, x + 10, cColY + 54, cColW - 20, 11, 8);
});

// Guide Gratitude Banner
const gBannerY = 384;
doc.roundedRect(48, gBannerY, 864, 76, 8)
   .lineWidth(1)
   .fillAndStroke('#0A2317', COLORS.mintLight);

doc.fillColor(COLORS.mintLight)
   .font('Helvetica-Bold')
   .fontSize(9)
   .text('SINCERE GRATITUDE TO OUR PROJECT GUIDE', 48, gBannerY + 12, { width: 864, align: 'center' });

doc.fillColor('#FFFFFF')
   .font('Helvetica-Oblique')
   .fontSize(10)
   .text('We express our deepest gratitude to Ms. Lopamudra Mohanty for her mentorship, technical guidance,\nand encouragement throughout the design, implementation, and evaluation of this project.', 68, gBannerY + 32, { width: 824, align: 'center', lineGap: 3 });

// Final Footer
doc.fillColor(COLORS.mintPale)
   .font('Helvetica')
   .fontSize(8.5)
   .text('AI-Based Smart Agriculture Management System', 48, 480);
doc.text('Thank You! Questions & Discussion Welcome', 400, 480, { align: 'center', width: 200 });
doc.text('Slide 15 / 15', 762, 480, { align: 'right', width: 150 });

// Finalize PDF file
doc.end();

stream.on('finish', () => {
  console.log(`SUCCESS: PDF presentation generated successfully at: ${outputPath}`);
});
