import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import torch
import torch.optim as optim
import torch.nn as nn
import joblib
import numpy as np

from preprocessing.preprocess import preprocess_data
from graph.graph_builder import build_graph
from models.graphsage_model import GraphSAGE
from models.autoencoder import Autoencoder


data_path = "dataset/creditcard.csv"

print("Loading dataset...")

X,y = preprocess_data(data_path)

print("Building graph...")

x,edge_index = build_graph(X)

print("Training GraphSAGE...")

graphsage = GraphSAGE(x.shape[1])

embeddings = graphsage(x,edge_index).detach()

normal_embeddings = embeddings[y==0]

print("Training Autoencoder...")

autoencoder = Autoencoder(32)

criterion = nn.MSELoss()
optimizer = optim.Adam(autoencoder.parameters(),lr=0.001)

for epoch in range(30):

    optimizer.zero_grad()

    recon = autoencoder(normal_embeddings)

    loss = criterion(recon,normal_embeddings)

    loss.backward()

    optimizer.step()

    print("Epoch:",epoch,"Loss:",loss.item())


print("Calculating reconstruction error threshold...")

with torch.no_grad():

    recon = autoencoder(normal_embeddings)

    errors = torch.mean((normal_embeddings - recon)**2, dim=1)

    mean_error = errors.mean().item()
    std_error = errors.std().item()

    threshold = mean_error + 3*std_error

print("Mean Error:",mean_error)
print("Std Error:",std_error)
print("Recommended Threshold:",threshold)

os.makedirs("saved_models",exist_ok=True)

torch.save(graphsage.state_dict(),"saved_models/graphsage_model.pth")
torch.save(autoencoder.state_dict(),"saved_models/autoencoder_model.pth")

joblib.dump(threshold,"saved_models/threshold.pkl")

print("Models and Threshold Saved Successfully")