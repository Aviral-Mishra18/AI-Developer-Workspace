"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Eye, EyeOff, CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password", "");

  const checkStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[a-z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkStrength(e.target.value);
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Password successfully reset!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription>
            Enter your new secure password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Password updated</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your password has been successfully reset. You can now use your new password to log in.
                </p>
              </div>
              <Button
                className="w-full mt-2"
                onClick={() => router.push("/login")}
              >
                Log In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-border pr-10"
                    {...register("password", {
                      onChange: handlePasswordChange
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordVal.length > 0 && (
                  <div className="space-y-1 mt-1">
                    <Progress value={passwordStrength} className="h-1" />
                    <span className="text-[10px] text-muted-foreground">
                      Password strength: {passwordStrength === 100 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="border-border"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center border-t border-border p-6 mt-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Log In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
