import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print('Generating synthetic Kaggle-like Crop Recommendation dataset...')

# Synthetic data generation (similar to Kaggle dataset)
np.random.seed(42)
n_samples = 2200

# Features: N, P, K, temperature, humidity, ph, rainfall
# We will simulate the user's requirement: '4 year ago weather data make average of this'
# For the training dataset, we assume the temp, humidity, and rainfall are already the 'averages'

crops = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 
         'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 
         'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 
         'coconut', 'cotton', 'jute', 'coffee']

data = {
    'N': np.random.randint(0, 140, n_samples),
    'P': np.random.randint(5, 145, n_samples),
    'K': np.random.randint(5, 205, n_samples),
    'temperature_4yr_avg': np.random.uniform(10.0, 36.0, n_samples),
    'humidity_4yr_avg': np.random.uniform(20.0, 99.0, n_samples),
    'ph': np.random.uniform(4.5, 9.0, n_samples),
    'rainfall_4yr_avg': np.random.uniform(20.0, 298.0, n_samples),
    'label': np.random.choice(crops, n_samples)
}

df = pd.DataFrame(data)

# Make the synthetic data slightly more realistic (correlation)
df.loc[df['label'] == 'rice', 'rainfall_4yr_avg'] = np.random.uniform(200, 298, sum(df['label'] == 'rice'))
df.loc[df['label'] == 'cotton', 'temperature_4yr_avg'] = np.random.uniform(22, 30, sum(df['label'] == 'cotton'))

# Add N, P, K correlations so the model doesn't ignore them
df.loc[df['label'] == 'apple', 'ph'] = np.random.uniform(5.5, 6.5, sum(df['label'] == 'apple'))
df.loc[df['label'] == 'apple', 'N'] = np.random.randint(0, 40, sum(df['label'] == 'apple'))

df.loc[df['label'] == 'rice', 'N'] = np.random.randint(60, 100, sum(df['label'] == 'rice'))
df.loc[df['label'] == 'rice', 'P'] = np.random.randint(35, 60, sum(df['label'] == 'rice'))

df.loc[df['label'] == 'chickpea', 'N'] = np.random.randint(20, 60, sum(df['label'] == 'chickpea'))
df.loc[df['label'] == 'chickpea', 'P'] = np.random.randint(55, 80, sum(df['label'] == 'chickpea'))

df.loc[df['label'] == 'grapes', 'K'] = np.random.randint(195, 205, sum(df['label'] == 'grapes'))
df.loc[df['label'] == 'grapes', 'N'] = np.random.randint(0, 40, sum(df['label'] == 'grapes'))

# A generic rule: if N > 100, push towards maize
df.loc[df['N'] > 110, 'label'] = 'maize'
# If K > 190, push towards grapes
df.loc[df['K'] > 190, 'label'] = 'grapes'
# If P > 100, push towards apple
df.loc[df['P'] > 120, 'label'] = 'apple'

print('Preprocessing data...')
X = df.drop('label', axis=1)
y = df['label']

le = LabelEncoder()
y_encoded = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

print('Training XGBoost Model...')
model = xgb.XGBClassifier(n_estimators=100, random_state=42, eval_metric='mlogloss')
model.fit(X_train, y_train)

# Save the model and label encoder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
save_dir = os.path.join(BASE_DIR, 'saved_models')
os.makedirs(save_dir, exist_ok=True)
joblib.dump(model, os.path.join(save_dir, 'xgboost_crop_model.joblib'))
joblib.dump(le, os.path.join(save_dir, 'label_encoder.joblib'))

print(f'Model trained and saved to {save_dir}/xgboost_crop_model.joblib !')
