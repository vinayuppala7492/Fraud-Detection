# Batch CSV Processing Guide

## Overview

The `/api/batch-predict` endpoint processes multiple transactions through the complete **GraphSAGE → Autoencoder** pipeline for fraud detection. This is ideal for analyzing historical transaction data or performing bulk fraud assessments.

## Key Features

✅ **Graph-Based Analysis**: Uses k-nearest neighbors to build transaction relationships  
✅ **GraphSAGE Embeddings**: Generates structural embeddings (30 → 32 dimensions)  
✅ **Autoencoder Reconstruction**: Detects anomalies via reconstruction error  
✅ **Structural Confidence**: Cosine similarity between embedding and reconstruction  
✅ **Threshold-Based Detection**: Compares MSE against trained threshold (μ + 3σ)  
✅ **Batch Results**: Returns fraud status for every transaction in the CSV  

## CSV Format Requirements

Your CSV **must** include these columns (order doesn't matter):

- `Time` - Transaction timestamp (numerical)
- `V1` through `V28` - PCA-transformed features
- `Amount` - Transaction amount

**Example CSV structure:**
```csv
Time,V1,V2,V3,...,V28,Amount
0.0,-1.359,0.072,2.536,...,-0.021,149.62
406.0,-2.312,1.951,-1.609,...,0.145,2.69
```

## Usage Examples

### 1. Python (requests library)

```python
import requests

url = "http://localhost:5000/api/batch-predict"

with open("transactions.csv", "rb") as file:
    files = {"file": ("transactions.csv", file, "text/csv")}
    response = requests.post(url, files=files)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Processed {data['totalTransactions']} transactions")
        print(f"Fraudulent: {data['fraudulentCount']}")
        
        for result in data['results']:
            print(f"{result['transactionId']}: {result['prediction']}")
    else:
        print(f"Error: {response.json()['error']}")
```

### 2. cURL Command

```bash
curl -X POST http://localhost:5000/api/batch-predict \
  -F "file=@path/to/transactions.csv" \
  -H "Accept: application/json"
```

### 3. JavaScript (Fetch API)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:5000/api/batch-predict', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log(`Total: ${data.totalTransactions}`);
  console.log(`Fraudulent: ${data.fraudulentCount}`);
  
  data.results.forEach(txn => {
    console.log(`${txn.transactionId}: ${txn.prediction} (MSE: ${txn.reconstructionError})`);
  });
})
.catch(error => console.error('Error:', error));
```

## Response Schema

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
    }
  ]
}
```

### Field Descriptions

| Field | Description |
|-------|-------------|
| `transactionId` | Unique identifier (TXN-000001, TXN-000002, ...) |
| `time` | Original timestamp from CSV |
| `amount` | Original transaction amount |
| `reconstructionError` | MSE between GraphSAGE embedding and autoencoder reconstruction |
| `structuralConfidence` | Cosine similarity (0-1, higher = more confident) |
| `threshold` | Trained anomaly threshold from model |
| `isFraud` | Boolean fraud classification |
| `prediction` | "Fraudulent" or "Genuine" |

## Error Handling

### Common Errors

**1. Missing file**
```json
{
  "error": "No file uploaded"
}
```
**Solution**: Ensure `file` field is included in multipart/form-data

**2. Invalid CSV format**
```json
{
  "error": "Missing columns: V5, V18, Amount"
}
```
**Solution**: Verify CSV contains all required columns (Time, V1-V28, Amount)

**3. Empty CSV**
```json
{
  "error": "CSV file is empty"
}
```
**Solution**: Add at least one transaction row to the CSV

**4. Processing error**
```json
{
  "error": "Processing error: could not convert string to float: 'invalid'"
}
```
**Solution**: Ensure all columns contain numerical values only

## Testing

Run the included test script:

```bash
python test_batch_endpoint.py
```

This will:
1. Upload `sample_batch.csv` (3 transactions)
2. Print processing results
3. Display fraud detection metrics

## Performance Notes

- **Small batches (< 100 transactions)**: Processes in < 1 second
- **Medium batches (100-1000 transactions)**: 1-5 seconds
- **Large batches (1000-10000 transactions)**: 5-30 seconds

Graph construction time scales with O(n log n) due to k-nearest neighbors algorithm.

## Pipeline Architecture

```
CSV Upload
    ↓
Parse with Pandas
    ↓
Extract Features (Time, V1-V28, Amount)
    ↓
Scale Time & Amount (StandardScaler)
    ↓
Build k-NN Graph (k=5)
    ↓
GraphSAGE Model (30 → 32 dimensions)
    ↓
Autoencoder (32 → 16 → 8 → 16 → 32)
    ↓
Calculate MSE + Cosine Similarity
    ↓
Apply Threshold (μ + 3σ)
    ↓
Return JSON Results
```

## Database Persistence

All batch results are automatically saved to `results.db` for historical tracking. Each transaction in the batch creates a new database record with:
- Time
- Amount
- Reconstruction error
- Prediction status

## Next Steps

1. **Frontend Integration**: Add file upload component to React dashboard
2. **Export Results**: Add CSV/PDF export for batch analysis reports
3. **Real-time Progress**: Implement WebSocket for large batch processing status
4. **Visualization**: Create charts showing fraud distribution in batch results
