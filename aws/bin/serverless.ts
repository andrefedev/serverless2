#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { TwoFactorAuthStack } from '../lib/serverless-stack';

const app = new cdk.App();
new TwoFactorAuthStack(app, 'TwoFactorAuthStack');
