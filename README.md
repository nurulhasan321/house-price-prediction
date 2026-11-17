# 🏠 Indian House Price Prediction

An end-to-end Machine Learning web application that predicts residential property prices across major Indian cities based on property features, location, amenities, and other relevant factors.

The application uses a trained Scikit-learn regression model with a FastAPI backend and an interactive frontend built using HTML, CSS, Bootstrap, and JavaScript.

## 🚀 Features

- **House Price Prediction:** Estimate property prices in Indian Rupees (Lakhs).
- **Multiple Cities:** Supports Bangalore, Pune, Jaipur, Delhi, Chandigarh, Mumbai, Chennai, Hyderabad, Kolkata, and Ahmedabad.
- **Property Details:** Predict prices based on BHK, bathrooms, property type, and area.
- **Location Analysis:** Considers locality type and distances to metro stations and city centers.
- **Property Amenities:** Includes furnishing status, parking, lift availability, and gated community information.
- **Machine Learning Integration:** Uses a trained Scikit-learn regression model.
- **REST API:** FastAPI handles prediction requests and returns results.
- **Interactive Interface:** Simple and responsive web interface for users.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Programming Language | Python |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Backend | FastAPI |
| Data Validation | Pydantic |
| Model Serialization | Joblib |
| Frontend | HTML, CSS, JavaScript |
| UI Framework | Bootstrap |
| Version Control | Git, GitHub |

## 📊 Prediction Features

The model uses the following property attributes:

| Feature | Description |
|---|---|
| City | Property location |
| Locality_Type | Affordable, Mid-Range, or Premium |
| Property_Type | Apartment, Villa, Builder Floor, or Independent House |
| BHK | Number of bedrooms |
| Bathrooms | Number of bathrooms |
| Super_Area_SqFt | Total property area |
| Carpet_Area_SqFt | Usable carpet area |
| Floor_Number | Property floor |
| Total_Floors | Total building floors |
| Age_of_Property | Property age |
| Furnishing_Status | Furnishing condition |
| Parking | Number of parking spaces |
| Lift_Available | Lift availability |
| Gated_Community | Gated community availability |
| Distance_to_Metro_km | Distance to nearest metro station |
| Distance_to_City_Center_km | Distance to city center |

**Target Variable:** `Price_INR_Lakhs`

## 📁 Project Structure

```text
House-Price-Prediction/
│
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── model.pkl
├── main.py
├── dtos.py
├── requirements.txt
├── .gitignore
├── .gitattributes
└── README.md
```

*Note: The directory structure above is illustrative. Adjust it to match your actual repository.*

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nurulhasan321/house-price-prediction.git
cd house-price-prediction
```

### 2. Download the Machine Learning Model

This project uses Git LFS to store the trained model.

Install Git LFS if it is not already installed:

```bash
brew install git-lfs
git lfs install
```

Download the model:

```bash
git lfs pull
```

### 3. Create a Virtual Environment

```bash
python -m venv .venv
```

Activate it:

**macOS / Linux**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the FastAPI Server

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Run the Frontend

Open `index.html` in your browser or use the VS Code Live Server extension.

Make sure the FastAPI server is running before making predictions.

## 🔗 API Documentation

### Prediction Endpoint

**POST** `/predict`

Example request:

```json
{
  "City": "Kolkata",
  "Locality_Type": "Mid-Range",
  "Property_Type": "Apartment",
  "BHK": 3,
  "Bathrooms": 2,
  "Super_Area_SqFt": 1200,
  "Carpet_Area_SqFt": 1000,
  "Floor_Number": 3,
  "Total_Floors": 10,
  "Age_of_Property": 5,
  "Furnishing_Status": "Semi-Furnished",
  "Parking": 1,
  "Lift_Available": 1,
  "Gated_Community": 1,
  "Distance_to_Metro_km": 1.5,
  "Distance_to_City_Center_km": 5.0
}
```

Example response:

```json
{
  "predicted_price_in_lakhs": 75.50
}
```

*The response value above is illustrative.*

## 🧠 Machine Learning Workflow

The project follows a supervised Machine Learning regression workflow:

1. Dataset collection and understanding.
2. Exploratory Data Analysis (EDA).
3. Data cleaning and preprocessing.
4. Feature engineering and selection.
5. Model training and comparison.
6. Model evaluation using MAE, RMSE, and R².
7. Hyperparameter tuning.
8. Model serialization using Joblib.
9. Integration with FastAPI.
10. Frontend and backend integration.

## 📈 Future Improvements

- Add interactive price visualization.
- Improve prediction accuracy with additional real estate data.
- Integrate maps and location-based insights.
- Deploy the application to a cloud platform.
- Add user authentication and prediction history.

## 👨‍💻 Author

**Nurul Hasan**

- GitHub: [@nurulhasan321](https://github.com/nurulhasan321)
- LinkedIn: [@nurulhasan82](https://www.linkedin.com/in/nurulhasan82/)

---

⭐ If you find this project useful, consider giving it a star on GitHub!
