import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

const twilioEnv = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
};

export class TwoFactorAuthStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Capas
    const twilioLambdaLayer = new lambda.LayerVersion(this, 'twilioNodeLibrary', {
      code: lambda.Code.fromAsset('packages/twilio'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
      description: 'Twilio Node Library',
    });

    const randomaticLambdaLayer = new lambda.LayerVersion(this, 'randomaticNodeLibrary', {
      code: lambda.Code.fromAsset('packages/randomatic'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
      description: 'Randomatic Node Library',
    });

    // DynamoDB
    const table = new dynamodb.Table(this, 'twoFactorAuth', {
      partitionKey: { name: 'phoneNumber', type: dynamodb.AttributeType.STRING },
    });

    const createTwoFactorAuthLambda = new lambda.Function(this, 'createTwoFactorAuthFn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('functions/two-factor-auth/create-two-factor-auth'),
      layers: [twilioLambdaLayer, randomaticLambdaLayer],
      environment: { ...twilioEnv },
    });

    const checkTwoFactorAuthLambda = new lambda.Function(this, 'checkTwoFactorAuthFn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('functions/two-factor-auth/check-two-factor-auth'),
      layers: [twilioLambdaLayer],
      environment: { ...twilioEnv },
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: createTwoFactorAuthLambda,
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(createTwoFactorAuthLambda);
    table.grantReadWriteData(checkTwoFactorAuthLambda);
  }
}
