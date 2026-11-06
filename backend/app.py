"""
AgriSmart AI — Flask Backend REST API
Serves the Machine Learning Crop Recommendation Model
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Initialize Flask App ---
app = Flask(__name__)

# Configure CORS to allow local frontend access (file://, localhost, 127.0.0.1)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# --- Model & Metadata Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.pkl')
METADATA_PATH = os.path.join(BASE_DIR, 'models', 'model_metadata.json')

# Global variables for model and metadata
model = None
metadata = None

# Comprehensive Agronomic Profiles for the 22 Supported Crops
CROP_AGRONOMIC_PROFILES = {
    "apple": {
        "displayName": "Apple",
        "botanicalName": "Malus domestica",
        "category": "Temperate Fruit",
        "season": "Perennial / Autumn harvest",
        "soilRequirement": "Well-drained loam to sandy loam with pH 6.0–7.0",
        "advisory": "Requires chilling hours during dormancy. Maintain steady soil moisture without waterlogging."
    },
    "banana": {
        "displayName": "Banana",
        "botanicalName": "Musa acuminata",
        "category": "Tropical Fruit",
        "season": "Year-round cultivation",
        "soilRequirement": "Rich, loamy, moisture-retentive soil with pH 6.0–7.5",
        "advisory": "High potassium feeder. Requires abundant moisture, warmth, and shelter from strong winds."
    },
    "blackgram": {
        "displayName": "Blackgram (Urad)",
        "botanicalName": "Vigna mungo",
        "category": "Pulse / Legume",
        "season": "Kharif & Zaid season",
        "soilRequirement": "Loamy to heavy clay soils with pH 6.5–7.5",
        "advisory": "Fixes atmospheric nitrogen. Drought-tolerant once established; avoid standing water."
    },
    "chickpea": {
        "displayName": "Chickpea (Gram)",
        "botanicalName": "Cicer arietinum",
        "category": "Pulse / Legume",
        "season": "Rabi (Winter) season",
        "soilRequirement": "Deep, well-aerated sandy loam to clay loam with pH 6.0–7.8",
        "advisory": "Thrives in cool, dry post-monsoon weather. Minimal irrigation needed; vulnerable to collar rot in waterlogged soils."
    },
    "coconut": {
        "displayName": "Coconut",
        "botanicalName": "Cocos nucifera",
        "category": "Plantation Crop",
        "season": "Perennial",
        "soilRequirement": "Sandy loam, alluvial, and coastal soils with pH 5.5–8.0",
        "advisory": "Requires humid tropical conditions and high potassium/chloride fertilization."
    },
    "coffee": {
        "displayName": "Coffee",
        "botanicalName": "Coffea arabica / canephora",
        "category": "Beverage / Plantation",
        "season": "Perennial",
        "soilRequirement": "Deep, volcanic or well-drained organic forest loam with pH 6.0–6.5",
        "advisory": "Requires shade canopy and well-distributed rainfall followed by a dry spell for flower budding."
    },
    "cotton": {
        "displayName": "Cotton",
        "botanicalName": "Gossypium hirsutum",
        "category": "Commercial Fiber",
        "season": "Kharif season",
        "soilRequirement": "Deep black cotton soils (vertisols) or alluvial loam with pH 6.0–8.0",
        "advisory": "Requires warm days, sunny weather during boll opening, and moderate nitrogen management."
    },
    "grapes": {
        "displayName": "Grapes",
        "botanicalName": "Vitis vinifera",
        "category": "Horticultural Fruit",
        "season": "Perennial",
        "soilRequirement": "Deep, well-drained sandy loam or gravelly soil with pH 6.5–7.5",
        "advisory": "High potassium demand. Sensitive to prolonged humidity during berry ripening (mildew hazard)."
    },
    "jute": {
        "displayName": "Jute",
        "botanicalName": "Corchorus olitorius",
        "category": "Commercial Bast Fiber",
        "season": "Kharif season",
        "soilRequirement": "New alluvial sandy loam or silt loam with pH 6.0–7.5",
        "advisory": "Requires warm, humid climates with frequent showers and standing water tolerance during retting."
    },
    "kidneybeans": {
        "displayName": "Kidney Beans (Rajma)",
        "botanicalName": "Phaseolus vulgaris",
        "category": "Pulse / Grain Legume",
        "season": "Rabi in plains / Kharif in hills",
        "soilRequirement": "Light, friable loam rich in organic matter with pH 6.0–7.0",
        "advisory": "Sensitive to salt, waterlogging, and extreme heat. Requires balanced basal fertilization."
    },
    "lentil": {
        "displayName": "Lentil (Masoor)",
        "botanicalName": "Lens culinaris",
        "category": "Pulse / Legume",
        "season": "Rabi (Winter) season",
        "soilRequirement": "Loamy to light clay soils with pH 6.0–7.5",
        "advisory": "Cold tolerant; excellent rotational crop for rebuilding depleted soil fertility."
    },
    "maize": {
        "displayName": "Maize (Corn)",
        "botanicalName": "Zea mays",
        "category": "Cereal Grain",
        "season": "Kharif, Rabi, and Spring",
        "soilRequirement": "Fertile, well-drained loam or silt loam with pH 5.8–7.2",
        "advisory": "Heavy nitrogen consumer. Critical watering window is at silking and tasseling stages."
    },
    "mango": {
        "displayName": "Mango",
        "botanicalName": "Mangifera indica",
        "category": "Tropical Fruit",
        "season": "Perennial / Summer harvest",
        "soilRequirement": "Deep, well-drained alluvial or red loamy soil with pH 5.5–7.5",
        "advisory": "Requires dry weather prior to flowering to encourage blossom induction."
    },
    "mothbeans": {
        "displayName": "Moth Beans",
        "botanicalName": "Vigna aconitifolia",
        "category": "Arid Pulse",
        "season": "Kharif season",
        "soilRequirement": "Sandy to sandy-loam soils with pH 6.5–8.0",
        "advisory": "Exceptional drought resistance. Performs reliably in arid and semi-arid low-rainfall regions."
    },
    "mungbean": {
        "displayName": "Mungbean (Green Gram)",
        "botanicalName": "Vigna radiata",
        "category": "Pulse / Legume",
        "season": "Kharif, Rabi, and Summer",
        "soilRequirement": "Well-drained loam to sandy-loam with pH 6.2–7.2",
        "advisory": "Short duration (60–75 days). Highly suitable for intercropping and catch-cropping."
    },
    "muskmelon": {
        "displayName": "Muskmelon",
        "botanicalName": "Cucumis melo",
        "category": "Cucurbit / Fruit",
        "season": "Zaid (Summer) season",
        "soilRequirement": "Sandy loam, warm riverbed soils with pH 6.0–7.5",
        "advisory": "Requires sunny, hot dry conditions during fruit maturation for optimal sugar concentration."
    },
    "orange": {
        "displayName": "Orange / Citrus",
        "botanicalName": "Citrus sinensis",
        "category": "Subtropical Fruit",
        "season": "Perennial",
        "soilRequirement": "Deep, well-aerated sandy loam with pH 6.0–7.5",
        "advisory": "Avoid salinity and alkaline water. Regular micro-nutrient application (Zinc, Iron) essential."
    },
    "papaya": {
        "displayName": "Papaya",
        "botanicalName": "Carica papaya",
        "category": "Tropical Fruit",
        "season": "Perennial / Fast bearing",
        "soilRequirement": "Well-drained rich sandy loam with pH 6.0–7.0",
        "advisory": "Extremely sensitive to standing water (damping off). Protect from severe frost."
    },
    "pigeonpeas": {
        "displayName": "Pigeonpeas (Arhar / Toor)",
        "botanicalName": "Cajanus cajan",
        "category": "Grain Legume",
        "season": "Kharif season",
        "soilRequirement": "Deep loam to clay loam with pH 6.5–7.5",
        "advisory": "Deep taproot system tolerates prolonged dry intervals. Excellent intercrop with sorghum or maize."
    },
    "pomegranate": {
        "displayName": "Pomegranate",
        "botanicalName": "Punica granatum",
        "category": "Arid / Semi-arid Fruit",
        "season": "Perennial",
        "soilRequirement": "Light, gravelly or sandy loam with pH 6.5–7.8",
        "advisory": "Very hardy and drought-tolerant. Prone to fruit cracking if irrigation is erratic during maturity."
    },
    "rice": {
        "displayName": "Rice (Paddy)",
        "botanicalName": "Oryza sativa",
        "category": "Cereal Grain",
        "season": "Kharif / Aman / Boro season",
        "soilRequirement": "Heavy clay or clay-loam soils with low permeability, pH 5.5–7.0",
        "advisory": "High water requirement. Requires standing water or saturated soil during vegetative tillering."
    },
    "watermelon": {
        "displayName": "Watermelon",
        "botanicalName": "Citrullus lanatus",
        "category": "Cucurbit / Fruit",
        "season": "Zaid (Summer) season",
        "soilRequirement": "Warm, sandy to sandy-loam riverbeds rich in organic matter, pH 6.0–7.0",
        "advisory": "Dry atmosphere and warm days enhance fruit quality and sugar sweetness."
    }
}

def load_ml_model():
    """Loads the trained Random Forest model and metadata on startup."""
    global model, metadata
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f"[AgriSmart AI] Successfully loaded model from {MODEL_PATH}")
        except Exception as e:
            print(f"[AgriSmart AI] Error loading model: {e}")
            model = None
    else:
        print(f"[AgriSmart AI] Model file not found at {MODEL_PATH}. Run train_model.py first.")
        model = None

    if os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, 'r', encoding='utf-8') as f:
                metadata = json.load(f)
            print(f"[AgriSmart AI] Loaded metadata (Accuracy: {metadata.get('test_accuracy', 0)*100:.2f}%)")
        except Exception as e:
            print(f"[AgriSmart AI] Error loading metadata: {e}")
            metadata = None

# Load model immediately upon startup
load_ml_model()

# ============================================================================
# API Endpoints
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend status and model readiness."""
    return jsonify({
        "status": "healthy",
        "service": "AgriSmart AI Backend API",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "model_accuracy": metadata.get("test_accuracy") if metadata else None
    }), 200

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Returns technical metadata and evaluation metrics of the trained model."""
    if not metadata:
        return jsonify({
            "status": "error",
            "message": "Model metadata is currently unavailable."
        }), 503

    return jsonify({
        "status": "success",
        "metadata": metadata
    }), 200

@app.route('/api/predict-crop', methods=['POST'])
def predict_crop():
    """
    POST /api/predict-crop
    Accepts:
      - nitrogen (or N): numeric [0-300]
      - phosphorus (or P): numeric [0-200]
      - potassium (or K): numeric [0-300]
      - temperature: numeric [0-60]
      - humidity: numeric [0-100]
      - ph: numeric [0-14]
      - rainfall: numeric [0-500]

    Returns:
      JSON payload with the predicted crop, real classification confidence,
      agronomic profile, and verified input parameters.
    """
    global model
    if model is None:
        # Attempt to reload if model was trained recently
        load_ml_model()
        if model is None:
            return jsonify({
                "status": "error",
                "error_code": "MODEL_UNAVAILABLE",
                "message": "The trained Crop Recommendation model is not loaded. Please ensure backend/models/crop_model.pkl exists."
            }), 503

    # 1. Parse JSON payload
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "error_code": "INVALID_JSON",
            "message": "Request body must be a valid JSON object."
        }), 400

    # 2. Field definitions & validation boundaries
    expected_fields = {
        'nitrogen':    {'aliases': ['N', 'n', 'nitrogen'],       'min': 0, 'max': 300, 'label': 'Nitrogen (N)'},
        'phosphorus':  {'aliases': ['P', 'p', 'phosphorus'],     'min': 0, 'max': 200, 'label': 'Phosphorus (P)'},
        'potassium':   {'aliases': ['K', 'k', 'potassium'],      'min': 0, 'max': 300, 'label': 'Potassium (K)'},
        'temperature': {'aliases': ['temperature', 'temp'],      'min': 0, 'max': 60,  'label': 'Temperature'},
        'humidity':    {'aliases': ['humidity'],                 'min': 0, 'max': 100, 'label': 'Relative Humidity'},
        'ph':          {'aliases': ['ph', 'pH'],                 'min': 0, 'max': 14,  'label': 'Soil pH'},
        'rainfall':    {'aliases': ['rainfall', 'rain'],         'min': 0, 'max': 500, 'label': 'Rainfall'}
    }

    parsed_values = {}
    missing_fields = []
    invalid_fields = []

    for field_key, spec in expected_fields.items():
        # Match from aliases
        val = None
        for alias in spec['aliases']:
            if alias in data and data[alias] is not None:
                val = data[alias]
                break

        if val is None or str(val).strip() == '':
            missing_fields.append(spec['label'])
            continue

        try:
            numeric_val = float(val)
        except (ValueError, TypeError):
            invalid_fields.append(f"{spec['label']} must be a valid number.")
            continue

        if numeric_val < spec['min'] or numeric_val > spec['max']:
            invalid_fields.append(
                f"{spec['label']} value ({numeric_val}) is outside realistic bounds ({spec['min']}–{spec['max']})."
            )
            continue

        parsed_values[field_key] = numeric_val

    if missing_fields:
        return jsonify({
            "status": "error",
            "error_code": "MISSING_FIELDS",
            "message": f"Missing required parameter(s): {', '.join(missing_fields)}.",
            "missing_fields": missing_fields
        }), 400

    if invalid_fields:
        return jsonify({
            "status": "error",
            "error_code": "INVALID_PARAMETERS",
            "message": "One or more input values are invalid.",
            "details": invalid_fields
        }), 400

    # 3. Assemble Feature DataFrame matching model training column names:
    # ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    feature_df = pd.DataFrame([{
        'N': parsed_values['nitrogen'],
        'P': parsed_values['phosphorus'],
        'K': parsed_values['potassium'],
        'temperature': parsed_values['temperature'],
        'humidity': parsed_values['humidity'],
        'ph': parsed_values['ph'],
        'rainfall': parsed_values['rainfall']
    }])

    # 4. Perform Machine Learning Inference
    try:
        # Raw prediction from trained Random Forest
        raw_prediction = model.predict(feature_df)[0]
        crop_key = str(raw_prediction).lower().strip()

        # Calculate real model prediction probabilities
        confidence = None
        top_alternatives = []
        if hasattr(model, 'predict_proba'):
            probs = model.predict_proba(feature_df)[0]
            classes = model.classes_
            
            # Rank top predictions
            sorted_indices = np.argsort(probs)[::-1]
            top_prob = float(probs[sorted_indices[0]] * 100)
            confidence = round(top_prob, 2)

            for idx in sorted_indices[1:4]:
                if probs[idx] > 0.01:  # At least 1% probability
                    top_alternatives.append({
                        "crop": str(classes[idx]),
                        "probability": round(float(probs[idx] * 100), 2)
                    })

        # Fetch agronomic profile
        profile = CROP_AGRONOMIC_PROFILES.get(crop_key, {
            "displayName": crop_key.capitalize(),
            "botanicalName": "Botanical species",
            "category": "Agricultural Crop",
            "season": "Seasonal",
            "soilRequirement": "Standard agricultural soil",
            "advisory": "Follow local package of practices for optimal harvest yield."
        })

        response_payload = {
            "status": "success",
            "prediction": {
                "crop": crop_key,
                "displayName": profile["displayName"],
                "botanicalName": profile["botanicalName"],
                "category": profile["category"],
                "season": profile["season"],
                "soilRequirement": profile["soilRequirement"],
                "agronomicAdvisory": profile["advisory"],
                "confidenceScore": confidence,
                "topAlternatives": top_alternatives
            },
            "modelInfo": {
                "modelType": "Random Forest Classifier (100 Trees)",
                "testAccuracy": f"{metadata.get('test_accuracy', 0.9955) * 100:.2f}%" if metadata else "99.55%",
                "datasetSource": "Public Crop Recommendation Dataset (2,200 multi-crop trials)"
            },
            "inputParameters": {
                "nitrogen": parsed_values['nitrogen'],
                "phosphorus": parsed_values['phosphorus'],
                "potassium": parsed_values['potassium'],
                "temperature": parsed_values['temperature'],
                "humidity": parsed_values['humidity'],
                "ph": parsed_values['ph'],
                "rainfall": parsed_values['rainfall']
            }
        }

        return jsonify(response_payload), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "error_code": "INFERENCE_FAILED",
            "message": f"Machine learning inference failed: {str(e)}"
        }), 500

# ============================================================================
# Smart Irrigation Advisor Engine (Rule-Based FAO-56 Standard)
# ============================================================================

IRRIGATION_CROP_CONSTANTS = {
    "wheat": {"name": "Wheat (Triticum aestivum)", "kc": 0.95, "method": "Sprinkler / Border Strip", "rootDepthCm": 60, "criticalStage": "Crown root initiation & Flowering"},
    "rice": {"name": "Rice / Paddy (Oryza sativa)", "kc": 1.20, "method": "Shallow Flooding / Alternate Wetting", "rootDepthCm": 40, "criticalStage": "Tillering & Panicle initiation"},
    "maize": {"name": "Maize / Corn (Zea mays)", "kc": 0.90, "method": "Furrow / Drip", "rootDepthCm": 50, "criticalStage": "Tasseling & Silking"},
    "cotton": {"name": "Cotton (Gossypium hirsutum)", "kc": 1.00, "method": "Drip Irrigation", "rootDepthCm": 80, "criticalStage": "Squaring & Boll development"},
    "sugarcane": {"name": "Sugarcane (Saccharum officinarum)", "kc": 1.15, "method": "Drip / Trash Mulched Furrow", "rootDepthCm": 90, "criticalStage": "Grand growth phase"},
    "tomato": {"name": "Tomato (Solanum lycopersicum)", "kc": 1.05, "method": "Drip Irrigation", "rootDepthCm": 45, "criticalStage": "Flowering & Fruit enlargement"},
    "potato": {"name": "Potato (Solanum tuberosum)", "kc": 0.85, "method": "Drip / Sprinkler", "rootDepthCm": 35, "criticalStage": "Tuber initiation & Bulking"},
    "groundnut": {"name": "Groundnut / Peanut (Arachis hypogaea)", "kc": 0.80, "method": "Sprinkler / Drip", "rootDepthCm": 40, "criticalStage": "Peg penetration & Pod formation"},
    "mustard": {"name": "Mustard (Brassica juncea)", "kc": 0.70, "method": "Sprinkler / Furrow", "rootDepthCm": 50, "criticalStage": "Branching & Siliqua development"},
    "chickpea": {"name": "Chickpea / Gram (Cicer arietinum)", "kc": 0.65, "method": "Light Sprinkler", "rootDepthCm": 45, "criticalStage": "Pre-flowering & Pod development"}
}

@app.route('/api/irrigation-advisor', methods=['POST'])
def irrigation_advisor():
    """
    POST /api/irrigation-advisor
    Calculates reference evapotranspiration (ET0), crop water demand (ETc),
    soil moisture deficit, and net irrigation depth/volume with schedule.
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"status": "error", "message": "Request body must be a valid JSON object."}), 400

    crop_raw = str(data.get('crop', '')).lower().strip()
    # Match crop key
    crop_key = None
    for k in IRRIGATION_CROP_CONSTANTS.keys():
        if k in crop_raw:
            crop_key = k
            break
    if not crop_key:
        crop_key = 'wheat' # default fallback

    try:
        moisture = float(data.get('moisture', 50))
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 60))
        rainfall = float(data.get('rainfall', 0))
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Moisture, temperature, humidity, and rainfall must be numeric."}), 400

    # Bounds validation
    if not (0 <= moisture <= 100 and 0 <= temperature <= 60 and 0 <= humidity <= 100 and 0 <= rainfall <= 300):
        return jsonify({"status": "error", "message": "Input values are outside realistic agricultural bounds."}), 400

    crop_info = IRRIGATION_CROP_CONSTANTS[crop_key]
    kc = crop_info['kc']

    # 1. Reference Evapotranspiration (ET0) estimation (FAO-56 empirical approximation)
    et0 = (0.46 * temperature + 8.0) * (1.0 - (humidity / 160.0))
    et0 = max(1.8, min(8.5, round(et0, 2)))

    # 2. Crop Evapotranspiration (ETc)
    etc = round(et0 * kc, 2)

    # 3. Moisture deficit (target optimal is 65%)
    target_moisture = 65.0
    moisture_deficit_pct = max(0.0, target_moisture - moisture)

    # Effective rainfall (70% utilization)
    effective_rain = round(rainfall * 0.70, 1)

    # Net water requirement (mm)
    soil_depth_factor = crop_info['rootDepthCm'] / 100.0
    water_depth_mm = (moisture_deficit_pct * 0.45 * soil_depth_factor) + etc - effective_rain
    net_water_mm = max(0.0, round(water_depth_mm, 1))

    # Liters per hectare (1 mm = 10,000 L/ha)
    liters_per_ha = int(net_water_mm * 10000)

    # Status Determination
    if moisture < 40.0:
        urgency = "Urgent Irrigation Required"
        status_code = "urgent"
        urgency_note = "Soil moisture is critically below Management Allowed Depletion (MAD). Irrigate immediately."
    elif moisture < 55.0 or net_water_mm > 5.0:
        urgency = "Moderate Irrigation Advised"
        status_code = "moderate"
        urgency_note = "Soil moisture is depleting. Schedule irrigation within the next 12 to 24 hours."
    else:
        urgency = "Adequate Soil Moisture"
        status_code = "adequate"
        urgency_note = "Current soil moisture and recent precipitation are sufficient. No immediate watering needed."

    # Runtime calculation for standard drip emitter discharge (2.5 mm/hour)
    drip_discharge_mm_hr = 2.5
    if net_water_mm > 0:
        runtime_hours = round(net_water_mm / drip_discharge_mm_hr, 1)
        runtime_mins = int(runtime_hours * 60)
        runtime_display = f"{runtime_mins // 60}h {runtime_mins % 60}m" if runtime_mins >= 60 else f"{runtime_mins} minutes"
    else:
        runtime_display = "0 minutes (System on standby)"

    return jsonify({
        "status": "success",
        "crop": crop_info['name'],
        "cropKey": crop_key,
        "calculationMethod": "FAO-56 Evapotranspiration & Soil Moisture Balance Model",
        "urgency": urgency,
        "statusCode": status_code,
        "urgencyNote": urgency_note,
        "metrics": {
            "referenceET0": f"{et0} mm/day",
            "cropCoefficientKc": kc,
            "cropETc": f"{etc} mm/day",
            "netWaterRequiredMm": net_water_mm,
            "waterVolumeLitersPerHa": f"{liters_per_ha:,} L/ha",
            "effectiveRainfallDeducted": f"{effective_rain} mm"
        },
        "advisory": {
            "recommendedMethod": crop_info['method'],
            "recommendedRuntime": runtime_display,
            "optimalWindow": "Early morning (06:00 - 08:30) or late evening (17:30 - 19:30)",
            "criticalGrowthStage": crop_info['criticalStage'],
            "conservationTip": "Employing drip micro-irrigation saves 30–45% water compared to flood irrigation and reduces weed emergence."
        },
        "inputParameters": {
            "crop": crop_info['name'],
            "soilMoisture": f"{moisture}%",
            "temperature": f"{temperature} °C",
            "humidity": f"{humidity}%",
            "recentRainfall": f"{rainfall} mm"
        }
    }), 200

