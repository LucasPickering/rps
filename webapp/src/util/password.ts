const MIN_PASSWORD_LENGTH = 8;

export enum PasswordValidationError {
  DoesNotMatch,
  TooShort,
}

export const validatePassword = (
  password1: string,
  password2: string
): PasswordValidationError | undefined => {
  if (password1 !== password2) {
    return PasswordValidationError.DoesNotMatch;
  }
  if (password1.length < MIN_PASSWORD_LENGTH) {
    return PasswordValidationError.TooShort;
  }
};

export const formatValidationError = (
  error: PasswordValidationError
): string => {
  switch (error) {
    case PasswordValidationError.DoesNotMatch:
      return 'The passwords do not match';
    case PasswordValidationError.TooShort:
      return `The password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
};
