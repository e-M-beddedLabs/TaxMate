const TOKEN_KEY = 'taxmate_token';

export const auth = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

// Mock login - simulates API call
export const mockLogin = async (email: string, password: string): Promise<{ access_token: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }
  
  // Return mock token
  return {
    access_token: `mock_token_${Date.now()}_${email.replace('@', '_at_')}`,
  };
};

// Mock register - simulates API call
export const mockRegister = async (
  email: string, 
  password: string, 
  confirmPassword: string
): Promise<{ message: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Validation
  if (!email || !password || !confirmPassword) {
    throw new Error('All fields are required');
  }
  
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  return {
    message: 'Registration successful',
  };
};
