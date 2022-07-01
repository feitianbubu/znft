export const ellipsisAddress = (address?: string) => {
  if (address) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  } else {
    return '';
  }
};
