# Krishinova ML Backend

This is the Python FastAPI backend for Krishinova, featuring:
1. **Crop Prediction**: Uses an XGBoost model trained on soil nutrients and 4-year historical weather averages.
2. **Inter-Crop Prediction**: Recommends companion crops based on the predicted primary crop.
3. **Water Requirement Prediction**: Calculates required irrigation water by comparing Evapotranspiration estimations with current tank storage levels.

## Setup Instructions

1. **Navigate to the backend folder**:
   `ash
   cd backend
   `

2. **Create a virtual environment (Recommended)**:
   `ash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   `

3. **Install Dependencies**:
   `ash
   pip install -r requirements.txt
   `

4. **Train the XGBoost Model**:
   `ash
   python train_crop_model.py
   `
   *Note: This script generates a synthetic Kaggle-like dataset, processes the simulated 4-year weather averages, trains the model, and saves it in saved_models/.*

5. **Run the Server**:
   `ash
   uvicorn main:app --reload
   `

6. **Test the API**:
   Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to see the interactive Swagger UI and test the /predict/crop and /predict/water endpoints.
