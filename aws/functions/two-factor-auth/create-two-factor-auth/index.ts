import * as AWS from 'aws-sdk';
import * as twilio from 'twilio';
import * as randomize from 'randomatic';

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const handler = async (event: any = {}) => {
  const { countryCode, phoneNumber } = event;

  // create a 6-digit character code
  const code = randomize('0', 6);

  // Format Phone Number (also check if is correct).
  const formatPhoneNumber = await client.lookups
    .phoneNumbers(phoneNumber)
    .fetch({ countryCode })
    .then((response) => response.phoneNumber);

  return client.messages
    .create({
      body: `${code} es tu codigo de verificación de Fruver`,
      from: fromPhoneNumber,
      to: formatPhoneNumber,
    })
    .then((response) => {
      return {
        statusCode: 201,
        body: JSON.stringify({
          sid: response.sid,
          status: response.status,
        }),
      };
    })
    .catch((err) => {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: err,
        }),
      };
    });
};
