"""
Test script for batch-predict endpoint
Demonstrates CSV upload and batch processing
"""

import requests
import json

# API endpoint
url = "http://localhost:5000/api/batch-predict"

# Path to CSV file
csv_file_path = "sample_batch.csv"

# Send POST request with file upload
with open(csv_file_path, 'rb') as file:
    files = {'file': ('sample_batch.csv', file, 'text/csv')}
    response = requests.post(url, files=files)

# Print response
print("Status Code:", response.status_code)
print("\nResponse JSON:")
print(json.dumps(response.json(), indent=2))

# Parse results
if response.status_code == 200:
    data = response.json()
    print(f"\n✅ Successfully processed {data['totalTransactions']} transactions")
    print(f"   - Fraudulent: {data['fraudulentCount']}")
    print(f"   - Genuine: {data['genuineCount']}")
    print("\nFirst transaction details:")
    if data['results']:
        first = data['results'][0]
        print(f"   Transaction ID: {first['transactionId']}")
        print(f"   Amount: ${first['amount']:.2f}")
        print(f"   Reconstruction Error: {first['reconstructionError']:.6f}")
        print(f"   Structural Confidence: {first['structuralConfidence']:.4f}")
        print(f"   Threshold: {first['threshold']:.6f}")
        print(f"   Prediction: {first['prediction']}")
else:
    print("❌ Error:", response.json().get('error'))
