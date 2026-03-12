import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import NetworkGraph from "@/components/NetworkGraph";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type ResultStatus = "idle" | "loading" | "approved" | "blocked";

interface SimResult {
  status: ResultStatus;
  anomalyScore: number;
  threshold: number;
}

export default function Simulator() {
  const [amount, setAmount] = useState("245.00");
  const [time, setTime] = useState("14");
  const [profile, setProfile] = useState<"genuine" | "fraud">("genuine");
  const [result, setResult] = useState<SimResult>({ status: "idle", anomalyScore: 0, threshold: 0 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setResult({ status: "loading", anomalyScore: 0, threshold: 0 });
    
    try {
      // Generate random features based on profile
      const features = apiService.generateRandomFeatures(profile);
      
      // Override with user inputs if provided
      if (amount) features.Amount = parseFloat(amount);
      if (time) features.Time = parseFloat(time);
      
      // Call the Flask API at http://localhost:5000/api/predict
      const prediction = await apiService.predict(features);
      
      setResult({
        status: prediction.isFraud ? "blocked" : "approved",
        anomalyScore: prediction.anomalyScore,
        threshold: prediction.threshold,
      });
      
      toast({
        title: prediction.isFraud ? "THREAT DETECTED" : "TRANSACTION APPROVED",
        description: `Reconstruction Error: ${prediction.anomalyScore.toFixed(6)} | Threshold: ${prediction.threshold.toFixed(6)}`,
        variant: prediction.isFraud ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Flask API connection error:', error);
      setResult({ status: "idle", anomalyScore: 0, threshold: 0 });
      toast({
        title: "System Connection Lost",
        description: "Flask backend offline - ensure server is running on port 5000",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transaction Simulator</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            
            {/* Feature Info Banner */}
            <div className="rounded-xl bg-muted/40 border border-border/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">
                  30-Dimensional Feature Space
                </span>
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {showAdvanced ? "Hide" : "Show"} Technical
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 rounded-xl bg-muted border border-border px-4 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Time (s)</label>
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-11 rounded-xl bg-muted border border-border px-4 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Profile</label>
                <div className="flex gap-3">
                  {(["genuine", "fraud"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProfile(p)}
                      className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                        profile === p
                          ? p === "genuine"
                            ? "border-secondary/50 bg-secondary/10 text-secondary"
                            : "border-destructive/50 bg-destructive/10 text-destructive"
                          : "border-border bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p === "genuine" ? "Genuine" : "Fraudulent"}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Auto-generates 28 PCA components (V1-V28) based on profile
                </p>
              </div>

              {/* Advanced Technical Details */}
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Feature Pipeline</span>
                    <span className="text-[10px] text-muted-foreground font-mono">GraphSAGE → Autoencoder</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Input Features</span>
                      <span className="text-foreground font-mono">30-dim</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Graph Embeddings</span>
                      <span className="text-foreground font-mono">32-dim</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Latent Space</span>
                      <span className="text-foreground font-mono">8-dim</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Reconstruction Loss</span>
                      <span className="text-secondary font-mono">MSE Metric</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      The system uses Principal Component Analysis features (V1-V28) from the original transaction data.
                      Profile selection intelligently generates realistic values for fraud detection.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <Button variant="hero" size="lg" className="w-full" onClick={handleAnalyze} disabled={result.status === "loading"}>
              {result.status === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Scan className="h-5 w-5" />
              )}
              Analyze Transaction
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Status Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={result.status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-2xl border p-6 flex items-center gap-4 ${
                  result.status === "approved"
                    ? "border-secondary/40 bg-secondary/5"
                    : result.status === "blocked"
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border bg-card"
                }`}
              >
                {result.status === "idle" && (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Scan className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-muted-foreground">Standing by for transaction data...</p>
                    </div>
                  </>
                )}
                {result.status === "loading" && (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Processing transaction graph...</p>
                    </div>
                  </>
                )}
                {result.status === "approved" && (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center neon-green-shadow">
                      <ShieldCheck className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-secondary">APPROVED</p>
                    </div>
                  </>
                )}
                {result.status === "blocked" && (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center neon-red-shadow">
                      <ShieldAlert className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-destructive">BLOCKED</p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Scores */}
            {(result.status === "approved" || result.status === "blocked") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-5 space-y-5"
              >
                <ScoreBar 
                  label="Reconstruction Error" 
                  value={result.anomalyScore} 
                  threshold={result.threshold}
                  danger={result.anomalyScore > result.threshold}
                  subtitle="Mean Squared Error (MSE)"
                />
                <ScoreBar 
                  label="Structural Confidence" 
                  value={Math.max(0, Math.min(1, 1 - (result.anomalyScore / (result.threshold * 2))))} 
                  threshold={0.5}
                  danger={result.anomalyScore > result.threshold} 
                  isPercentage={true}
                  subtitle="Embedding Similarity"
                />
                <div className="text-xs text-muted-foreground pt-2 space-y-1">
                  <div>
                    <span>Detection Threshold: </span>
                    <span className="font-mono text-foreground">{result.threshold.toFixed(6)}</span>
                  </div>
                  <div className="text-[10px]">
                    Autoencoder trained on genuine transactions | σ = 3.0 deviation
                  </div>
                </div>
              </motion.div>
            )}

            {/* Network Graph */}
            <NetworkGraph status={result.status} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ScoreBar({ label, value, threshold, danger, isPercentage, subtitle }: { label: string; value: number; threshold: number; danger: boolean; isPercentage?: boolean; subtitle?: string }) {
  const pct = isPercentage 
    ? Math.min(Math.round(value * 100), 100)
    : Math.min(Math.round((value / (threshold * 2)) * 100), 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <div className="flex flex-col">
          <span className="text-muted-foreground">{label}</span>
          {subtitle && <span className="text-[10px] text-muted-foreground/60">{subtitle}</span>}
        </div>
        <span className={danger ? "text-destructive font-medium" : "text-secondary font-medium"}>
          {isPercentage ? `${(value * 100).toFixed(2)}%` : value.toFixed(6)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${danger ? "bg-destructive" : "bg-secondary"}`}
        />
        {/* Threshold marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
          style={{ left: '50%' }}
        />
      </div>
    </div>
  );
}
