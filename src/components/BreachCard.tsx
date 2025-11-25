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
      className="bg-card border border-border rounded-xl p-6 hover:border-destructive/50 
               transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]
               animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h4 className="text-xl font-bold text-foreground mb-2">{breach.breach}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {breach.details || "Details not available for this breach."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {breach.domain && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>{breach.domain}</span>
              </div>
            )}
            {breach.breachDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
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
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Exposed Data Types:
              </p>
              <div className="flex flex-wrap gap-2">
                {breach.exposedData.map((dataType, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
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
