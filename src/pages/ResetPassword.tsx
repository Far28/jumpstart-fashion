import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Check if we have the required tokens
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      toast({
        title: 'Invalid reset link',
        description: 'This password reset link is invalid or has expired.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [accessToken, refreshToken, navigate]);

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    else feedback = 'Password must be at least 8 characters long';

    if (/[A-Z]/.test(password)) score += 1;
    else if (score > 0) feedback = 'Add uppercase letters for better security';

    if (/[a-z]/.test(password)) score += 1;
    else if (score > 0) feedback = 'Add lowercase letters for better security';

    if (/\d/.test(password)) score += 1;
    else if (score > 0) feedback = 'Add numbers for better security';

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else if (score > 0) feedback = 'Add special characters for better security';

    if (score >= 4) feedback = 'Strong password!';
    else if (score >= 3) feedback = 'Good password';
    else if (score >= 2) feedback = 'Fair password';
    else if (score >= 1) feedback = 'Weak password';

    setPasswordStrength({ score, feedback });
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords
    const errors: Record<string, string> = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: 'Error updating password',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Password updated successfully!',
          description: 'You can now sign in with your new password.',
        });
        navigate('/auth');
      }
    } catch (error: any) {
      toast({
        title: 'Error updating password',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  if (!accessToken || !refreshToken) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <Card className="w-full max-w-md card-fashion">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-luxury bg-gradient-luxury bg-clip-text text-transparent">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  required
                  disabled={loading}
                  className={formErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordStrength.feedback && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 2 ? 'bg-red-500' :
                          passwordStrength.score <= 3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.score >= 4 && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className={`text-sm flex items-center gap-1 ${
                    passwordStrength.score <= 2 ? 'text-red-500' :
                    passwordStrength.score <= 3 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.score < 4 && <AlertCircle className="h-4 w-4" />}
                    {passwordStrength.score >= 4 && <CheckCircle2 className="h-4 w-4" />}
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
              
              {formErrors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                required
                disabled={loading}
                className={formErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || passwordStrength.score < 2}
            >
              {loading ? 'Updating password...' : 'Update Password'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={() => navigate('/auth')}
                disabled={loading}
              >
                Back to sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
