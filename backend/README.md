# Graph-Based Credit Card Fraud Detection

This project detects fraudulent credit card transactions using:

Graph Neural Networks (GraphSAGE)
Autoencoder-based anomaly detection
Flask web interface

## Architecture

Transaction Data → Graph Construction → GraphSAGE → Node Embeddings → Autoencoder → Fraud Detection

## Run Project

Install dependencies

pip install -r requirements.txt

Train model

python models/train_model.py

Run Flask app

python app.py

Open browser

http://127.0.0.1:5000

## API Endpoints

### 1. Single Transaction Prediction
**POST** `/api/predict`

Request body (JSON):
```json
{
  "Time": 0.0,
  "V1": -1.35980713,
  "V2": -0.07278117,
  ...
  "V28": -0.02105305,
  "Amount": 149.62
}
```

Response:
```json
{
  "prediction": "Genuine",
  "anomalyScore": 0.012345,
  "threshold": 0.023456,
  "time": 0.0,
  "amount": 149.62,
  "isFraud": false
}
```

### 2. Batch CSV Processing (NEW)
**POST** `/api/batch-predict`

Upload a CSV file containing multiple transactions through GraphSAGE → Autoencoder pipeline.

**Content-Type**: `multipart/form-data`

**CSV Format**: Must include columns `Time`, `V1` through `V28`, and `Amount`

Example using curl:
```bash
curl -X POST http://localhost:5000/api/batch-predict \
  -F "file=@transactions.csv"
```

Response:
```json
{
  "success": true,
  "totalTransactions": 100,
  "fraudulentCount": 12,
  "genuineCount": 88,
  "results": [
    {
      "transactionId": "TXN-000001",
      "time": 0.0,
      "amount": 149.62,
      "reconstructionError": 0.012345,
      "structuralConfidence": 0.9876,
      "threshold": 0.023456,
      "isFraud": false,
      "prediction": "Genuine"
    },
    ...
  ]
}
```

**Test the batch endpoint**:
```bash
python test_batch_endpoint.py
```

### 3. Dashboard Statistics
**GET** `/api/stats`

Returns fraud detection statistics (total monitored, fraud count, fraud rate, etc.)

### 4. Recent Transactions
**GET** `/api/transactions?limit=10`

Returns recent transaction history from the database

## Pipeline Details

### Single Prediction Flow
1. Input: 30 features (Time, V1-V28, Amount)
2. Scale Time and Amount using StandardScaler
3. Linear embedding layer (30 → 32 dimensions)
4. Autoencoder reconstruction (32 → 16 → 8 → 16 → 32)
5. Calculate MSE between embedding and reconstruction
6. Compare MSE against threshold (μ + 3σ)

### Batch Prediction Flow
1. Upload CSV with multiple transactions
2. Parse and validate column structure
3. Scale Time and Amount for all transactions
4. Build k-nearest neighbors graph (k=5)
5. GraphSAGE model generates embeddings (30 → 32)
6. Autoencoder reconstructs embeddings
7. Calculate reconstruction error (MSE) per transaction
8. Calculate structural confidence (cosine similarity)
9. Apply threshold to determine fraud status
10. Return detailed results for each transaction

## Model Files

- `autoencoder_model.pth` - Trained autoencoder weights
- `graphsage_model.pth` - Trained GraphSAGE weights
- `scaler.pkl` - StandardScaler for Time/Amount normalization
- `threshold.pkl` - Anomaly detection threshold (μ + 3σ)

## Sample Files

- `sample_batch.csv` - Example CSV with 3 transactions for testing batch endpoint