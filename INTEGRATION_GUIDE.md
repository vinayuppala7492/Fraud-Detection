# Fraud Guard - Integrated Setup Guide

This guide explains how to run the complete fraud detection system with the GraphSAGE + Autoencoder model backend integrated with the React frontend.

## System Architecture

- **Backend**: Flask API (`backend/`) serving the fraud detection model
- **Frontend**: React + TypeScript dashboard (`frontend/`)
- **Model**: GraphSAGE (Graph Neural Network) + Autoencoder for anomaly detection

## Prerequisites

- Python 3.8+
- Node.js 18+
- pip (Python package manager)
- npm or bun (Node package manager)

## Part 1: Backend Setup (Flask API)

### 1. Navigate to the model directory

```bash
cd backend
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Verify model files exist

Make sure these files are present in `saved_models/`:
- `autoencoder_model.pth`
- `graphsage_model.pth`
- `scaler.pkl`
- `threshold.pkl`

If these files don't exist, you need to train the model first:

```bash
python models/train_model.py
```

### 4. Start the Flask backend

```bash
python app.py
```

The backend will start on `http://localhost:5000`

**API Endpoints:**
- `GET /api/stats` - Get dashboard statistics
- `GET /api/transactions?limit=10` - Get recent transactions
- `POST /api/predict` - Predict fraud for a transaction

## Part 2: Frontend Setup (React Dashboard)

### 1. Navigate to the dashboard directory

```bash
cd frontend
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

### 3. Configure environment variables

The `.env` file has been created with default settings:
```
VITE_API_URL=http://localhost:5000
```

### 4. Start the development server

Using npm:
```bash
npm run dev
```

Or using bun:
```bash
bun dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Using the Application

### Dashboard Page (`/dashboard`)

- View real-time fraud detection statistics
- Monitor total transactions, fraud rate, and model performance
- See recent transactions with anomaly scores
- All data is fetched live from the Flask backend every 10 seconds

### Simulator Page (`/simulator`)

1. **Select Transaction Profile:**
   - "Random Genuine" - Generates features typical of legitimate transactions
   - "Random Fraud" - Generates features typical of fraudulent transactions

2. **Adjust Parameters:**
   - Transaction Amount ($)
   - Time (seconds since last transaction)

3. **Click "Analyze Transaction":**
   - The frontend generates 30 features (Time, V1-V28, Amount)
   - Sends them to the Flask backend
   - Model returns prediction with anomaly score
   - Results are saved to database and displayed

### How the Model Works

1. **Input**: 30 features from credit card transaction data
   - Time: Seconds elapsed since first transaction
   - V1-V28: PCA-transformed features (anonymized)
   - Amount: Transaction amount

2. **Processing**:
   - Features are scaled using saved StandardScaler
   - Passed through GraphSAGE embedding layer
   - Autoencoder reconstructs the embedding
   - Reconstruction error is calculated

3. **Prediction**:
   - If error > threshold: **FRAUD**
   - If error ≤ threshold: **GENUINE**

## Troubleshooting

### Backend Issues

**Error: Module not found**
```bash
pip install -r requirements.txt
```

**Error: Model files not found**
```bash
python models/train_model.py
```

**Port 5000 already in use**
Edit `app.py` and change the port:
```python
app.run(debug=True, port=5001)
```
Then update `.env` in the frontend to match.

### Frontend Issues

**Error: Cannot connect to backend**
- Ensure Flask backend is running on http://localhost:5000
- Check browser console for CORS errors
- Verify `.env` file has correct `VITE_API_URL`

**Dependencies not installing**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 already in use**
Vite will automatically use the next available port.

## Database

The backend uses SQLite (`results.db`) to store transaction results. The database is created automatically when you first run the Flask app.

**Schema:**
```sql
CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time REAL,
    amount REAL,
    error REAL,
    prediction TEXT
)
```

## Features Added

### Backend (`backend/app.py`)
- ✅ CORS support for frontend communication
- ✅ RESTful API endpoints for stats, transactions, and predictions
- ✅ JSON responses instead of HTML templates
- ✅ Error handling and validation

### Frontend (`frontend/src/`)
- ✅ API service layer (`services/api.ts`)
- ✅ Real-time dashboard with live data
- ✅ Integration with actual ML model
- ✅ Auto-refresh every 10 seconds
- ✅ Feature generation for testing
- ✅ Error handling and user notifications
- ✅ Maintained original design and styling

## Tech Stack

**Backend:**
- Flask (Web framework)
- PyTorch (Deep learning)
- torch-geometric (Graph neural networks)
- scikit-learn (Data preprocessing)
- SQLite (Database)

**Frontend:**
- React 18
- TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- shadcn/ui (Component library)
- Recharts (Data visualization)
- Framer Motion (Animations)

## Next Steps

- Add more comprehensive confusion matrix tracking
- Implement user authentication
- Add transaction history filtering
- Create alerts for high-risk transactions
- Deploy to production environment
- Add model retraining capabilities via UI

## License

This project is for educational and demonstration purposes.


