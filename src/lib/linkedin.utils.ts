export const getLinkedinProfileUrlFromHash = (hash?: string) => {
  if (hash) {
    return `https://linkedin.com/in/${hash}`;
  }
  return 'https://linkedin.com';
};


export const getSalesNavProfileUrlFromHash = (hash?: string) => {
  if (hash) {
    return ` https://www.linkedin.com/sales/lead/${hash}`
  }
  return 'https://www.linkedin.com/sales/lead';
}

export const getLinkedinCompanyUrlFromUniversalName = (
  universalName?: string
) => {
  if (!universalName) {
    return undefined;
  }
  return `https://linkedin.com/company/${universalName}`;
};
