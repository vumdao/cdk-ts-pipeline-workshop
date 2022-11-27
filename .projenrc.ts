import { awscdk } from 'projen';
import { UpdateSnapshot } from 'projen/lib/javascript';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.51.1',
  defaultReleaseBranch: 'master',
  name: 'cdk-ts-pipeline-workshop',
  projenrcTs: true,
  deps: ['env-var', 'dotenv', 'cdk-nag'],
  jestOptions: {
    updateSnapshot: UpdateSnapshot.NEVER,
    jestConfig: {
      moduleNameMapper: {
        ['^aws-cdk-lib/.warnings.jsii.js$']:
          '<rootDir>/node_modules/aws-cdk-lib/.warnings.jsii.js',
      },
    },
  },
});

const dotEnvFile = '.env';
project.gitignore.addPatterns(dotEnvFile);
project.gitignore.addPatterns('node_modules');

project.synth();
