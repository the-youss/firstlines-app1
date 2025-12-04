export const getLinkedinProfileUrlFromHash = (hash?: string) => {
  if (hash) {
    return `https://linkedin.com/in/${hash}`;
  }
  return 'https://linkedin.com';
};