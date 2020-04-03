/*global context*/

exports = (phoneNumber) => {
  const mongoDBAtlas = context.services.get('mongodb-atlas');
  const AWSLambda = context.services.get('aws').lambda('us-east-1');

  // Generate a 6-digit 2fa code
  // const token = await AWSLambda.Invoke({
  //   FunctionName: 'create_token',
  // });

  return context.functions
    .execute('lookupPhoneNumber', phoneNumber)
    .then((response) => {
      return JSON.parse(response.body.text().phone_number);
    })
    .then((phoneNumber) => {
      return AWSLambda.Invoke({
        FunctionName: 'TwoFactorAuthCode',
      }).then();
    })
    .then()
    .catch();

  // try {
  //   const formatPhoneNumber = await context.functions
  //   .execute('lookupPhoneNumber', phoneNumber)
  //   .then((response) => {
  //     return EJSON.parse(response.body.text().phone_number);
  //   });
  // } catch (err) {

  // }

  // Update or insert the document for the submitted phone number.
  // The document has information on the most recent 2fa code for a
  // phone number, including when the code was generated.
  // const twoFa = mongoDbAtlas.db('fruver').collection('2FA');
  // const doc = await twoFa.updateOne(
  //   { phoneNumber: phoneNumber },
  //   { $set: { phoneNumber, token } },
  // );

  // return formatNumber(phoneNumber)
  //   .then(formattedNumber => {
  //     finalNumber = formattedNumber;
  //   })
  //   .then(() => {
  //     return createToken;
  //   })
  //   .then(code => {
  //     return linkCodeWithPhoneNumber(code, finalNumber);
  //   });

  // function linkCodeWithPhoneNumber(code, phoneNumber) {
  //   // Update or insert the document for the submitted phone number.
  //   // The document has information on the most recent 2fa code for a
  //   // phone number, including when the code was generated.
  //   const atlas = context.services.get("mongodb-atlas");
  //   const twoFactorCodes = atlas.db("fruver").collection("2FA");

  //   return twoFactorCodes.updateOne(
  //     { phoneNumber: phoneNumber },
  //     { $set: { code: code, time: Date.now() } },
  //     { upsert: true }
  //   );
  // }

  // const createToken = async () => {
  //   // Generate a 6-digit 2fa code
  //   const AWSLambda = context.services.get("aws").lambda("us-east-1");
  //   const result = await AWSLambda.Invoce({ FunctionName: "create_token" });
  //   console.log(result.Payload.text());
  // };
};
