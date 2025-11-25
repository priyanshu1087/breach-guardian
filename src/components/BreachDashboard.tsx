import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Search, Calendar, Database, Lock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BreachCard from "@/components/BreachCard";
import type { BreachData } from "@/pages/Index";

interface BreachDashboardProps {
  data: BreachData;
  onNewSearch: () => void;
}

const BreachDashboard = ({ data, onNewSearch }: BreachDashboardProps) => {
  const isExposed = data.breachCount > 0;
  
  // Calculate risk level
  const getRiskLevel = () => {
    const bothExposed = data.breachCount > 0 && data.passwordStatus === "exposed";
    if (data.breachCount > 2 || bothExposed) return "High";
    if (data.breachCount > 0) return "Medium";
    return "Low";
  };
  
  const riskLevel = getRiskLevel();
  const riskColors = {
    High: { bg: 'bg-destructive/10', border: 'border-destructive', text: 'text-destructive', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]' },
    Medium: { bg: 'bg-warning/10', border: 'border-warning', text: 'text-warning', glow: 'shadow-[0_0_40px_rgba(251,146,60,0.4)]' },
    Low: { bg: 'bg-success/10', border: 'border-success', text: 'text-success', glow: 'shadow-[0_0_40px_rgba(34,197,94,0.4)]' }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in px-4 sm:px-0">
      {/* Status Banner */}
      <div className={`rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-10 border-2 transition-all duration-500 backdrop-blur-sm ${
        isExposed 
          ? 'bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent border-destructive shadow-[0_0_60px_rgba(239,68,68,0.3)] animate-pulse' 
          : 'bg-gradient-to-br from-success/20 via-success/10 to-transparent border-success shadow-[0_0_60px_rgba(34,197,94,0.3)]'
      }`} style={{ animationDuration: '3s' }}>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 ${
            isExposed ? 'bg-destructive/20' : 'bg-success/20'
          }`}>
            {isExposed ? (
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
            ) : (
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 ${
              isExposed ? 'text-destructive' : 'text-success'
            }`}>
              {isExposed ? 'Email Exposed!' : 'All Clear!'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-1 break-all">
              {data.email}
            </p>
            {isExposed ? (
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Found in {data.breachCount} breach{data.breachCount !== 1 ? 'es' : ''} affecting {data.exposedRecords.toLocaleString()} records
              </p>
            ) : (
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                No breaches detected for this email address
              </p>
            )}
          </div>

          <Button
            onClick={onNewSearch}
            variant="outline"
            className="border-2 hover:bg-card/50 h-10 sm:h-11 text-sm sm:text-base w-full sm:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            New Search
          </Button>
        </div>
      </div>

      {/* Password Status */}
      {data.passwordStatus && data.passwordStatus !== "not-checked" && (
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 backdrop-blur-sm transition-all duration-500 ${
          data.passwordStatus === "safe" 
            ? "bg-gradient-to-br from-success/20 via-success/10 to-transparent border-success shadow-[0_0_30px_rgba(34,197,94,0.2)]" 
            : data.passwordStatus === "exposed"
            ? "bg-gradient-to-br from-destructive/20 via-destructive/10 to-transparent border-destructive shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse"
            : "bg-gradient-to-br from-warning/20 via-warning/10 to-transparent border-warning shadow-[0_0_30px_rgba(251,146,60,0.2)]"
        }`} style={{ animationDuration: '3s' }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              data.passwordStatus === "safe" 
                ? "bg-success/20" 
                : data.passwordStatus === "exposed"
                ? "bg-destructive/20"
                : "bg-warning/20"
            }`}>
              {data.passwordStatus === "safe" ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
              ) : data.passwordStatus === "exposed" ? (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              ) : (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2 flex-wrap ${
                data.passwordStatus === "safe" 
                  ? "text-success" 
                  : data.passwordStatus === "exposed"
                  ? "text-destructive"
                  : "text-warning"
              }`}>
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                Password Security Check
              </h3>
              <p className="text-sm sm:text-base text-foreground/80">
                {data.passwordStatus === "safe" 
                  ? "Good news! Your password has not been found in any known data breaches." 
                  : data.passwordStatus === "exposed"
                  ? "⚠️ Warning: Your password has been exposed in data breaches. Change it immediately across all accounts!"
                  : "Unable to verify password status. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Recommendation */}
      {isExposed && (
        <div className="bg-gradient-to-br from-warning/20 via-warning/10 to-transparent border-2 border-warning rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(251,146,60,0.3)] backdrop-blur-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-warning mb-2">
                Immediate Action Required
              </h3>
              <p className="text-sm sm:text-base text-foreground/80 mb-3 sm:mb-4">
                Your email and associated data have been exposed. We strongly recommend:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-foreground/80">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  Change passwords for all accounts using this email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  Enable two-factor authentication where available
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  Monitor your accounts for suspicious activity
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  Consider using a password manager for unique passwords
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Total Breaches</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.breachCount}</p>
        </div>

        <div className="bg-gradient-to-br from-card via-card to-destructive/5 border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-destructive/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            </div>
            <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Exposed Records</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.exposedRecords.toLocaleString()}</p>
        </div>

        <div className={`rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 transition-all duration-500 ${riskColors[riskLevel].bg} ${riskColors[riskLevel].border} ${riskColors[riskLevel].glow} hover:scale-105 transform`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${riskColors[riskLevel].bg} flex items-center justify-center flex-shrink-0 animate-pulse`} style={{ animationDuration: '2s' }}>
              <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${riskColors[riskLevel].text}`} />
            </div>
            <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Risk Level</h3>
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${riskColors[riskLevel].text}`}>
            {riskLevel}
          </p>
          {riskLevel === "High" && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {data.breachCount > 2 && data.passwordStatus === "exposed" 
                ? "Multiple breaches + exposed password" 
                : data.breachCount > 2 
                ? "Multiple breaches detected" 
                : "Email & password both exposed"}
            </p>
          )}
        </div>
      </div>

      {/* Breach Details */}
      {isExposed && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Breach History
          </h3>
          <div className="grid gap-4 sm:gap-6">
            {data.breaches.map((breach, index) => (
              <BreachCard key={index} breach={breach} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreachDashboard;
