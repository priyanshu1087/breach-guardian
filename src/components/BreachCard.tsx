import { Calendar, Globe, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Breach {
  breach: string;
  details: string;
  domain: string;
  breachDate: string;
  exposedData: string[];
}

interface BreachCardProps {
  breach: Breach;
  index: number;
}

const BreachCard = ({ breach, index }: BreachCardProps) => {
  return (
    <div 
      className="bg-card border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:border-destructive/50 
               transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]
               sm:hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-destructive" />
        </div>
        
        <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{breach.breach}</h4>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              {breach.details || "Details not available for this breach."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            {breach.domain && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">{breach.domain}</span>
              </div>
            )}
            {breach.breachDate && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{new Date(breach.breachDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            )}
          </div>

          {breach.exposedData && breach.exposedData.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
                Exposed Data Types:
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {breach.exposedData.map((dataType, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs"
                  >
                    {dataType}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default BreachCard;
