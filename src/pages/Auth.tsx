import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Auth() {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    signin: false,
    signup: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Validate email format (more permissive)
  const validateEmail = (email: string): boolean => {
    // Very basic validation - just check for @ symbol and some text
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  // Validate form fields
  const validateForm = (formData: FormData, isSignUp: boolean = false): boolean => {
    const errors: Record<string, string> = {};
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter an email with @ symbol (e.g., test@example)';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (isSignUp && password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (isSignUp) {
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      
      if (!firstName || firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters long';
      }
      
      if (!lastName || lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters long';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData, false)) {
      return;
    }
    
    setLoading(true);
    setFormErrors({});
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const { error } = await signIn(email, password);
    
    if (error) {
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
      }
      
      toast({
        title: 'Error signing in',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData, true)) {
      return;
    }
    
    setLoading(true);
    setFormErrors({});
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    
    const { data, error } = await signUp(email, password, firstName.trim(), lastName.trim());
    
    if (error) {
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast({
        title: 'Error creating account',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      // Check if user is immediately confirmed (no email verification needed)
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Account created successfully!',
          description: 'You can now start shopping! Welcome to JumpStart Fashion.',
        });
      } else {
        toast({
          title: 'Account created successfully!',
          description: 'You are now logged in and ready to shop!',
        });
      }
      
      // Clear the form
      (e.target as HTMLFormElement).reset();
      setPasswordStrength({ score: 0, feedback: '' });
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (!email || !validateEmail(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (error) {
      toast({
        title: 'Error sending reset email',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Reset email sent!',
        description: 'Check your email for password reset instructions.',
        duration: 7000,
      });
      setShowForgotPassword(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <Card className="w-full max-w-md card-fashion">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-luxury bg-gradient-luxury bg-clip-text text-transparent">
            Welcome to JumpStart
          </CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      name="password"
                      type={showPassword.signin ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className={formErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(prev => ({ ...prev, signin: !prev.signin }))}
                      disabled={loading}
                    >
                      {showPassword.signin ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                {/* Forgot Password Link */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-gray-600 hover:text-gray-800"
                    disabled={loading}
                    onClick={() => setShowForgotPassword(!showForgotPassword)}
                  >
                    {showForgotPassword ? 'Back to sign in' : 'Forgot your password?'}
                  </Button>
                </div>
                
                {/* Forgot Password Form */}
                {showForgotPassword && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <form onSubmit={handleForgotPassword} className="space-y-3 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email Address</Label>
                          <Input
                            id="reset-email"
                            name="email"
                            type="email"
                            placeholder="Enter your email to reset password"
                            required
                            disabled={loading}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          size="sm"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? 'Sending...' : 'Send Reset Email'}
                        </Button>
                      </form>
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      required
                      disabled={loading}
                      className={formErrors.firstName ? 'border-red-500' : ''}
                    />
                    {formErrors.firstName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      required
                      disabled={loading}
                      className={formErrors.lastName ? 'border-red-500' : ''}
                    />
                    {formErrors.lastName && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword.signup ? 'text' : 'password'}
                      placeholder="Create a password (min. 8 characters)"
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
                      onClick={() => setShowPassword(prev => ({ ...prev, signup: !prev.signup }))}
                      disabled={loading}
                    >
                      {showPassword.signup ? (
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
                
                {/* Terms and Conditions */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    By creating an account, you agree to our{' '}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Terms of Service
                    </Button>{' '}
                    and{' '}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Privacy Policy
                    </Button>
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || passwordStrength.score < 2}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}