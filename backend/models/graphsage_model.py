import torch.nn.functional as F
from torch_geometric.nn import SAGEConv
import torch.nn as nn

class GraphSAGE(nn.Module):

    def __init__(self,input_dim):

        super(GraphSAGE,self).__init__()

        self.conv1 = SAGEConv(input_dim,64)
        self.conv2 = SAGEConv(64,32)

    def forward(self,x,edge_index):

        x = self.conv1(x,edge_index)
        x = F.relu(x)

        x = self.conv2(x,edge_index)

        return x