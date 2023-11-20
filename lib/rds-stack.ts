import { AmplifyGraphqlApi, AmplifyGraphqlDefinition } from '@aws-amplify/graphql-api-construct';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as rds from 'aws-cdk-lib/aws-rds'
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';

export class RdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromVpcAttributes(this, "Vpc", { vpcId: 'vpc-c359a0be', availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d', 'us-east-1e', 'us-east-1f'] })

    const securityGroup = SecurityGroup.fromSecurityGroupId(this, "SecurityGroup", "sg-080b2234")

    const amplifyApi = new AmplifyGraphqlApi(this, "AmplifyApi", {
      definition: AmplifyGraphqlDefinition.fromFilesAndStrategy(
        path.join(__dirname, "schema.graphql"),
        {
          dbType: 'MYSQL',
          name: 'MySQLSchemaDefinition',
          dbConnectionConfig: {
            databaseNameSsmPath: '/amplify/d29pp9vnfs5qzj/dev/AMPLIFY_apiaurora1240rds10schema_database',
            hostnameSsmPath: '/amplify/d29pp9vnfs5qzj/dev/AMPLIFY_apiaurora1240rds10schema_host',
            passwordSsmPath: '/amplify/d29pp9vnfs5qzj/dev/AMPLIFY_apiaurora1240rds10schema_password',
            portSsmPath: '/amplify/d29pp9vnfs5qzj/dev/AMPLIFY_apiaurora1240rds10schema_port',
            usernameSsmPath: '/amplify/d29pp9vnfs5qzj/dev/AMPLIFY_apiaurora1240rds10schema_username',
          } ,
          vpcConfiguration: {
            securityGroupIds: [securityGroup.securityGroupId],
            vpcId: vpc.vpcId,
            subnetAvailabilityZoneConfig: vpc.privateSubnets.map(subnet => ({ subnetId: subnet.subnetId, availabilityZone: subnet.availabilityZone }))
          }
        }
      ),
      authorizationModes: {
        defaultAuthorizationMode: 'API_KEY',
        apiKeyConfig: {
          expires: cdk.Duration.days(30)
        }
      }
    })
  }
}
