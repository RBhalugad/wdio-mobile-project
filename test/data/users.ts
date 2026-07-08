export interface User {
  email: string;
  password: string;
}

export interface EdgeCase {
  email: string;
  password: string;
  expectedError: string;
}

export interface UsersData {
  valid: User;
  invalid: User;
  locked: User;
  edgeCases: EdgeCase[];
}

/**
 * Test data — keep credentials in .env for real projects.
 * Reference via process.env.TEST_USER_EMAIL etc. in CI.
 */
const users: UsersData = {
  valid: {
    email:    process.env.TEST_USER_EMAIL    ?? 'testuser@example.com',
    password: process.env.TEST_USER_PASSWORD ?? 'Password123!',
  },

  invalid: {
    email:    'notauser@example.com',
    password: 'wrongpassword',
  },

  locked: {
    email:    process.env.LOCKED_USER_EMAIL    ?? 'locked@example.com',
    password: process.env.LOCKED_USER_PASSWORD ?? 'Password123!',
  },

  edgeCases: [
    { email: '',                         password: 'Password123!', expectedError: 'Email is required' },
    { email: 'user@example.com',         password: '',             expectedError: 'Password is required' },
    { email: 'notanemail',               password: 'Password123!', expectedError: 'Enter a valid email' },
    { email: `${'a'.repeat(256)}@x.com`, password: 'Password123!', expectedError: 'Email too long' },
  ],
};

export default users;
