/**
 * AgriSmart AI — Crop Recommendation Controller
 *
 * Connects the Crop Recommendation form to the Python Flask Machine Learning REST API:
 * Endpoint: POST http://127.0.0.1:5000/api/predict-crop
 * Model: Scikit-learn Random Forest Classifier (100 Trees, 99.55% Test Accuracy)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // API Endpoint Configuration
  const API_BASE_URL = 'http://127.0.0.1:5000';
  const PREDICT_CROP_URL = `${API_BASE_URL}/api/predict-crop`;

  // --- Element Selectors ---
  const cropForm = document.getElementById('cropForm');
  const btnPredictCrop = document.getElementById('btnPredictCrop');
  const btnLoadCropSample = document.getElementById('btnLoadCropSample');
  const btnResetCrop = document.getElementById('btnResetCrop');

  // Feedback Containers & State Views
  const cropFeedbackContainer = document.getElementById('cropFeedbackContainer');
  const cropLoadingState = document.getElementById('cropLoadingState');
  const cropResultState = document.getElementById('cropResultState');
  const cropErrorState = document.getElementById('cropErrorState');
  const cropErrorMessage = document.getElementById('cropErrorMessage');

  // Action Buttons inside feedback states
  const btnEditCropParams = document.getElementById('btnEditCropParams');
  const btnRetryCropApi = document.getElementById('btnRetryCropApi');
  const btnDismissCropError = document.getElementById('btnDismissCropError');

  // Real Prediction Display Elements
  const resultCropName = document.getElementById('resultCropName');
  const resultCropBotanical = document.getElementById('resultCropBotanical');
  const resultCropCategory = document.getElementById('resultCropCategory');
  const resultCropConfidence = document.getElementById('resultCropConfidence');
  const resultCropSeason = document.getElementById('resultCropSeason');
  const resultCropSoil = document.getElementById('resultCropSoil');
  const resultCropAdvisory = document.getElementById('resultCropAdvisory');
  const cropModelBadge = document.getElementById('cropModelBadge');
  const resultAlternativesContainer = document.getElementById('resultAlternativesContainer');
  const resultAlternativesList = document.getElementById('resultAlternativesList');

  // Input Field References
  const fields = {
    n: { el: document.getElementById('cropN'), min: 0, max: 300, name: 'Nitrogen (N)' },
    p: { el: document.getElementById('cropP'), min: 0, max: 200, name: 'Phosphorus (P)' },
    k: { el: document.getElementById('cropK'), min: 0, max: 300, name: 'Potassium (K)' },
    temp: { el: document.getElementById('cropTemp'), min: 0, max: 60, name: 'Temperature' },
    humidity: { el: document.getElementById('cropHumidity'), min: 0, max: 100, name: 'Humidity' },
    ph: { el: document.getElementById('cropPh'), min: 0, max: 14, name: 'Soil pH' },
    rain: { el: document.getElementById('cropRain'), min: 0, max: 500, name: 'Rainfall' }
  };

  if (!cropForm) return;

  // Restore latest prediction onto Executive Dashboard card if stored
  try {
    const saved = JSON.parse(localStorage.getItem('agrismart_latest_crop') || 'null');
    if (saved && saved.displayName) {
      const dashVal = document.getElementById('dashCropValue');
      const dashTr = document.getElementById('dashCropTrend');
      const dashBd = document.getElementById('dashCropBadge');
      const dashSub = document.getElementById('dashCropSubtext');
      if (dashVal) dashVal.textContent = saved.displayName;
      if (dashTr && typeof saved.confidenceScore === 'number') dashTr.textContent = `↑ ${saved.confidenceScore.toFixed(1)}%`;
      if (dashBd) {
        dashBd.textContent = 'Live ML Prediction';
        dashBd.style.backgroundColor = 'var(--color-accent-100)';
        dashBd.style.color = 'var(--color-primary-900)';
      }
      if (dashSub) dashSub.textContent = 'Calculated by Random Forest';
    }
  } catch (e) {}

  // ========================================================================
  // Validation Helpers
  // ========================================================================

  function clearFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('is-invalid');
    const group = inputEl.closest('.form-group');
    if (group) {
      const errorMsg = group.querySelector('.form-error-msg');
      if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.classList.remove('visible');
      }
    }
  }

  function setFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add('is-invalid');
    const group = inputEl.closest('.form-group');
    if (group) {
      const errorMsg = group.querySelector('.form-error-msg');
      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.add('visible');
      }
    }
  }

  function validateCropForm() {
    let isValid = true;
    let firstInvalidField = null;

    Object.keys(fields).forEach(key => {
      const { el, min, max, name } = fields[key];
      if (!el) return;

      const rawVal = el.value.trim();

      // Check required
      if (rawVal === '') {
        setFieldError(el, `Please enter a value for ${name}.`);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = el;
        return;
      }

      const numVal = parseFloat(rawVal);

      // Check numeric
      if (isNaN(numVal)) {
        setFieldError(el, `Please enter a valid numeric value for ${name}.`);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = el;
        return;
      }

      // Check boundary limits
      if (numVal < min || numVal > max) {
        setFieldError(el, `${name} must be between ${min} and ${max}.`);
        isValid = false;
        if (!firstInvalidField) firstInvalidField = el;
        return;
      }

      clearFieldError(el);
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  // Clear errors dynamically when typing
  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    if (el) {
      el.addEventListener('input', () => clearFieldError(el));
    }
  });

  // ========================================================================
  // Real ML API Inference Call
  // ========================================================================

  /**
   * Dispatches payload to the Python Flask backend and renders real prediction
   * @param {Object} payload 
   */
  async function submitPredictionToAPI(payload) {
    // 1. Enter Loading State
    btnPredictCrop.disabled = true;
    const btnText = btnPredictCrop.querySelector('.btn-label');
    const btnSpinner = btnPredictCrop.querySelector('.spinner');
    if (btnText) btnText.textContent = 'Querying ML Model...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    // Show feedback container in loading state
    cropFeedbackContainer.classList.add('active');
    cropLoadingState.style.display = 'flex';
    cropResultState.style.display = 'none';
    cropErrorState.style.display = 'none';

    cropFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const response = await fetch(PREDICT_CROP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorDetail = (data && data.message) ? data.message : `Server responded with status code ${response.status}.`;
        throw new Error(errorDetail);
      }

      if (!data || data.status !== 'success' || !data.prediction) {
        throw new Error((data && data.message) || 'Invalid response structure received from crop prediction API.');
      }

      // 2. Render Real Prediction Output
      renderPredictionSuccess(data);

    } catch (err) {
      console.error('AgriSmart AI Crop API Error:', err);
      renderPredictionError(err);
    } finally {
      // Restore submit button
      btnPredictCrop.disabled = false;
      if (btnText) btnText.textContent = 'Get Crop Recommendation';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  }

  /**
   * Renders the true Machine Learning prediction returned by Flask
   */
  function renderPredictionSuccess(data) {
    const pred = data.prediction;
    const inputs = data.inputParameters;
    const modelInfo = data.modelInfo;

    // Crop Identity
    if (resultCropName) resultCropName.textContent = pred.displayName || pred.crop;
    if (resultCropBotanical) resultCropBotanical.textContent = pred.botanicalName ? `Species: ${pred.botanicalName}` : '';
    if (resultCropCategory) resultCropCategory.textContent = pred.category || 'Agricultural Crop';

    // Real Random Forest Confidence Probability
    if (resultCropConfidence) {
      if (typeof pred.confidenceScore === 'number') {
        resultCropConfidence.textContent = `${pred.confidenceScore.toFixed(1)}% Match`;
      } else {
        resultCropConfidence.textContent = 'Model Verified';
      }
    }

    // Agronomic Profiles
    if (resultCropSeason) resultCropSeason.textContent = pred.season || 'Seasonal';
    if (resultCropSoil) resultCropSoil.textContent = pred.soilRequirement || 'Standard field soil';
    if (resultCropAdvisory) resultCropAdvisory.textContent = pred.agronomicAdvisory || 'Follow recommended package of practices.';

    // Alternative candidate crops (if any)
    if (resultAlternativesContainer && resultAlternativesList) {
      if (pred.topAlternatives && pred.topAlternatives.length > 0) {
        resultAlternativesList.innerHTML = '';
        pred.topAlternatives.forEach(alt => {
          const chip = document.createElement('span');
          chip.className = 'alternative-chip';
          chip.textContent = `${alt.crop} (${alt.probability}%)`;
          resultAlternativesList.appendChild(chip);
        });
        resultAlternativesContainer.style.display = 'flex';
      } else {
        resultAlternativesContainer.style.display = 'none';
      }
    }

    // Model Info Badge
    if (cropModelBadge && modelInfo) {
      cropModelBadge.textContent = `${modelInfo.modelType} • ${modelInfo.testAccuracy} Accuracy`;
    }

    // Populate Recap Values for full transparency
    if (inputs) {
      document.getElementById('recapCropN').textContent = `${inputs.nitrogen} mg/kg`;
      document.getElementById('recapCropP').textContent = `${inputs.phosphorus} mg/kg`;
      document.getElementById('recapCropK').textContent = `${inputs.potassium} mg/kg`;
      document.getElementById('recapCropPh').textContent = `${inputs.ph} pH`;
      document.getElementById('recapCropTemp').textContent = `${inputs.temperature} °C`;
      document.getElementById('recapCropHumidity').textContent = `${inputs.humidity} %`;
      document.getElementById('recapCropRain').textContent = `${inputs.rainfall} mm`;
    }

    // Synchronize Executive Dashboard Card with Real Model Prediction
    const dashCropValue = document.getElementById('dashCropValue');
    const dashCropTrend = document.getElementById('dashCropTrend');
    const dashCropBadge = document.getElementById('dashCropBadge');
    const dashCropSubtext = document.getElementById('dashCropSubtext');
    if (dashCropValue) dashCropValue.textContent = pred.displayName || pred.crop;
    if (dashCropTrend && typeof pred.confidenceScore === 'number') {
      dashCropTrend.textContent = `↑ ${pred.confidenceScore.toFixed(1)}%`;
    }
    if (dashCropBadge) {
      dashCropBadge.textContent = 'Live ML Prediction';
      dashCropBadge.style.backgroundColor = 'var(--color-accent-100)';
      dashCropBadge.style.color = 'var(--color-primary-900)';
      dashCropBadge.style.borderColor = 'var(--color-accent-400)';
    }
    if (dashCropSubtext) dashCropSubtext.textContent = 'Calculated by Random Forest';

    // Persist latest prediction in browser session
    try {
      localStorage.setItem('agrismart_latest_crop', JSON.stringify({
        displayName: pred.displayName || pred.crop,
        confidenceScore: pred.confidenceScore
      }));
    } catch (e) {}

    // Switch view states
    cropLoadingState.style.display = 'none';
    cropErrorState.style.display = 'none';
    cropResultState.style.display = 'block';
  }

  /**
   * Renders friendly error notification when Flask API is unreachable or fails
   */
  function renderPredictionError(err) {
    cropLoadingState.style.display = 'none';
    cropResultState.style.display = 'none';
    cropErrorState.style.display = 'block';

    if (cropErrorMessage) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        cropErrorMessage.innerHTML = `Unable to connect to the AgriSmart AI Flask server at <code>${PREDICT_CROP_URL}</code>. The backend server appears to be offline.`;
      } else {
        cropErrorMessage.textContent = err.message || 'An unexpected error occurred while communicating with the crop prediction service.';
      }
    }
  }

  // ========================================================================
  // Form Event Handlers
  // ========================================================================

  cropForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateCropForm()) {
      return;
    }

    const payload = {
      nitrogen: parseFloat(fields.n.el.value),
      phosphorus: parseFloat(fields.p.el.value),
      potassium: parseFloat(fields.k.el.value),
      temperature: parseFloat(fields.temp.el.value),
      humidity: parseFloat(fields.humidity.el.value),
      ph: parseFloat(fields.ph.el.value),
      rainfall: parseFloat(fields.rain.el.value)
    };

    submitPredictionToAPI(payload);
  });

  // Retry from Error card
  if (btnRetryCropApi) {
    btnRetryCropApi.addEventListener('click', () => {
      cropForm.dispatchEvent(new Event('submit'));
    });
  }

  // Dismiss Error card
  if (btnDismissCropError) {
    btnDismissCropError.addEventListener('click', () => {
      cropFeedbackContainer.classList.remove('active');
      cropErrorState.style.display = 'none';
      fields.n.el.focus();
    });
  }

  // ========================================================================
  // Quick Sample Test Data Loader (For College Demo)
  // ========================================================================

  if (btnLoadCropSample) {
    btnLoadCropSample.addEventListener('click', () => {
      // Standard rice/maize trial sample
      fields.n.el.value = '90';
      fields.p.el.value = '42';
      fields.k.el.value = '43';
      fields.ph.el.value = '6.5';
      fields.temp.el.value = '20.8';
      fields.humidity.el.value = '82';
      fields.rain.el.value = '202';

      Object.keys(fields).forEach(key => clearFieldError(fields[key].el));
      cropFeedbackContainer.classList.remove('active');
      cropResultState.style.display = 'none';
      cropErrorState.style.display = 'none';
    });
  }

  // ========================================================================
  // Reset / Modify Parameters
  // ========================================================================

  function resetCropForm() {
    cropForm.reset();
    Object.keys(fields).forEach(key => clearFieldError(fields[key].el));
    cropFeedbackContainer.classList.remove('active');
    cropLoadingState.style.display = 'none';
    cropResultState.style.display = 'none';
    cropErrorState.style.display = 'none';
  }

  if (btnResetCrop) {
    btnResetCrop.addEventListener('click', resetCropForm);
  }

  if (btnEditCropParams) {
    btnEditCropParams.addEventListener('click', () => {
      cropFeedbackContainer.classList.remove('active');
      cropResultState.style.display = 'none';
      fields.n.el.focus();
    });
  }
});
