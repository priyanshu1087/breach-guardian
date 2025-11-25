import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import EmailChecker from "@/components/EmailChecker";
import BreachDashboard from "@/components/BreachDashboard";

export interface BreachData {
  email: string;
  breaches: Array<{
    breach: string;
    details: string;
    domain: string;
    breachDate: string;
    exposedData: string[];
  }>;
  breachCount: number;
  exposedRecords: number;
}

const Index = () => {
  const [breachData, setBreachData] = useState<BreachData | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckEmail = async (email: string) => {
    setIsChecking(true);
    setBreachData(null);

    try {
      // First API call: Check if email is breached
      const checkResponse = await fetch(
        `https://api.xposedornot.com/v1/check-email/${email}`
      );
      
      if (!checkResponse.ok) {
        throw new Error("Failed to check email");
      }

      // Second API call: Get breach analytics
      const analyticsResponse = await fetch(
        `https://api.xposedornot.com/v1/breach-analytics?email=${email}`
      );
      
      if (!analyticsResponse.ok) {
        throw new Error("Failed to fetch breach analytics");
      }

      const analyticsData = await analyticsResponse.json();
      
      // Transform the data into our format
      const breaches = analyticsData.ExposedBreaches?.breaches_details || [];
      const transformedData: BreachData = {
        email,
        breaches: breaches.map((breach: any) => ({
          breach: breach.breach || "Unknown",
          details: breach.details || "",
          domain: breach.domain || "",
          breachDate: breach.breach_date || "",
          exposedData: breach.exposed_data || [],
        })),
        breachCount: analyticsData.ExposedBreaches?.breaches_count || 0,
        exposedRecords: analyticsData.ExposedBreaches?.exposed_records || 0,
      };

      setBreachData(transformedData);
    } catch (error) {
      console.error("Error checking email:", error);
      // Set empty breach data to show safe status
      setBreachData({
        email,
        breaches: [],
        breachCount: 0,
        exposedRecords: 0,
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-destructive/5 animate-pulse" 
           style={{ animationDuration: '8s' }} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 
                          shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-pulse"
               style={{ animationDuration: '2s' }}>
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary 
                         bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Breach Guardian
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Check if your email has been exposed in any data breaches. Stay secure, stay informed.
          </p>
        </div>

        {/* Main Content */}
        {!breachData ? (
          <EmailChecker onCheck={handleCheckEmail} isLoading={isChecking} />
        ) : (
          <BreachDashboard data={breachData} onNewSearch={() => setBreachData(null)} />
        )}

        {/* Security Stats - Only show when no results */}
        {!breachData && !isChecking && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 text-center 
                          hover:border-primary/50 transition-all duration-300
                          hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Instant Check</h3>
              <p className="text-muted-foreground text-sm">Real-time breach detection</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center
                          hover:border-warning/50 transition-all duration-300
                          hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]">
              <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground text-sm">Complete breach history</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center
                          hover:border-success/50 transition-all duration-300
                          hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Stay Protected</h3>
              <p className="text-muted-foreground text-sm">Actionable recommendations</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-gradient {
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;
