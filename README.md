# AgriSmart AI — Smart Agriculture Assistant

An intelligent decision-support assistant designed for farmers, agronomists, and agricultural students. Built as a college mini project by **Lalit Mishra**, AgriSmart AI combines a modern agriculture SaaS dashboard with machine learning models and domain-specific agronomic rules.

---

## 1. Project Overview

* **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (No React, Vue, Next.js, or bundlers).
* **Backend API**: Lightweight Python Flask REST API with Cross-Origin Resource Sharing (`flask-cors`).
* **Machine Learning Engine**: Scikit-Learn Random Forest Classifier trained on agricultural trials data.
* **Palette**: Deep forest green, fresh botanical green, warm off-white canvas, and crisp white cards.

---

## 2. Project Directory Structure

```text
ai-based-smart-agriculture-system/
│
├── frontend/
│   ├── index.html                 # Semantic HTML5 app shell & view sections
│   ├── css/
│   │   ├── variables.css          # Design tokens (green, cream, white palette, typography)
│   │   └── style.css              # SaaS layouts, cards, responsive grids & form styles
│   └── js/
│       ├── app.js                 # View switching, navigation & dropdown controller
│       ├── crop.js                # Crop recommendation form & API integration
│       ├── irrigation.js          # Irrigation advisor UI logic (Part 3)
│       └── fertilizer.js          # Fertilizer guidance UI logic (Part 3)
│
├── backend/
│   ├── app.py                     # Flask entrypoint & REST API routes (/api/predict-crop)
│   ├── requirements.txt           # Python dependencies
│   ├── train_model.py             # Script to load data, train Random Forest, and save model
│   ├── data/
│   │   └── crop_recommendation.csv# Public multi-crop trials dataset (2,200 rows)
│   └── models/
│       ├── crop_model.pkl         # Serialized Scikit-learn Random Forest model
│       └── model_metadata.json    # Model evaluation metrics & feature definitions
│
├── .gitignore                     # Git exclusions (venv, __pycache__, logs)
├── PROJECT_PLAN.md                # Full architectural blueprint and roadmap
└── README.md                      # Project documentation and guide (this file)
```

---

## 3. Dataset Source & Description

* **Source**: Public Crop Recommendation Dataset (widely available under Public Domain / MIT license on Kaggle and GitHub agricultural research repositories).
* **Sample Count**: 2,200 records.
* **Class Distribution**: 22 unique crop categories with 100 balanced samples per crop.
* **Target Crops**: `apple`, `banana`, `blackgram`, `chickpea`, `coconut`, `coffee`, `cotton`, `grapes`, `jute`, `kidneybeans`, `lentil`, `maize`, `mango`, `mothbeans`, `mungbean`, `muskmelon`, `orange`, `papaya`, `pigeonpeas`, `pomegranate`, `rice`, `watermelon`.
* **Missing Values / Duplicates**: Zero missing values, zero duplicated records.

### Documented Features & Units

| Feature Column | Description | Measurement Unit | Standard Range |
| :--- | :--- | :--- | :--- |
| `N` | Ratio of Nitrogen content in soil | mg/kg (or kg/ha) | 0 – 140 mg/kg |
| `P` | Ratio of Phosphorus content in soil | mg/kg | 5 – 145 mg/kg |
| `K` | Ratio of Potassium content in soil | mg/kg | 5 – 205 mg/kg |
| `temperature` | Ambient daytime temperature | Degrees Celsius (°C) | 8.8 – 43.7 °C |
| `humidity` | Relative atmospheric humidity | Percentage (%) | 14.3 – 99.9 % |
| `ph` | Soil acidity / alkalinity | pH scale (0.0 – 14.0) | 3.5 – 9.9 pH |
| `rainfall` | Annual / seasonal precipitation | Millimeters (mm) | 20.2 – 298.6 mm |

---

## 4. Machine Learning Model & Training

