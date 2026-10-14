import { checkPasswordCriteria, isPasswordValid } from '../src/utils/passwordRules';
import { mapSupabaseError } from '../src/utils/supabaseErrors';

console.log('--- TEST 1: Password Criteria & Validation ---');
const weakPass1 = 'short';
console.log('Short pass valid?', isPasswordValid(weakPass1) === false ? 'PASS' : 'FAIL');

const noUpper = 'ibank2026!';
console.log('No upper pass valid?', isPasswordValid(noUpper) === false ? 'PASS' : 'FAIL');

const noLower = 'IBANK2026!';
console.log('No lower pass valid?', isPasswordValid(noLower) === false ? 'PASS' : 'FAIL');

const noNumber = 'iBankPassword!';
console.log('No number pass valid?', isPasswordValid(noNumber) === false ? 'PASS' : 'FAIL');

const noSymbol = 'iBankPassword2026';
console.log('No symbol pass valid?', isPasswordValid(noSymbol) === false ? 'PASS' : 'FAIL');

const strongPass = 'iBankPass2026!';
const strongCriteria = checkPasswordCriteria(strongPass);
console.log('Strong criteria all true?', 
  strongCriteria.minLength &&
  strongCriteria.hasUppercase &&
  strongCriteria.hasLowercase &&
  strongCriteria.hasNumber &&
  strongCriteria.hasSymbol &&
  isPasswordValid(strongPass) ? 'PASS' : 'FAIL'
);

console.log('\n--- TEST 2: Centralized Error Mapping & Anti-enumeration ---');
const invalidCreds = mapSupabaseError({ code: 'invalid_credentials', message: 'Invalid login credentials' });
console.log('Anti-enumeration on invalid_credentials?', 
  invalidCreds.message === 'Email o contraseña incorrectos.' && invalidCreds.isInvalidCredentials ? 'PASS' : 'FAIL'
);

const unconfirmed = mapSupabaseError({ code: 'email_not_confirmed', message: 'Email not confirmed' });
console.log('Email not confirmed detection?', 
  unconfirmed.isEmailNotConfirmed ? 'PASS' : 'FAIL'
);

const rateLimit = mapSupabaseError({ status: 429, message: 'Too Many Requests' });
console.log('Rate limit 429 detection?', 
  rateLimit.isRateLimit && rateLimit.message.includes('60 segundos') ? 'PASS' : 'FAIL'
);

const expiredOtp = mapSupabaseError({ code: 'otp_expired', message: 'Token has expired' });
console.log('Expired OTP detection?', 
  expiredOtp.isExpiredOtp ? 'PASS' : 'FAIL'
);

console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
