export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export const checkPasswordCriteria = (password: string = ''): PasswordCriteria => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
};

export const isPasswordValid = (password: string = ''): boolean => {
  const criteria = checkPasswordCriteria(password);
  return (
    criteria.minLength &&
    criteria.hasUppercase &&
    criteria.hasLowercase &&
    criteria.hasNumber &&
    criteria.hasSymbol
  );
};
