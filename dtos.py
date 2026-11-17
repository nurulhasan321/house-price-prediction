from pydantic import BaseModel




class HousePriceRequest(BaseModel):
    City: str
    Locality_Type: str
    Property_Type: str
    BHK: int
    Bathrooms: int
    Super_Area_SqFt: float
    Carpet_Area_SqFt: float
    Floor_Number: int
    Total_Floors: int
    Age_of_Property: int
    Furnishing_Status: str
    Parking: int
    Lift_Available: int
    Gated_Community: int
    Distance_to_Metro_km: float
    Distance_to_City_Center_km: float



