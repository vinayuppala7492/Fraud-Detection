import torch
import numpy as np
from sklearn.neighbors import kneighbors_graph

def build_graph(features):

    A = kneighbors_graph(features,n_neighbors=5,mode="connectivity")

    edge_index = torch.tensor(np.array(A.nonzero()),dtype=torch.long)

    x = torch.tensor(features,dtype=torch.float)

    return x,edge_index