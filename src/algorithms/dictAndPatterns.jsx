// A lean list of extremely common weak passwords
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', '123456789', '12345', '1234',
  'qwerty', 'admin', 'welcome', 'monkey', 'dragon', 'password1',
  'letmein', 'trustno1', 'iloveyou', 'sunshine', 'princess', 'football'
];

export const checkDictionaryAndPatterns = (password) => {
  if (!password) return { score: 0, status: 'Empty' };

  const lowerPass = password.toLowerCase();

  // 1. Check exact match in common weak passwords
  if (COMMON_PASSWORDS.includes(lowerPass)) {
    return { score: 0, status: 'Found in common weak password lists' };
  }

  // 2. Check for sequential keyboard patterns (e.g., "12345" or "abcd")
  const hasSequence = /(?:123|234|345|456|567|678|789|abc|bcd|cde|def|qwe|asd|zxc)/i.test(lowerPass);
  if (hasSequence && password.length < 10) {
    return { score: 40, status: 'Contains a predictable keyboard pattern' };
  }

  // 3. Check for repeated identical characters (e.g., "aaaaaa")
  const hasRepeats = /(.)\1{3,}/.test(password);
  if (hasRepeats) {
    return { score: 30, status: 'Contains excessive repeating characters' };
  }

  // If it passes these checks, return a clean score
  return { score: 100, status: 'No common dictionary words or patterns found' };
};