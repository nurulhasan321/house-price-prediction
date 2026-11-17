
import pickle
import pandas as pd
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dtos import HousePriceRequest

app = FastAPI(title="Indian House Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
with open("model.pkl", 'rb') as f:
    model = pickle.load(f)
# Load the trained ML pipeline
# model = joblib.load("model.pkl")


def map_to_house_price_req(data: HousePriceRequest) -> pd.DataFrame:
    return pd.DataFrame([data.model_dump()])


@app.post("/predict")
def predict(req: HousePriceRequest):
    new_data = map_to_house_price_req(req)

    prediction = model.predict(new_data)[0]

    return {
        "predicted_price_in_lakhs":f"{float(prediction):.2f}"
    }


@app.get("/")
def root():
    return {
        "message": "Indian House Price Prediction API is running"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
