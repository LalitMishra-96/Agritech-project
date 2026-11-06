/**
 * AgriSmart AI — Fertilizer Guidance Controller
 *
 * Implements real ICAR Nutrient-Gap Calculation Model.
 * Connects to: POST http://127.0.0.1:5000/api/fertilizer-guidance (with automatic local fallback)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const API_URL = 'http://127.0.0.1:5000/api/fertilizer-guidance';

  // --- Element Selectors ---
  const fertilizerForm = document.getElementById('fertilizerForm');
  const btnCalculateFertilizer = document.getElementById('btnCalculateFertilizer');
  const btnLoadFertSample = document.getElementById('btnLoadFertSample');
  const btnResetFert = document.getElementById('btnResetFert');

  // Containers
  const fertilizerFeedbackContainer = document.getElementById('fertilizerFeedbackContainer');
  const fertilizerLoadingState = document.getElementById('fertilizerLoadingState');
  const fertilizerResultState = document.getElementById('fertilizerResultState');
  const fertilizerErrorState = document.getElementById('fertilizerErrorState');
  const fertilizerErrorMessage = document.getElementById('fertilizerErrorMessage');
  const btnEditFertParams = document.getElementById('btnEditFertParams');
  const btnDismissFertError = document.getElementById('btnDismissFertError');

  // Inputs
  const cropSelect = document.getElementById('fertCrop');
  const nInput = document.getElementById('fertN');
  const pInput = document.getElementById('fertP');
  const kInput = document.getElementById('fertK');
  const phInput = document.getElementById('fertPh');

  // Output Elements
  const resultFertUrea = document.getElementById('resultFertUrea');
  const resultFertUreaBags = document.getElementById('resultFertUreaBags');
  const resultFertDap = document.getElementById('resultFertDap');
  const resultFertDapBags = document.getElementById('resultFertDapBags');
  const resultFertMop = document.getElementById('resultFertMop');
  const resultFertMopBags = document.getElementById('resultFertMopBags');
  const resultFertPhStatus = document.getElementById('resultFertPhStatus');
  const resultFertPhAdvisory = document.getElementById('resultFertPhAdvisory');
  const resultFertScheduleBody = document.getElementById('resultFertScheduleBody');

  if (!fertilizerForm) return;

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

  function validateFertilizerForm() {
    let isValid = true;
    let firstInvalidField = null;

    if (!cropSelect.value || cropSelect.value === '') {
      setFieldError(cropSelect, 'Please select the target crop.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = cropSelect;
    } else {
      clearFieldError(cropSelect);
    }

    const nVal = nInput.value.trim();
    if (nVal === '') {
      setFieldError(nInput, 'Please enter available Nitrogen value.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = nInput;
    } else {
      const num = parseFloat(nVal);
      if (isNaN(num) || num < 0 || num > 300) {
        setFieldError(nInput, 'Nitrogen must be between 0 and 300 mg/kg.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = nInput;
      } else {
        clearFieldError(nInput);
      }
    }

    const pVal = pInput.value.trim();
    if (pVal === '') {
      setFieldError(pInput, 'Please enter available Phosphorus value.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = pInput;
    } else {
      const num = parseFloat(pVal);
      if (isNaN(num) || num < 0 || num > 200) {
        setFieldError(pInput, 'Phosphorus must be between 0 and 200 mg/kg.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = pInput;
      } else {
        clearFieldError(pInput);
      }
    }

    const kVal = kInput.value.trim();
    if (kVal === '') {
      setFieldError(kInput, 'Please enter available Potassium value.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = kInput;
    } else {
      const num = parseFloat(kVal);
      if (isNaN(num) || num < 0 || num > 300) {
        setFieldError(kInput, 'Potassium must be between 0 and 300 mg/kg.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = kInput;
      } else {
        clearFieldError(kInput);
      }
    }

    const phVal = phInput.value.trim();
    if (phVal === '') {
      setFieldError(phInput, 'Please enter soil pH level (0–14).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phInput;
    } else {
      const num = parseFloat(phVal);
      if (isNaN(num) || num < 0 || num > 14) {
        setFieldError(phInput, 'Soil pH must be between 0 and 14.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = phInput;
      } else {
        clearFieldError(phInput);
      }
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  [cropSelect, nInput, pInput, kInput, phInput].forEach(el => {
    if (el) {
      el.addEventListener('input', () => clearFieldError(el));
      el.addEventListener('change', () => clearFieldError(el));
    }
  });

  // ========================================================================
  // Local Rule Engine Fallback (ICAR Baselines)
  // ========================================================================

  const FERT_BASELINES = {
    wheat: { name: 'Wheat (Triticum aestivum)', n: 120, p: 60, k: 40 },
    rice: { name: 'Rice / Paddy (Oryza sativa)', n: 100, p: 50, k: 50 },
    maize: { name: 'Maize / Corn (Zea mays)', n: 120, p: 60, k: 50 },
    cotton: { name: 'Cotton (Gossypium hirsutum)', n: 100, p: 50, k: 50 },
    sugarcane: { name: 'Sugarcane (Saccharum officinarum)', n: 180, p: 70, k: 80 },
    tomato: { name: 'Tomato (Solanum lycopersicum)', n: 110, p: 70, k: 90 },
    potato: { name: 'Potato (Solanum tuberosum)', n: 120, p: 80, k: 100 },
    groundnut: { name: 'Groundnut / Peanut (Arachis hypogaea)', n: 25, p: 50, k: 75 },
    mustard: { name: 'Mustard (Brassica juncea)', n: 80, p: 40, k: 40 },
    chickpea: { name: 'Chickpea / Gram (Cicer arietinum)', n: 20, p: 40, k: 30 }
  };

  function computeLocalFertilizer(payload) {
    const cropKey = payload.cropKey || 'wheat';
    const base = FERT_BASELINES[cropKey] || FERT_BASELINES.wheat;

    const gapN = Math.max(0, parseFloat((base.n - payload.n).toFixed(1)));
    const gapP = Math.max(0, parseFloat((base.p - payload.p).toFixed(1)));
    const gapK = Math.max(0, parseFloat((base.k - payload.k).toFixed(1)));

    const dapKg = gapP > 0 ? parseFloat((gapP / 0.46).toFixed(1)) : 0.0;
    const nFromDap = parseFloat((dapKg * 0.18).toFixed(1));
    const remainingN = Math.max(0, gapN - nFromDap);
    const ureaKg = remainingN > 0 ? parseFloat((remainingN / 0.46).toFixed(1)) : 0.0;
    const mopKg = gapK > 0 ? parseFloat((gapK / 0.60).toFixed(1)) : 0.0;

    let phStatus = 'Optimal / Neutral Soil (pH 6.0–7.8)';
    let phAdvisory = 'Soil reaction is well-balanced. Maximum nutrient bioavailability achieved without chemical amendments.';
    if (payload.ph < 6.0) {
      phStatus = 'Acidic Soil (pH < 6.0)';
      phAdvisory = 'Soil acidity inhibits phosphorus availability. Apply agricultural lime (CaCO3) @ 250–400 kg/ha before sowing.';
    } else if (payload.ph > 8.0) {
      phStatus = 'Alkaline / Calcareous Soil (pH > 8.0)';
      phAdvisory = 'High alkalinity fixes zinc and phosphorus. Apply agricultural gypsum @ 300 kg/ha or enriched farmyard manure (FYM).';
    }

    const schedule = [
      {
        stage: 'Basal Dose (At Sowing / Field Prep)',
        urea: `${(ureaKg * 0.33).toFixed(1)} kg/ha (1/3rd)`,
        dap: `${dapKg} kg/ha (100% full dose)`,
        mop: `${mopKg} kg/ha (100% full dose)`,
        purpose: 'Promotes root architecture establishment and vigorous early tillering.'
      },
      {
        stage: 'First Top Dressing (Vegetative / Tillering Stage)',
        urea: `${(ureaKg * 0.33).toFixed(1)} kg/ha (1/3rd)`,
        dap: '0 kg/ha',
        mop: '0 kg/ha',
        purpose: 'Boosts canopy chlorophyll synthesis and vegetative stem elongation.'
      },
      {
        stage: 'Second Top Dressing (Flowering / Boot Stage)',
        urea: `${(ureaKg * 0.34).toFixed(1)} kg/ha (Final dose)`,
        dap: '0 kg/ha',
        mop: '0 kg/ha',
        purpose: 'Sustains flag leaf vitality and grain filling without lodging.'
      }
    ];

    return {
      status: 'success',
      crop: base.name,
      fertilizerRecommendations: {
        urea: `${ureaKg} kg/ha (46% N)`,
        dap: `${dapKg} kg/ha (18-46-0)`,
        mop: `${mopKg} kg/ha (0-0-60 Muriate of Potash)`,
        ureaBags: `${(ureaKg / 45.0).toFixed(1)} bags`,
        dapBags: `${(dapKg / 50.0).toFixed(1)} bags`,
        mopBags: `${(mopKg / 50.0).toFixed(1)} bags`
      },
      soilReaction: {
        status: phStatus,
        advisory: phAdvisory
      },
      applicationSchedule: schedule
    };
  }

  // ========================================================================
  // Render Output
  // ========================================================================

  function renderFertilizerOutput(data, payload) {
    const fert = data.fertilizerRecommendations;
    if (resultFertUrea) resultFertUrea.textContent = fert.urea;
    if (resultFertUreaBags) resultFertUreaBags.textContent = `${fert.ureaBags} (45kg)`;
    if (resultFertDap) resultFertDap.textContent = fert.dap;
    if (resultFertDapBags) resultFertDapBags.textContent = `${fert.dapBags} (50kg)`;
    if (resultFertMop) resultFertMop.textContent = fert.mop;
    if (resultFertMopBags) resultFertMopBags.textContent = `${fert.mopBags} (50kg)`;

    if (resultFertPhStatus) resultFertPhStatus.textContent = data.soilReaction.status;
    if (resultFertPhAdvisory) resultFertPhAdvisory.textContent = data.soilReaction.advisory;

    if (resultFertScheduleBody && data.applicationSchedule) {
      resultFertScheduleBody.innerHTML = '';
      data.applicationSchedule.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${row.stage}</strong></td>
          <td>${row.urea}</td>
          <td>${row.dap}</td>
          <td>${row.mop}</td>
          <td><span style="font-size: 11px; color: var(--color-text-secondary);">${row.purpose}</span></td>
        `;
        resultFertScheduleBody.appendChild(tr);
      });
    }

    // Recap
    document.getElementById('recapFertCrop').textContent = payload.cropName;
    document.getElementById('recapFertN').textContent = `${payload.n} mg/kg`;
    document.getElementById('recapFertP').textContent = `${payload.p} mg/kg`;
    document.getElementById('recapFertK').textContent = `${payload.k} mg/kg`;
    document.getElementById('recapFertPh').textContent = `${payload.ph} pH`;

    fertilizerLoadingState.style.display = 'none';
    fertilizerErrorState.style.display = 'none';
    fertilizerResultState.style.display = 'block';
  }

  // ========================================================================
  // Form Submission
  // ========================================================================

  fertilizerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateFertilizerForm()) return;

    const payload = {
      crop: cropSelect.value,
      cropKey: cropSelect.value,
      cropName: cropSelect.options[cropSelect.selectedIndex].text,
      n: parseFloat(nInput.value),
      p: parseFloat(pInput.value),
      k: parseFloat(kInput.value),
      ph: parseFloat(phInput.value)
    };

    btnCalculateFertilizer.disabled = true;
    const btnText = btnCalculateFertilizer.querySelector('.btn-label');
    const btnSpinner = btnCalculateFertilizer.querySelector('.spinner');
    if (btnText) btnText.textContent = 'Analyzing Nutrient Needs...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    fertilizerFeedbackContainer.classList.add('active');
    fertilizerLoadingState.style.display = 'flex';
    fertilizerResultState.style.display = 'none';
    fertilizerErrorState.style.display = 'none';

    fertilizerFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        renderFertilizerOutput(data, payload);
      } else {
        const localData = computeLocalFertilizer(payload);
        renderFertilizerOutput(localData, payload);
      }
    } catch (err) {
      const localData = computeLocalFertilizer(payload);
      renderFertilizerOutput(localData, payload);
    } finally {
      btnCalculateFertilizer.disabled = false;
      if (btnText) btnText.textContent = 'Analyze Fertilizer Needs';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  });

  // Sample data loader
  if (btnLoadFertSample) {
    btnLoadFertSample.addEventListener('click', () => {
      cropSelect.value = 'wheat';
      nInput.value = '60';
      pInput.value = '25';
      kInput.value = '20';
      phInput.value = '6.4';

      [cropSelect, nInput, pInput, kInput, phInput].forEach(el => clearFieldError(el));
      fertilizerFeedbackContainer.classList.remove('active');
      fertilizerResultState.style.display = 'none';
    });
  }

  function resetFertilizerForm() {
    fertilizerForm.reset();
    [cropSelect, nInput, pInput, kInput, phInput].forEach(el => clearFieldError(el));
    fertilizerFeedbackContainer.classList.remove('active');
    fertilizerLoadingState.style.display = 'none';
    fertilizerResultState.style.display = 'none';
    fertilizerErrorState.style.display = 'none';
  }

  if (btnResetFert) btnResetFert.addEventListener('click', resetFertilizerForm);
  if (btnEditFertParams) {
    btnEditFertParams.addEventListener('click', () => {
      fertilizerFeedbackContainer.classList.remove('active');
      fertilizerResultState.style.display = 'none';
      nInput.focus();
    });
  }
  if (btnDismissFertError) {
    btnDismissFertError.addEventListener('click', () => {
      fertilizerFeedbackContainer.classList.remove('active');
      fertilizerErrorState.style.display = 'none';
      nInput.focus();
    });
  }
});
