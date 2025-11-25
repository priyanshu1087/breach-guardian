import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Search, Calendar, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BreachCard from "@/components/BreachCard";
import type { BreachData } from "@/pages/Index";

interface BreachDashboardProps {
  data: BreachData;
  onNewSearch: () => void;
}

const BreachDashboard = ({ data, onNewSearch }: BreachDashboardProps) => {
  const isExposed = data.breachCount > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Status Banner */}
      <div className={`rounded-2xl p-8 md:p-12 border-2 transition-all duration-500 ${
        isExposed 
          ? 'bg-destructive/10 border-destructive shadow-[0_0_50px_rgba(239,68,68,0.2)]' 
          : 'bg-success/10 border-success shadow-[0_0_50px_rgba(34,197,94,0.2)]'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isExposed ? 'bg-destructive/20' : 'bg-success/20'
          }`}>
            {isExposed ? (
              <ShieldAlert className="w-10 h-10 text-destructive" />
            ) : (
              <ShieldCheck className="w-10 h-10 text-success" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${
              isExposed ? 'text-destructive' : 'text-success'
            }`}>
              {isExposed ? 'Email Exposed!' : 'All Clear!'}
            </h2>
            <p className="text-lg text-foreground/80 mb-1">
              {data.email}
            </p>
            {isExposed ? (
              <p className="text-muted-foreground">
                Found in {data.breachCount} breach{data.breachCount !== 1 ? 'es' : ''} affecting {data.exposedRecords.toLocaleString()} records
              </p>
            ) : (
              <p className="text-muted-foreground">
                No breaches detected for this email address
              </p>
            )}
          </div>

          <Button
            onClick={onNewSearch}
            variant="outline"
            className="border-2 hover:bg-card/50"
          >
            <Search className="w-4 h-4 mr-2" />
            New Search
          </Button>
        </div>
      </div>

      {/* Password Change Recommendation */}
      {isExposed && (
        <div className="bg-warning/10 border-2 border-warning rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-warning mb-2">
                Immediate Action Required
              </h3>
              <p className="text-foreground/80 mb-4">
                Your email and associated data have been exposed. We strongly recommend:
              </p>
              <ul className="space-y-2 text-foreground/80">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-muted-foreground">Total Breaches</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{data.breachCount}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-destructive/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="font-semibold text-muted-foreground">Exposed Records</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{data.exposedRecords.toLocaleString()}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 hover:border-warning/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold text-muted-foreground">Risk Level</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {data.breachCount === 0 ? 'Low' : data.breachCount < 3 ? 'Medium' : 'High'}
          </p>
        </div>
      </div>

      {/* Breach Details */}
      {isExposed && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            Breach History
          </h3>
          <div className="grid gap-6">
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
