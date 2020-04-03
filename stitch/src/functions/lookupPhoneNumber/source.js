exports = phoneNumber => {
  const host = 'lookups.twilio.com';
  const path = `/v1/PhoneNumbers/+57${phoneNumber}?CountryCode=CO`;

  // Context Service Thirty part http
  const request = context.services.get('http');

  // Context Service Values
  const twilioAccountSid = context.values.get('twilioAccountSid');
  const twilioAuthToken = context.values.get('twilioAuthToken');

  // Return an promise
  return request.get({
    scheme: 'https',
    host,
    path,
    username: twilioAccountSid,
    password: twilioAuthToken,
  });
};
