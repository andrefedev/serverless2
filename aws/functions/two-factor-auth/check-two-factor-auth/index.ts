export const handler = async (event: any = {}) => {
  const { countryCode, phoneNumber } = event;
  return phoneNumber;
};
