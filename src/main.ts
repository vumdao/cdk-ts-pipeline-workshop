import { App } from 'aws-cdk-lib';
import { CDK_DEFAULT_ACCOUNT, DEV_REGION } from './constants';
import { CdkPipelineTest } from './pipeline';

const app = new App();

new CdkPipelineTest(app, 'CdkPipelineTest', {
  env: {
    account: CDK_DEFAULT_ACCOUNT,
    region: DEV_REGION
  }
});

app.synth();