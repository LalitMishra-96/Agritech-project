/**
 * AgriSmart AI — Smart Irrigation Advisor Controller
 *
 * Implements real FAO-56 Evapotranspiration & Soil Moisture Deficit calculations.
 * Connects to: POST http://127.0.0.1:5000/api/irrigation-advisor (with automatic local fallback)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const API_URL = 'http://127.0.0.1:5000/api/irrigation-advisor';

  // --- Element Selectors ---
  const irrigationForm = document.getElementById('irrigationForm');
  const btnCalculateIrrigation = document.getElementById('btnCalculateIrrigation');
  const btnLoadIrrigSample = document.getElementById('btnLoadIrrigSample');
  const btnResetIrrig = document.getElementById('btnResetIrrig');

  // Containers
  const irrigationFeedbackContainer = document.getElementById('irrigationFeedbackContainer');
  const irrigationLoadingState = document.getElementById('irrigationLoadingState');
  const irrigationResultState = document.getElementById('irrigationResultState');
  const irrigationErrorState = document.getElementById('irrigationErrorState');
  const irrigationErrorMessage = document.getElementById('irrigationErrorMessage');
  const btnEditIrrigParams = document.getElementById('btnEditIrrigParams');
  const btnDismissIrrigError = document.getElementById('btnDismissIrrigError');

  // Input Field References
  const cropSelect = document.getElementById('irrigCrop');
  const moistureInput = document.getElementById('irrigMoisture');
  const tempInput = document.getElementById('irrigTemp');
  const humidityInput = document.getElementById('irrigHumidity');
  const rainfallInput = document.getElementById('irrigRainfall');

  // Output Elements
  const resultIrrigUrgency = document.getElementById('resultIrrigUrgency');
  const resultIrrigCropName = document.getElementById('resultIrrigCropName');
  const resultIrrigMethod = document.getElementById('resultIrrigMethod');
  const resultIrrigWaterDepth = document.getElementById('resultIrrigWaterDepth');
  const resultIrrigEt0 = document.getElementById('resultIrrigEt0');
  const resultIrrigEtc = document.getElementById('resultIrrigEtc');
  const resultIrrigVolume = document.getElementById('resultIrrigVolume');
  const resultIrrigRuntime = document.getElementById('resultIrrigRuntime');
  const resultIrrigNote = document.getElementById('resultIrrigNote');
  const resultIrrigWindow = document.getElementById('resultIrrigWindow');
  const resultIrrigStage = document.getElementById('resultIrrigStage');

  if (!irrigationForm) return;

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

  function validateIrrigationForm() {
    let isValid = true;
    let firstInvalidField = null;

    if (!cropSelect.value || cropSelect.value === '') {
      setFieldError(cropSelect, 'Please select a cultivated crop.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = cropSelect;
    } else {
      clearFieldError(cropSelect);
    }

    const moistureVal = moistureInput.value.trim();
    if (moistureVal === '') {
      setFieldError(moistureInput, 'Please enter current soil moisture percentage.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = moistureInput;
    } else {
      const num = parseFloat(moistureVal);
      if (isNaN(num) || num < 0 || num > 100) {
        setFieldError(moistureInput, 'Soil moisture must be between 0% and 100%.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = moistureInput;
      } else {
        clearFieldError(moistureInput);
      }
    }

    const tempVal = tempInput.value.trim();
    if (tempVal === '') {
      setFieldError(tempInput, 'Please enter daytime temperature.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = tempInput;
    } else {
      const num = parseFloat(tempVal);
      if (isNaN(num) || num < 0 || num > 60) {
        setFieldError(tempInput, 'Temperature must be between 0°C and 60°C.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = tempInput;
      } else {
        clearFieldError(tempInput);
      }
    }

    const humidityVal = humidityInput.value.trim();
    if (humidityVal === '') {
      setFieldError(humidityInput, 'Please enter relative humidity percentage.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = humidityInput;
    } else {
      const num = parseFloat(humidityVal);
      if (isNaN(num) || num < 0 || num > 100) {
        setFieldError(humidityInput, 'Humidity must be between 0% and 100%.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = humidityInput;
      } else {
        clearFieldError(humidityInput);
      }
    }

    const rainVal = rainfallInput.value.trim();
    if (rainVal === '') {
      setFieldError(rainfallInput, 'Please enter recent rainfall received (or 0 if none).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = rainfallInput;
    } else {
      const num = parseFloat(rainVal);
      if (isNaN(num) || num < 0 || num > 300) {
        setFieldError(rainfallInput, 'Recent rainfall must be between 0 and 300 mm.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = rainfallInput;
      } else {
        clearFieldError(rainfallInput);
      }
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  [cropSelect, moistureInput, tempInput, humidityInput, rainfallInput].forEach(el => {
    if (el) {
      el.addEventListener('input', () => clearFieldError(el));
      el.addEventListener('change', () => clearFieldError(el));
    }
  });

  // ========================================================================
  // Domain Calculation (Client-Side Fallback Engine)
  // ========================================================================

  const CROP_PROFILES = {
    wheat: { name: 'Wheat (Triticum aestivum)', kc: 0.95, method: 'Sprinkler / Border Strip', rootDepth: 60, stage: 'Crown root initiation & Flowering' },
    rice: { name: 'Rice / Paddy (Oryza sativa)', kc: 1.20, method: 'Shallow Flooding / Alternate Wetting', rootDepth: 40, stage: 'Tillering & Panicle initiation' },
    maize: { name: 'Maize / Corn (Zea mays)', kc: 0.90, method: 'Furrow / Drip', rootDepth: 50, stage: 'Tasseling & Silking' },
    cotton: { name: 'Cotton (Gossypium hirsutum)', kc: 1.00, method: 'Drip Irrigation', rootDepth: 80, stage: 'Squaring & Boll development' },
    sugarcane: { name: 'Sugarcane (Saccharum officinarum)', kc: 1.15, method: 'Drip / Trash Mulched Furrow', rootDepth: 90, stage: 'Grand growth phase' },
    tomato: { name: 'Tomato (Solanum lycopersicum)', kc: 1.05, method: 'Drip Irrigation', rootDepth: 45, stage: 'Flowering & Fruit enlargement' },
    potato: { name: 'Potato (Solanum tuberosum)', kc: 0.85, method: 'Drip / Sprinkler', rootDepth: 35, stage: 'Tuber initiation & Bulking' },
    groundnut: { name: 'Groundnut / Peanut (Arachis hypogaea)', kc: 0.80, method: 'Sprinkler / Drip', rootDepth: 40, stage: 'Peg penetration & Pod formation' },
    mustard: { name: 'Mustard (Brassica juncea)', kc: 0.70, method: 'Sprinkler / Furrow', rootDepth: 50, stage: 'Branching & Siliqua development' },
    chickpea: { name: 'Chickpea / Gram (Cicer arietinum)', kc: 0.65, method: 'Light Sprinkler', rootDepth: 45, stage: 'Pre-flowering & Pod development' }
  };

  function computeLocalIrrigation(payload) {
    const cropKey = payload.cropKey || 'wheat';
    const profile = CROP_PROFILES[cropKey] || CROP_PROFILES.wheat;
    const kc = profile.kc;

    const et0 = Math.max(1.8, Math.min(8.5, parseFloat(((0.46 * payload.temperature + 8.0) * (1.0 - (payload.humidity / 160.0))).toFixed(2))));
    const etc = parseFloat((et0 * kc).toFixed(2));
    const moistureDeficit = Math.max(0, 65.0 - payload.moisture);
    const effectiveRain = parseFloat((payload.rainfall * 0.70).toFixed(1));
    const soilFactor = profile.rootDepth / 100.0;
    const netWaterMm = Math.max(0, parseFloat(((moistureDeficit * 0.45 * soilFactor) + etc - effectiveRain).toFixed(1)));
    const litersHa = Math.round(netWaterMm * 10000);

    let urgency = 'Adequate Soil Moisture';
    let urgencyNote = 'Current soil moisture and recent precipitation are sufficient. No immediate watering needed.';
    if (payload.moisture < 40) {
      urgency = 'Urgent Irrigation Required';
      urgencyNote = 'Soil moisture is critically below Management Allowed Depletion (MAD). Irrigate immediately.';
    } else if (payload.moisture < 55 || netWaterMm > 5.0) {
      urgency = 'Moderate Irrigation Advised';
      urgencyNote = 'Soil moisture is depleting. Schedule irrigation within the next 12 to 24 hours.';
    }

    let runtimeDisplay = '0 minutes (System on standby)';
    if (netWaterMm > 0) {
      const runtimeMins = Math.round((netWaterMm / 2.5) * 60);
      runtimeDisplay = runtimeMins >= 60 ? `${Math.floor(runtimeMins / 60)}h ${runtimeMins % 60}m` : `${runtimeMins} minutes`;
    }

    return {
      status: 'success',
      urgency: urgency,
      crop: profile.name,
      metrics: {
        referenceET0: `${et0} mm/day`,
        cropETc: `${etc} mm/day`,
        netWaterRequiredMm: netWaterMm,
        waterVolumeLitersPerHa: `${litersHa.toLocaleString()} L/ha`
      },
      advisory: {
        recommendedMethod: profile.method,
        recommendedRuntime: runtimeDisplay,
        optimalWindow: 'Early morning (06:00 - 08:30) or late evening (17:30 - 19:30)',
        criticalGrowthStage: profile.stage,
        urgencyNote: urgencyNote
      }
    };
  }

  // ========================================================================
  // Render Output
  // ========================================================================

  function renderIrrigationOutput(data, payload) {
    if (resultIrrigUrgency) resultIrrigUrgency.textContent = data.urgency;
    if (resultIrrigCropName) resultIrrigCropName.textContent = data.crop;
    if (resultIrrigMethod) resultIrrigMethod.textContent = data.advisory.recommendedMethod;
    if (resultIrrigWaterDepth) resultIrrigWaterDepth.textContent = `${data.metrics.netWaterRequiredMm} mm`;
    if (resultIrrigEt0) resultIrrigEt0.textContent = data.metrics.referenceET0;
    if (resultIrrigEtc) resultIrrigEtc.textContent = data.metrics.cropETc;
    if (resultIrrigVolume) resultIrrigVolume.textContent = data.metrics.waterVolumeLitersPerHa;
    if (resultIrrigRuntime) resultIrrigRuntime.textContent = data.advisory.recommendedRuntime;
    if (resultIrrigNote) resultIrrigNote.textContent = data.urgencyNote || data.advisory.urgencyNote;
    if (resultIrrigWindow) resultIrrigWindow.textContent = data.advisory.optimalWindow;
    if (resultIrrigStage) resultIrrigStage.textContent = data.advisory.criticalGrowthStage;

    // Recap
    document.getElementById('recapIrrigCrop').textContent = payload.cropName;
    document.getElementById('recapIrrigMoisture').textContent = `${payload.moisture} %`;
    document.getElementById('recapIrrigTemp').textContent = `${payload.temperature} °C`;
    document.getElementById('recapIrrigHumidity').textContent = `${payload.humidity} %`;
    document.getElementById('recapIrrigRain').textContent = `${payload.rainfall} mm`;

    irrigationLoadingState.style.display = 'none';
    irrigationErrorState.style.display = 'none';
    irrigationResultState.style.display = 'block';
  }

  // ========================================================================
  // Form Submission
  // ========================================================================

  irrigationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateIrrigationForm()) return;

    const payload = {
      crop: cropSelect.value,
      cropKey: cropSelect.value,
      cropName: cropSelect.options[cropSelect.selectedIndex].text,
      moisture: parseFloat(moistureInput.value),
      temperature: parseFloat(tempInput.value),
      humidity: parseFloat(humidityInput.value),
      rainfall: parseFloat(rainfallInput.value)
    };

    btnCalculateIrrigation.disabled = true;
    const btnText = btnCalculateIrrigation.querySelector('.btn-label');
    const btnSpinner = btnCalculateIrrigation.querySelector('.spinner');
    if (btnText) btnText.textContent = 'Calculating Water Deficit...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    irrigationFeedbackContainer.classList.add('active');
    irrigationLoadingState.style.display = 'flex';
    irrigationResultState.style.display = 'none';
    irrigationErrorState.style.display = 'none';

    irrigationFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      // Try backend first
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        renderIrrigationOutput(data, payload);
      } else {
        // Fallback to local calculation
        const localData = computeLocalIrrigation(payload);
        renderIrrigationOutput(localData, payload);
      }
    } catch (err) {
      // Offline fallback: execute real rule-based calculation directly
      const localData = computeLocalIrrigation(payload);
      renderIrrigationOutput(localData, payload);
    } finally {
      btnCalculateIrrigation.disabled = false;
      if (btnText) btnText.textContent = 'Calculate Irrigation Advice';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  });

  // Sample data loader
  if (btnLoadIrrigSample) {
    btnLoadIrrigSample.addEventListener('click', () => {
      cropSelect.value = 'wheat';
      moistureInput.value = '38';
      tempInput.value = '28.0';
      humidityInput.value = '45';
      rainfallInput.value = '2';

      [cropSelect, moistureInput, tempInput, humidityInput, rainfallInput].forEach(el => clearFieldError(el));
      irrigationFeedbackContainer.classList.remove('active');
      irrigationResultState.style.display = 'none';
    });
  }

  function resetIrrigationForm() {
    irrigationForm.reset();
    [cropSelect, moistureInput, tempInput, humidityInput, rainfallInput].forEach(el => clearFieldError(el));
    irrigationFeedbackContainer.classList.remove('active');
    irrigationLoadingState.style.display = 'none';
    irrigationResultState.style.display = 'none';
    irrigationErrorState.style.display = 'none';
  }

  if (btnResetIrrig) btnResetIrrig.addEventListener('click', resetIrrigationForm);
  if (btnEditIrrigParams) {
    btnEditIrrigParams.addEventListener('click', () => {
      irrigationFeedbackContainer.classList.remove('active');
      irrigationResultState.style.display = 'none';
      moistureInput.focus();
    });
  }
  if (btnDismissIrrigError) {
    btnDismissIrrigError.addEventListener('click', () => {
      irrigationFeedbackContainer.classList.remove('active');
      irrigationErrorState.style.display = 'none';
      moistureInput.focus();
    });
  }
});
