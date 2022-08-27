import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.39.0',
  defaultReleaseBranch: 'master',
  name: 'cdk-ts-pipeline-workshop',
  projenrcTs: true,
  deps: [
    'env-var', 'dotenv',
  ],
});

const dotEnvFile = '.env';
project.gitignore.addPatterns(dotEnvFile);
project.gitignore.addPatterns('node_modules');

project.synth();