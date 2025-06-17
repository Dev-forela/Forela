import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';
import forelaLogo from '../../assets/images/forela-logo.png';

interface BasicFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ConditionData {
  conditions: string[];
}

interface HelpData {
  helpAreas: string[];
}

const initialBasicData: BasicFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const conditionOptions = [
  'Hashimoto\'s',
  'Endometriosis',
  'Adenomyosis',
  'Other Autoimmune'
];

const helpOptions = [
  'Physical conditions',
  'Mental health',
  'Other',
  'Meal planning',
  'Care management',
  'Sleep issues',
  'Lower abdomen pains',
  'Body regulation',
  'Time management'
];

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [basicData, setBasicData] = useState<BasicFormData>(initialBasicData);
  const [conditionData, setConditionData] = useState<ConditionData>({ conditions: [] });
  const [helpData, setHelpData] = useState<HelpData>({ helpAreas: [] });
  const [errors, setErrors] = useState<Partial<BasicFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  // Initialize animation variables
  useEffect(() => {
    document.documentElement.style.setProperty('--hue-rotate', `${Math.random() * 360}deg`);
    document.documentElement.style.setProperty('--pos-offset', Math.random().toString());
  }, []);

  const validateBasicForm = (): boolean => {
    const newErrors: Partial<BasicFormData> = {};
    const today = new Date();
    const birthDate = new Date(basicData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (!basicData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!basicData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!basicData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    if (!basicData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(basicData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!basicData.password) {
      newErrors.password = 'Password is required';
    } else if (basicData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (basicData.password !== basicData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateBasicForm()) {
      setStep(2);
    }
  };

  const handleConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conditionData.conditions.length > 0) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (helpData.helpAreas.length === 0) return;

    setIsLoading(true);
    setGeneralError('');
    
    try {
      await signUp(basicData.email, basicData.password, {
        firstName: basicData.firstName,
        middleName: basicData.middleName || undefined,
        lastName: basicData.lastName,
        dateOfBirth: basicData.dateOfBirth,
        primaryCondition: conditionData.conditions[0] as any,
        conditions: conditionData.conditions,
        helpAreas: helpData.helpAreas,
      });
      setStep(4);
      // Auto close after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      if (error.message) {
        setGeneralError(error.message);
      } else {
        setGeneralError('An unexpected error occurred during sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicData(prev => ({ ...prev, [name]: value }));
    
    if (generalError) {
      setGeneralError('');
    }
  };

  const toggleCondition = (condition: string) => {
    setConditionData(prev => ({
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const toggleHelpArea = (helpArea: string) => {
    setHelpData(prev => ({
      helpAreas: prev.helpAreas.includes(helpArea)
        ? prev.helpAreas.filter(h => h !== helpArea)
        : [...prev.helpAreas, helpArea]
    }));
  };

  const renderStep1 = () => (
    <form onSubmit={handleBasicFormSubmit} className={styles.authForm}>
      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name *</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={basicData.firstName}
          onChange={handleBasicChange}
          className={errors.firstName ? styles.error : ''}
          placeholder="Enter your first name"
        />
        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="middleName">Middle Name</label>
        <input
          type="text"
          id="middleName"
          name="middleName"
          value={basicData.middleName}
          onChange={handleBasicChange}
          placeholder="Enter your middle name (optional)"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name *</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={basicData.lastName}
          onChange={handleBasicChange}
          className={errors.lastName ? styles.error : ''}
          placeholder="Enter your last name"
        />
        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={basicData.dateOfBirth}
          onChange={handleBasicChange}
          className={errors.dateOfBirth ? styles.error : ''}
        />
        {errors.dateOfBirth && <span className={styles.errorText}>{errors.dateOfBirth}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={basicData.email}
          onChange={handleBasicChange}
          className={errors.email ? styles.error : ''}
          placeholder="Enter your email"
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={basicData.password}
          onChange={handleBasicChange}
          className={errors.password ? styles.error : ''}
          placeholder="Enter your password (min 8 characters)"
        />
        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={basicData.confirmPassword}
          onChange={handleBasicChange}
          className={errors.confirmPassword ? styles.error : ''}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Continue
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleConditionSubmit} className={styles.authForm}>
      <h2 style={{ marginBottom: '1rem', color: '#311D00' }}>What brings you to Forela?</h2>
      <p style={{ marginBottom: '1.5rem', color: '#6F5E53' }}>Select all that apply:</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {conditionOptions.map((condition) => (
          <label
            key={condition}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              border: `2px solid ${conditionData.conditions.includes(condition) ? '#A36456' : '#D9CFC2'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: conditionData.conditions.includes(condition) ? '#F5E9E2' : '#fff',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              checked={conditionData.conditions.includes(condition)}
              onChange={() => toggleCondition(condition)}
              style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
            />
            <span style={{ fontWeight: 500, color: '#311D00' }}>{condition}</span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #D9CFC2',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#6F5E53',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={conditionData.conditions.length === 0}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: conditionData.conditions.length > 0 ? '#A36456' : '#D9CFC2',
            color: '#fff',
            fontWeight: 600,
            cursor: conditionData.conditions.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Next
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleFinalSubmit} className={styles.authForm}>
      <h2 style={{ marginBottom: '1rem', color: '#311D00' }}>What are you looking for help with?</h2>
      <p style={{ marginBottom: '1.5rem', color: '#6F5E53' }}>Select all that apply:</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {helpOptions.map((helpArea) => (
          <label
            key={helpArea}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              border: `2px solid ${helpData.helpAreas.includes(helpArea) ? '#A36456' : '#D9CFC2'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: helpData.helpAreas.includes(helpArea) ? '#F5E9E2' : '#fff',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              checked={helpData.helpAreas.includes(helpArea)}
              onChange={() => toggleHelpArea(helpArea)}
              style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
            />
            <span style={{ fontWeight: 500, color: '#311D00' }}>{helpArea}</span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="button"
          onClick={() => setStep(2)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #D9CFC2',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#6F5E53',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={helpData.helpAreas.length === 0 || isLoading}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: helpData.helpAreas.length > 0 && !isLoading ? '#A36456' : '#D9CFC2',
            color: '#fff',
            fontWeight: 600,
            cursor: helpData.helpAreas.length > 0 && !isLoading ? 'pointer' : 'not-allowed'
          }}
        >
          {isLoading ? 'Creating Account...' : 'Finish'}
        </button>
      </div>
    </form>
  );

  const renderStep4 = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ 
        backgroundColor: '#F5E9E2', 
        border: '2px solid #A36456', 
        borderRadius: '12px', 
        padding: '2rem',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#311D00', marginBottom: '1rem' }}>Thanks for signing up for Forela!</h2>
        <p style={{ color: '#6F5E53', lineHeight: 1.6 }}>
          You should receive a confirmation email in the next few minutes. 
          Please contact <strong>hello@forela.health</strong> if you experience any issues.
        </p>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#A36456' }}>
        Redirecting you to your profile...
      </p>
    </div>
  );

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.logoContainer}>
          <img 
            src={forelaLogo} 
            alt="Forela Logo" 
            className={styles.logo}
          />
        </div>
        
        <h1>
          {step === 1 && 'Create Your Account'}
          {step === 2 && 'Tell Us About You'}
          {step === 3 && 'How Can We Help?'}
          {step === 4 && 'Welcome to Forela!'}
        </h1>
        
        {generalError && (
          <div className={styles.generalError}>
            {generalError}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {step < 4 && (
          <div className={styles.authToggle}>
            <p>Already have an account?</p>
            <Link to="/signin" className={styles.authToggleLink}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp; 