* **Algorithm**: `RandomForestClassifier` (100 decision trees, `random_state=42`).
* **Data Split**: Stratified 80% Training (1,760 samples) and 20% Testing (440 samples).
* **Held-Out Test Accuracy**: **99.55%** (438 out of 440 predictions correct).
* **Macro Average F1-Score**: **0.995** across all 22 crop classes.
* **Saved Artifacts**: Serialized model saved to `backend/models/crop_model.pkl` and metadata to `backend/models/model_metadata.json`.

---

## 5. Prerequisites & Environment Setup

Python 3.12 is installed at:
```text
C:\Users\lalit\AppData\Local\Programs\Python\Python312\python.exe
```

> [!NOTE]
> If `python` is not available directly on your system PATH, use the full executable path as demonstrated below.

### Step 1: Install Backend Dependencies
Run the following command in PowerShell:
```powershell
& "C:\Users\lalit\AppData\Local\Programs\Python\Python312\python.exe" -m pip install -r backend/requirements.txt
```

### Step 2: (Optional) Re-Train the Machine Learning Model
The trained model artifact is already committed and saved. To retrain:
```powershell
& "C:\Users\lalit\AppData\Local\Programs\Python\Python312\python.exe" backend/train_model.py
```

---

## 6. Starting the Flask Server

Start the backend API server:
```powershell
& "C:\Users\lalit\AppData\Local\Programs\Python\Python312\python.exe" backend/app.py
```
The server will start at: **`http://127.0.0.1:5000`**

### Available REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns backend service status and confirms model is loaded |
| `GET` | `/api/model-info` | Returns model metadata, features, and test accuracy metrics |
| `POST` | `/api/predict-crop` | Accepts 7 soil & climate parameters and returns recommended crop |

---

## 7. Testing the Prediction Endpoint

You can test the API endpoint directly using PowerShell:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/predict-crop" -Method Post -ContentType "application/json" -Body (@{
    nitrogen = 90
    phosphorus = 42
    potassium = 43
    temperature = 20.8
    humidity = 82
    ph = 6.5
    rainfall = 202
} | ConvertTo-Json)
```

**Expected JSON Response:**
```json
{
  "status": "success",
  "prediction": {
    "crop": "rice",
    "displayName": "Rice (Paddy)",
    "botanicalName": "Oryza sativa",
    "category": "Cereal Grain",
    "confidenceScore": 90.0,
    "season": "Kharif / Aman / Boro season",
    "soilRequirement": "Heavy clay or clay-loam soils with low permeability, pH 5.5-7.0",
    "agronomicAdvisory": "High water requirement. Requires standing water or saturated soil during vegetative tillering.",
    "topAlternatives": [
      { "crop": "jute", "probability": 10.0 }
    ]
  },
  "modelInfo": {
    "modelType": "Random Forest Classifier (100 Trees)",
    "testAccuracy": "99.55%",
    "datasetSource": "Public Crop Recommendation Dataset (2,200 multi-crop trials)"
  }
}
```

---

## 8. Opening the Frontend

You can open the user interface through either of these methods:

1. **Direct File Method**: Double-click `frontend/index.html` in File Explorer to open in Google Chrome or Microsoft Edge.
2. **Local Static Server**:
   ```powershell
   npx serve frontend
   ```
   Then navigate to `http://localhost:3000`.

---

## 9. Model Limitations & Presentation Notes

For academic and viva presentations, keep these domain limitations in mind:
1. **Scope of Variables**: The model evaluates primary macronutrients ($N, P, K$) and macro-climatic conditions ($T, H, pH, Rain$). It does not evaluate micro-nutrients (Zinc, Boron, Iron) or specific soil microbiological activity.
2. **Economic vs Agronomic Suitability**: The system predicts biological and physiological crop viability, not market pricing or farmer profit margins.
3. **Open-Field Assumption**: Data is based on open-field agricultural conditions and does not model hydroponic or controlled environment agriculture (greenhouses).
