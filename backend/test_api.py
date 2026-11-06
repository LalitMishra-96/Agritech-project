"""
AgriSmart AI — Automated End-to-End Test Suite
Tests ML inference, boundary validation, and all REST endpoints.
"""

import sys
import json
from app import app

def run_tests():
    print("=" * 65)
    print("  AGRISMART AI — AUTOMATED TEST SUITE EXECUTION")
    print("=" * 65)

    client = app.test_client()
    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"[PASS] {name} {details}")
        else:
            print(f"[FAIL] {name} {details}")

    # TEST 1: Health Endpoint
    res = client.get('/api/health')
    assert_test("GET /api/health returns 200", res.status_code == 200)
    data = res.get_json()
    assert_test("Health confirms model_loaded == True", data.get('model_loaded') is True)
    assert_test("Health reports accuracy > 99%", data.get('model_accuracy', 0) > 0.99)

    # TEST 2: Model Info
    res = client.get('/api/model-info')
    assert_test("GET /api/model-info returns 200", res.status_code == 200)
    meta = res.get_json().get('metadata', {})
    assert_test("Model Info has 22 classes", len(meta.get('classes', [])) == 22)

    # TEST 3: Genuine ML Prediction (Rice)
    res = client.post('/api/predict-crop', json={
        'nitrogen': 90, 'phosphorus': 42, 'potassium': 43,
        'temperature': 20.8, 'humidity': 82.0, 'ph': 6.5, 'rainfall': 202.0
    })
    assert_test("POST /api/predict-crop (Rice Profile) returns 200", res.status_code == 200)
    crop = res.get_json()['prediction']
    assert_test("Model accurately predicts 'rice'", crop['crop'] == 'rice', f"(got {crop['crop']}, conf: {crop['confidenceScore']}%)")

    # TEST 4: Genuine ML Prediction (Mango)
    res = client.post('/api/predict-crop', json={
        'nitrogen': 20, 'phosphorus': 27, 'potassium': 30,
        'temperature': 31.2, 'humidity': 50.1, 'ph': 5.8, 'rainfall': 94.7
    })
    assert_test("POST /api/predict-crop (Mango Profile) returns 200", res.status_code == 200)
    crop = res.get_json()['prediction']
    assert_test("Model accurately predicts 'mango'", crop['crop'] == 'mango', f"(got {crop['crop']}, conf: {crop['confidenceScore']}%)")

    # TEST 5: Genuine ML Prediction (Coconut)
    res = client.post('/api/predict-crop', json={
        'nitrogen': 22, 'phosphorus': 17, 'potassium': 31,
        'temperature': 27.4, 'humidity': 94.8, 'ph': 6.0, 'rainfall': 175.7
    })
    assert_test("POST /api/predict-crop (Coconut Profile) returns 200", res.status_code == 200)
    crop = res.get_json()['prediction']
    assert_test("Model accurately predicts 'coconut'", crop['crop'] == 'coconut', f"(got {crop['crop']}, conf: {crop['confidenceScore']}%)")

    # TEST 6: Genuine ML Prediction (Chickpea)
    res = client.post('/api/predict-crop', json={
        'nitrogen': 40, 'phosphorus': 68, 'potassium': 79,
        'temperature': 18.8, 'humidity': 16.8, 'ph': 7.3, 'rainfall': 80.2
    })
    assert_test("POST /api/predict-crop (Chickpea Profile) returns 200", res.status_code == 200)
    crop = res.get_json()['prediction']
    assert_test("Model accurately predicts 'chickpea'", crop['crop'] == 'chickpea', f"(got {crop['crop']}, conf: {crop['confidenceScore']}%)")

    # TEST 7: Input Validation - Missing Fields
    res = client.post('/api/predict-crop', json={'nitrogen': 50})
    assert_test("Reject missing parameters with HTTP 400", res.status_code == 400)
    err = res.get_json()
    assert_test("Error code is MISSING_FIELDS", err.get('error_code') == 'MISSING_FIELDS')

    # TEST 8: Input Validation - Out-of-range Values (pH = 25, Temp = 120)
    res = client.post('/api/predict-crop', json={
        'nitrogen': 50, 'phosphorus': 50, 'potassium': 50,
        'temperature': 120, 'humidity': 50, 'ph': 25, 'rainfall': 50
    })
    assert_test("Reject out-of-range values with HTTP 400", res.status_code == 400)
    err = res.get_json()
    assert_test("Error code is INVALID_PARAMETERS", err.get('error_code') == 'INVALID_PARAMETERS')

    # TEST 9: Smart Irrigation Advisor Engine
    res = client.post('/api/irrigation-advisor', json={
        'crop': 'wheat', 'moisture': 35, 'temperature': 30, 'humidity': 40, 'rainfall': 0
    })
    assert_test("POST /api/irrigation-advisor returns 200", res.status_code == 200)
    irrig = res.get_json()
    assert_test("Irrigation correctly identifies 'Urgent Irrigation Required'", irrig.get('urgency') == 'Urgent Irrigation Required')
    assert_test("Net water calculation > 0 mm", irrig['metrics']['netWaterRequiredMm'] > 0)

    # TEST 10: Fertilizer Guidance Engine
    res = client.post('/api/fertilizer-guidance', json={
        'crop': 'wheat', 'n': 50, 'p': 20, 'k': 25, 'ph': 5.8
    })
    assert_test("POST /api/fertilizer-guidance returns 200", res.status_code == 200)
    fert = res.get_json()
    assert_test("Fertilizer prescribes Urea and DAP", 'urea' in fert['fertilizerRecommendations'] and 'dap' in fert['fertilizerRecommendations'])
    assert_test("Detects acidic pH and recommends lime", "Acidic" in fert['soilReaction']['status'])

    print("=" * 65)
    print(f"TEST SUMMARY: {passed} / {total} tests PASSED ({passed/total*100:.1f}%)")
    print("=" * 65)

    if passed == total:
        print("[SUCCESS] All system validation tests completed successfully.")
        return 0
    else:
        print("[FAILURE] Some tests failed.")
        return 1

if __name__ == '__main__':
    sys.exit(run_tests())
