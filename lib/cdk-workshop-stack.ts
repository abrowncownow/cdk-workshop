import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //lambda function
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,   //environment
      code: lambda.Code.fromAsset('lambda'), //importing code from /lambda
      handler: 'hello.handler'               //file to load
    });

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    });
  }
}