import torch.nn as nn

class Autoencoder(nn.Module):

    def __init__(self,input_dim):

        super(Autoencoder,self).__init__()

        self.encoder = nn.Sequential(
            nn.Linear(input_dim,16),
            nn.ReLU(),
            nn.Linear(16,8)
        )

        self.decoder = nn.Sequential(
            nn.Linear(8,16),
            nn.ReLU(),
            nn.Linear(16,input_dim)
        )

    def forward(self,x):

        z = self.encoder(x)

        x_recon = self.decoder(z)

        return x_recon