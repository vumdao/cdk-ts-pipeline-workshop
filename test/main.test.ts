import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkWorkshopStack } from '../src/workshop';

test('Snapshot', () => {
  const app = new App();
  const stack = new CdkWorkshopStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});