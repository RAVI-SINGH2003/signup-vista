/**
 * Login Page Component
 * Provides user authentication with email and password
 * Includes form validation, password visibility toggle, and remember me functionality
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockPerson,
  Google,
  GitHub,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import '../styles/auth.scss';

/**
 * Login form validation schema
 * Defines rules for email and password fields
 */
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Component
 * Handles user authentication with validation and error handling
 */
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Handle form submission
   * Validates credentials and performs login
   * @param data - Form data containing email, password, and remember me preference
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call (replace with actual authentication logic)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store remember me preference if needed
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Show success message
      toast.success('Login successful! Welcome back.', {
        description: 'Redirecting to dashboard...',
      });
      
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      // Handle login errors
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle social authentication
   * Placeholder for OAuth integration
   * @param provider - Social authentication provider (google, github)
   */
  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login`, {
      description: 'Social authentication coming soon!',
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header Section */}
        <div className="auth-header">
          <div className="auth-logo">
            <LockPerson />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                className="auth-input"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                disabled={isLoading}
              />
            )}
          />

          {/* Password Input with Visibility Toggle */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                className="auth-input"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Remember Me and Forgot Password */}
          <div className="auth-options">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      disabled={isLoading}
                    />
                  }
                  label="Remember me"
                  className="remember-me"
                />
              )}
            />
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-buttons">
          <Button
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            onClick={() => handleSocialLogin('GitHub')}
            disabled={isLoading}
          >
            GitHub
          </Button>
        </div>

        {/* Footer - Sign Up Link */}
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
