import { join } from 'path';
import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new NodejsFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, 'lambda-handler', 'hello.js'),
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });
  }
}