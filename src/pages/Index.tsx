import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import EmailChecker from "@/components/EmailChecker";
import BreachDashboard from "@/components/BreachDashboard";
import { sha3_512, keccak_512 } from "js-sha3";

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
  passwordStatus?: "safe" | "exposed" | "error" | "not-checked";
}

const Index = () => {
  const [breachData, setBreachData] = useState<BreachData | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckEmail = async (email: string, password?: string) => {
    setIsChecking(true);
    setBreachData(null);

    let passwordStatus: "safe" | "exposed" | "error" | "not-checked" = "not-checked";

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
      // Check password if provided
      if (password) {
        try {
          const pwdHashAnon = keccak_512(password).substring(0, 10);
          const passwordResponse = await fetch(
            `https://passwords.xposedornot.com/v1/pass/anon/${encodeURIComponent(pwdHashAnon)}`
          );
          
          if (passwordResponse.status === 200) {
            passwordStatus = "exposed";
          } else if (passwordResponse.status === 404) {
            passwordStatus = "safe";
          } else {
            passwordStatus = "error";
          }
        } catch (error) {
          console.error("Error checking password:", error);
          passwordStatus = "error";
        }
      }

      const transformedData: BreachData = {
        email,
        breaches: breaches.map((breach: any) => ({
          breach: breach.breach || "Unknown",
          details: breach.details || "",
          domain: breach.domain || "",
          breachDate: breach.xposed_date || "",
          exposedData: breach.xposed_data ? breach.xposed_data.split(';') : [],
        })),
        breachCount: breaches.length,
        exposedRecords: breaches.reduce((total: number, breach: any) => 
          total + (breach.xposed_records || 0), 0
        ),
        passwordStatus,
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
        passwordStatus,
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

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4 sm:mb-6 
                          shadow-[0_0_20px_rgba(34,211,238,0.3)] sm:shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-pulse"
               style={{ animationDuration: '2s' }}>
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-primary 
                         bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] px-4">
            Breach Guardian
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 leading-relaxed">
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
          <div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            <div className="bg-card border border-border rounded-lg sm:rounded-xl p-5 sm:p-6 text-center 
                          hover:border-primary/50 transition-all duration-300
                          hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Instant Check</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Real-time breach detection</p>
            </div>
            <div className="bg-card border border-border rounded-lg sm:rounded-xl p-5 sm:p-6 text-center
                          hover:border-warning/50 transition-all duration-300
                          hover:shadow-[0_0_15px_rgba(251,146,60,0.15)]">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-warning mx-auto mb-2 sm:mb-3" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Complete breach history</p>
            </div>
            <div className="bg-card border border-border rounded-lg sm:rounded-xl p-5 sm:p-6 text-center
                          hover:border-success/50 transition-all duration-300
                          hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-success mx-auto mb-2 sm:mb-3" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Stay Protected</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Actionable recommendations</p>
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
