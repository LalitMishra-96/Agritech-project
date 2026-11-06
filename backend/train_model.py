"""
AgriSmart AI — Machine Learning Training Pipeline
Model: Random Forest Classifier for Crop Recommendation
Dataset: Crop Recommendation Dataset (2,200 samples, 22 crops)
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def train():
    # 1. Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'data', 'crop_recommendation.csv')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_save_path = os.path.join(models_dir, 'crop_model.pkl')
    metadata_save_path = os.path.join(models_dir, 'model_metadata.json')

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape}")

    # 2. Features and target
    feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    target_col = 'label'

    X = df[feature_cols]
    y = df[target_col]

    print(f"Features: {feature_cols}")
    print(f"Number of classes: {y.nunique()}")

    # 3. Train-Test Split (80% train, 20% test, stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}")

    # 4. Train Random Forest Classifier
    print("Training Random Forest Classifier (n_estimators=100, random_state=42)...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # 5. Evaluate on held-out test data
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=False)
    report_dict = classification_report(y_test, y_pred, output_dict=True)

    print("\n" + "="*60)
    print("MODEL EVALUATION RESULTS")
    print("="*60)
    print(f"Accuracy Score: {accuracy * 100:.2f}%\n")
    print("Classification Report:")
    print(report)

    # 6. Save model artifact
    joblib.dump(model, model_save_path)
    print(f"Saved trained model artifact to: {model_save_path}")

    # 7. Save metadata
    metadata = {
        "model_type": "RandomForestClassifier",
        "n_estimators": 100,
        "feature_names": feature_cols,
        "classes": sorted(model.classes_.tolist()),
        "test_accuracy": float(accuracy),
        "total_samples": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "macro_avg_f1": float(report_dict['macro avg']['f1-score']),
        "weighted_avg_f1": float(report_dict['weighted avg']['f1-score'])
    }

    with open(metadata_save_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {metadata_save_path}")
    print("="*60)
    print("Training pipeline successfully completed.")

if __name__ == '__main__':
    train()
