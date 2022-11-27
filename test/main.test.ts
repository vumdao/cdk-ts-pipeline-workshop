import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CDK_DEFAULT_ACCOUNT, DEV_REGION } from '../src/constants';
import { CdkWorkshopStack } from '../src/workshop';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new CdkWorkshopStack(app, 'testingStack', {
    env: {
      account: CDK_DEFAULT_ACCOUNT,
      region: DEV_REGION,
    },
  });
});

test('CDK workshop test Snapshot', async () => {
  const temp = Template.fromStack(stack);
  expect(temp.toJSON()).toMatchSnapshot();
});
