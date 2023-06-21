import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface HitCounterProps {
    // defines downstream property as lambda IFunction
    downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
    
    public readonly handler: lambda.Function;
    
    public readonly table: dynamodb.Table;

    constructor(scope: Construct, id: string, props: HitCounterProps){
        super(scope, id);
        
        const table=new dynamodb.Table(this, 'Hits', {
            partitionKey: {name: 'path', type: dynamodb.AttributeType.STRING}
        });
        this.table = table;

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
           runtime: lambda.Runtime.NODEJS_14_X,
           handler: 'hitcounter.handler',
           code: lambda.Code.fromAsset('lambda'),
           environment: {
            DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
            HITS_TABLE_NAME: table.tableName
           } 
        })
    //permissions for lambda to update dynamoDB
    table.grantReadWriteData(this.handler);

    //grant lambda role invoke for downstream
    props.downstream.grantInvoke(this.handler)
    }
}

