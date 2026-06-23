/**
 * Input validation utilities for security and data integrity
 */

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates email format and length
 * @param {string} email - Email to validate
 * @returns {object} - { valid: boolean, error?: string }
 */
export function validateEmail(email) {
  if (typeof email !== "string") {
    return { valid: false, error: "Email must be a string" };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { valid: false, error: "Email is required" };
  }

  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, error?: string }
 */
export function validatePassword(password) {
  if (typeof password !== "string") {
    return { valid: false, error: "Password must be a string" };
  }

  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be less than ${MAX_PASSWORD_LENGTH} characters` };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" };
  }

  return { valid: true };
}

/**
 * Sanitizes string input by trimming whitespace and removing dangerous characters
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeString(input) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Sanitizes email by converting to lowercase and trimming
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(email) {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

/**
 * Validates and sanitizes registration input
 * @param {object} input - { email, password }
 * @returns {object} - { valid: boolean, error?: string, data?: { email, password } }
 */
export function validateRegistration(input) {
  const { email, password } = input || {};

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { valid: false, error: emailValidation.error };
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { valid: false, error: passwordValidation.error };
  }

  return {
    valid: true,
    data: {
      email: sanitizeEmail(email),
      password: password // Don't sanitize password (it's hashed anyway)
    }
  };
}

/**
 * Validates and sanitizes login input
 * @param {object} input - { email, password }
 * @returns {object} - { valid: boolean, error?: string, data?: { email, password } }
 */
export function validateLogin(input) {
  const { email, password } = input || {};

  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }

  if (email.trim().length === 0) {
    return { valid: false, error: "Email cannot be empty" };
  }

  if (password.length === 0) {
    return { valid: false, error: "Password cannot be empty" };
  }

  return {
    valid: true,
    data: {
      email: sanitizeEmail(email),
      password: password // Password is used as-is for comparison
    }
  };
}

/**
 * Validates numeric balance values
 * @param {any} balance - Balance value to validate
 * @returns {object} - { valid: boolean, error?: string }
 */
export function validateBalance(balance) {
  const num = Number(balance);

  if (isNaN(num)) {
    return { valid: false, error: "Balance must be a number" };
  }

  if (num < 0) {
    return { valid: false, error: "Balance cannot be negative" };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: "Balance must be an integer" };
  }

  if (num > 999999999) {
    return { valid: false, error: "Balance is too large" };
  }

  return { valid: true, value: num };
}
