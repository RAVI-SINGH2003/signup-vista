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
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import '../styles/login.scss';

// Email validation regex
const EMAIL_REGEX = /^(?!\.)(?!.*\.@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Login form validation schema
 * Defines rules for email and password fields
 */
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .regex(EMAIL_REGEX, 'Please enter a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be at most 15 characters'),
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
   * Toggle theme between light and dark mode
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

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
   * @param provider - Social authentication provider (google)
   */
  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login`, {
      description: 'Social authentication coming soon!',
    });
  };

  return (
    <div className="login-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </button>

      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="login-logo">
            <LockPerson />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                type="text"
                variant="outlined"
                fullWidth
                className="login-input"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                disabled={isLoading}
                inputProps={{ 'aria-label': 'Email Address' }}
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
                className="login-input"
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
          <div className="login-options">
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
            className="login-submit-btn"
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
        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-buttons">
          <Button
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading}
            fullWidth
          >
            Google
          </Button>
        </div>

        {/* Footer - Sign Up Link */}
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
