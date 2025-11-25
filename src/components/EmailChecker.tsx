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
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 
                    shadow-[0_0_50px_rgba(34,211,238,0.1)] backdrop-blur-sm
                    hover:shadow-[0_0_60px_rgba(34,211,238,0.15)] transition-all duration-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-14 pl-12 pr-4 text-lg bg-secondary border-border 
                       focus:border-primary focus:ring-2 focus:ring-primary/20
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
            <div className="animate-fade-in">
              <Label htmlFor="password" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-secondary border-border focus:border-primary"
                placeholder="Enter your password to check"
              />
              <p className="text-xs text-muted-foreground mt-2">
                🔒 Your password is hashed locally and never sent in plain text.
              </p>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 
                     text-primary-foreground shadow-[0_0_20px_rgba(34,211,238,0.3)]
                     hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground 
                              rounded-full animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Check for Breaches
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            We use the XposedOrNot API to check against millions of breach records.
            <br />
            Your email is not stored or shared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailChecker;