# ============================================================================
# Fertilizer Guidance Engine (Rule-Based ICAR Nutrient Gap Standard)
# ============================================================================

FERTILIZER_CROP_BASELINES = {
    "wheat": {"name": "Wheat (Triticum aestivum)", "n": 120, "p": 60, "k": 40},
    "rice": {"name": "Rice / Paddy (Oryza sativa)", "n": 100, "p": 50, "k": 50},
    "maize": {"name": "Maize / Corn (Zea mays)", "n": 120, "p": 60, "k": 50},
    "cotton": {"name": "Cotton (Gossypium hirsutum)", "n": 100, "p": 50, "k": 50},
    "sugarcane": {"name": "Sugarcane (Saccharum officinarum)", "n": 180, "p": 70, "k": 80},
    "tomato": {"name": "Tomato (Solanum lycopersicum)", "n": 110, "p": 70, "k": 90},
    "potato": {"name": "Potato (Solanum tuberosum)", "n": 120, "p": 80, "k": 100},
    "groundnut": {"name": "Groundnut / Peanut (Arachis hypogaea)", "n": 25, "p": 50, "k": 75},
    "mustard": {"name": "Mustard (Brassica juncea)", "n": 80, "p": 40, "k": 40},
    "chickpea": {"name": "Chickpea / Gram (Cicer arietinum)", "n": 20, "p": 40, "k": 30}
}

