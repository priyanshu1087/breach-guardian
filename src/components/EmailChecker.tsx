import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, Search, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailCheckerProps {
  onCheck: (email: string, password?: string) => void;
  isLoading: boolean;
}

const EmailChecker = ({ onCheck, isLoading }: EmailCheckerProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to check.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    onCheck(email, checkPassword && password ? password : undefined);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="disable-cursor-glow bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 
                    shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-sm
                    hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 sm:h-14 pl-10 sm:pl-12 pr-3 sm:pr-4 text-base sm:text-lg bg-secondary border-border 
                       focus:border-primary focus:ring-2 focus:ring-primary/20
                       hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]
                       placeholder:text-muted-foreground transition-all duration-300"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="check-password" 
              checked={checkPassword}
              onCheckedChange={(checked) => setCheckPassword(checked as boolean)}
              disabled={isLoading}
            />
            <Label 
              htmlFor="check-password" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Also check if my password has been exposed
            </Label>
          </div>

          {checkPassword && (
            <div className="animate-fade-in space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 pl-0.5">
                {/* <Lock className="w-3 h-3 sm:w-4 sm:h-4" /> */}
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-secondary border-border focus:border-primary 
                           hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]
                           transition-all duration-300 text-base"
                  placeholder="Enter your password to check"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center px-10 sm:px-12">
                Your password is hashed locally and never sent in plain text.
              </p>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 
                     text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.3)]
                     hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground 
                              rounded-full animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                Check for Breaches
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
            We use the XposedOrNot to check against millions of breach records.
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-1 sm:mt-0"> Your email is not stored or shared.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailChecker;
