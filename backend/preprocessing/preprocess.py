import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
import os

def preprocess_data(path):

    df = pd.read_csv(path)

    df = df.dropna()

    scaler = StandardScaler()

    df[['Time','Amount']] = scaler.fit_transform(df[['Time','Amount']])

    os.makedirs("saved_models",exist_ok=True)

    joblib.dump(scaler,"saved_models/scaler.pkl")

    X = df.drop("Class",axis=1)
    y = df["Class"]

    return X.values,y.values