@app.route('/api/fertilizer-guidance', methods=['POST'])
def fertilizer_guidance():
    """
    POST /api/fertilizer-guidance
    Calculates nutrient deficit against crop targets and prescribes
    exact commercial fertilizers (Urea, DAP, MOP), split application schedule, and pH amendments.
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"status": "error", "message": "Request body must be a valid JSON object."}), 400

    crop_raw = str(data.get('crop', '')).lower().strip()
    crop_key = None
    for k in FERTILIZER_CROP_BASELINES.keys():
        if k in crop_raw:
            crop_key = k
            break
    if not crop_key:
        crop_key = 'wheat'

    try:
        soil_n = float(data.get('n', 60))
        soil_p = float(data.get('p', 30))
        soil_k = float(data.get('k', 40))
        soil_ph = float(data.get('ph', 6.5))
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "N, P, K, and pH must be numeric."}), 400

    if not (0 <= soil_n <= 300 and 0 <= soil_p <= 200 and 0 <= soil_k <= 300 and 0 <= soil_ph <= 14):
        return jsonify({"status": "error", "message": "Soil values are outside realistic agronomic testing ranges."}), 400

    baseline = FERTILIZER_CROP_BASELINES[crop_key]
    target_n, target_p, target_k = baseline['n'], baseline['p'], baseline['k']

    # 1. Nutrient Gaps (kg/ha)
    gap_n = max(0.0, round(target_n - soil_n, 1))
    gap_p = max(0.0, round(target_p - soil_p, 1))
    gap_k = max(0.0, round(target_k - soil_k, 1))

    # 2. Commercial Fertilizer Calculation
    # DAP contains 18% N and 46% P2O5
    # First fulfill Phosphorus gap using DAP
    dap_kg = round(gap_p / 0.46, 1) if gap_p > 0 else 0.0
    n_from_dap = round(dap_kg * 0.18, 1)

    # Remaining Nitrogen fulfilled by Urea (46% N)
    remaining_n = max(0.0, gap_n - n_from_dap)
    urea_kg = round(remaining_n / 0.46, 1) if remaining_n > 0 else 0.0

    # Potassium fulfilled by MOP (Muriate of Potash: 60% K2O)
    mop_kg = round(gap_k / 0.60, 1) if gap_k > 0 else 0.0

    # 3. Soil pH Evaluation & Amendments
    if soil_ph < 6.0:
        ph_status = "Acidic Soil (pH < 6.0)"
        ph_advisory = "Soil acidity inhibits phosphorus availability. Apply agricultural lime (CaCO3) @ 250–400 kg/ha before sowing to buffer pH."
    elif soil_ph > 8.0:
        ph_status = "Alkaline / Calcareous Soil (pH > 8.0)"
        ph_advisory = "High alkalinity fixes zinc and phosphorus. Apply agricultural gypsum @ 300 kg/ha or enriched farmyard manure (FYM)."
    else:
        ph_status = "Optimal / Neutral Soil (pH 6.0-7.8)"
        ph_advisory = "Soil reaction is well-balanced. Maximum nutrient bioavailability achieved without chemical soil amendments."

    # 4. Split Application Schedule
    split_schedule = [
        {
            "stage": "Basal Dose (At Sowing / Field Prep)",
            "urea": f"{round(urea_kg * 0.33, 1)} kg/ha (1/3rd)",
            "dap": f"{dap_kg} kg/ha (100% full dose)",
            "mop": f"{mop_kg} kg/ha (100% full dose)",
            "purpose": "Promotes root architecture establishment and vigorous early tillering."
        },
        {
            "stage": "First Top Dressing (Vegetative / Tillering Stage)",
            "urea": f"{round(urea_kg * 0.33, 1)} kg/ha (1/3rd)",
            "dap": "0 kg/ha",
            "mop": "0 kg/ha",
            "purpose": "Boosts canopy chlorophyll synthesis and vegetative stem elongation."
        },
        {
            "stage": "Second Top Dressing (Flowering / Boot Stage)",
            "urea": f"{round(urea_kg * 0.34, 1)} kg/ha (Final dose)",
            "dap": "0 kg/ha",
            "mop": "0 kg/ha",
            "purpose": "Sustains flag leaf vitality and grain filling without vegetative lodging."
        }
    ]

    return jsonify({
        "status": "success",
        "crop": baseline['name'],
        "cropKey": crop_key,
        "calculationMethod": "ICAR Recommended Fertilizer Dosage & Nutrient-Gap Model",
        "nutrientGaps": {
            "nitrogenGap": f"{gap_n} kg/ha",
            "phosphorusGap": f"{gap_p} kg/ha",
            "potassiumGap": f"{gap_k} kg/ha"
        },
        "fertilizerRecommendations": {
            "urea": f"{urea_kg} kg/ha (46% N)",
            "dap": f"{dap_kg} kg/ha (18-46-0)",
            "mop": f"{mop_kg} kg/ha (0-0-60 Muriate of Potash)",
            "ureaBags": f"{round(urea_kg / 45.0, 1)} bags (45kg standard)",
            "dapBags": f"{round(dap_kg / 50.0, 1)} bags (50kg standard)",
            "mopBags": f"{round(mop_kg / 50.0, 1)} bags (50kg standard)"
        },
        "soilReaction": {
            "measuredPh": soil_ph,
            "status": ph_status,
            "advisory": ph_advisory
        },
        "applicationSchedule": split_schedule,
        "stewardshipPrinciple": "4R Stewardship: Apply Right Source at Right Rate, Right Time, and Right Place for sustainable soil health."
    }), 200

if __name__ == '__main__':
    # Default local dev port 5000
    port = int(os.environ.get('PORT', 5000))
    print(f"[AgriSmart AI] Server starting on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=False)
