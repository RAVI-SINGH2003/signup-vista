/**
 * Signup Page Component
 * Provides user registration with comprehensive validation
 * Includes password strength indicator and confirmation matching
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Google,
  GitHub,
  CheckCircle,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import '../styles/auth.scss';

/**
 * Signup form validation schema
 * Defines comprehensive validation rules for all fields
 */
const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .nonempty('Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z
      .string()
      .trim()
      .nonempty('Email is required')
      .email('Please enter a valid email address')
      .max(255, 'Email must be less than 255 characters'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Calculate password strength
 * @param password - Password string to evaluate
 * @returns Strength level: 'weak', 'medium', or 'strong'
 */
const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (!password) return 'weak';
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

/**
 * Signup Component
 * Handles user registration with validation and password strength checking
 */
const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password field for strength calculation
  const watchPassword = watch('password');

  /**
   * Update password strength indicator on password change
   */
  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(getPasswordStrength(watchPassword));
    }
  }, [watchPassword]);

  /**
   * Handle form submission
   * Validates data and creates new user account
   * @param data - Form data containing user registration information
   */
  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call (replace with actual registration logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Show success state
      setIsSuccess(true);
      
      // Show success message
      toast.success('Account created successfully!', {
        description: 'Welcome aboard! Redirecting to login...',
      });
      
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2500);
      
    } catch (error) {
      // Handle registration errors
      console.error('Signup error:', error);
      toast.error('Registration failed', {
        description: 'Something went wrong. Please try again.',
      });
      setIsLoading(false);
    }
  };

  /**
   * Handle social authentication
   * Placeholder for OAuth integration
   * @param provider - Social authentication provider (google, github)
   */
  const handleSocialSignup = (provider: string) => {
    toast.info(`${provider} signup`, {
      description: 'Social authentication coming soon!',
    });
  };

  // Show success animation if registration completed
  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-animation">
            <div className="success-icon">
              <CheckCircle />
            </div>
            <h2>Account Created!</h2>
            <p>Your account has been successfully created.</p>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header Section */}
        <div className="auth-header">
          <div className="auth-logo">
            <PersonAdd />
          </div>
          <h1>Create Account</h1>
          <p>Join us today and get started</p>
        </div>

        {/* Signup Form */}
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name Input */}
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                type="text"
                variant="outlined"
                fullWidth
                className="auth-input"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                autoComplete="name"
                disabled={isLoading}
              />
            )}
          />

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

          {/* Password Input with Strength Indicator */}
          <div>
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
                  autoComplete="new-password"
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
            
            {/* Password Strength Indicator */}
            {watchPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength}`} />
                </div>
                <span className={`strength-text ${passwordStrength}`}>
                  Password strength: {passwordStrength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                className="auth-input"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>

        {/* Social Signup Buttons */}
        <div className="social-buttons">
          <Button
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialSignup('Google')}
            disabled={isLoading}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            onClick={() => handleSocialSignup('GitHub')}
            disabled={isLoading}
          >
            GitHub
          </Button>
        </div>

        {/* Footer - Login Link */}
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
