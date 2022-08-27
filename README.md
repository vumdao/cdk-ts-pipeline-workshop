<p align="center">
  <a href="https://dev.to/vumdao">
    <img alt="CDK Typescript Pipeline Workshop" src="images/cover.png" width="700" />
  </a>
</p>
<h1 align="center">
  <div><b>CDK Typescript Pipeline Workshop</b></div>
</h1>

## Abstract
- [AWS CDK (Cloud Development Kit)](https://aws.amazon.com/cdk/) is an open-source framework which gives great depth to the concept of Infrastructure as Code
- So Why CDK Pipelines? - We need the automation way to deploy our infrastructure as code for development, staging and production stages.
- CDK pipeline with AWS Codepipeline brings to the table a feature called self mutation or self updation. This means whenever changes are pushed from a CDK project configured with CDK Pipelines, it first checks for any changes made to the pipeline itself. If there are no changes to the pipeline, it goes ahead and deploys the actual infrastructure stack.
- In this blog, I reference to cdk pipeline typescript workshop to provide the full flow and source code as a cdk pipeline project.

## Table Of Contents
 * [Pre-requisite](#Pre-requisite)
 * [Create repository and pipeline on AWS codecommit](#Create-repository-and-pipeline-on-AWS-codecommit)
 * [Add pipeline stages to deploy CDK stacks](#Add-pipeline-stages-to-deploy-CDK-stacks)
 * [Push code to test pipelines](#Push-code-to-test-pipelines)
 * [Conclusion](#Conclusion)

---

## 🚀 **Pre-requisite** <a name="Pre-requisite"></a>
- Install typescript, node, and aws0 as well as projen (optional) which is a tool of managing project configuration as code.
- [Getting started with aws-cdk](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

## 🚀 **Create repository and pipeline on AWS codecommit** <a name="Create-repository-and-pipeline-on-AWS-codecommit"></a>
- We create infrastruture as code and build pipeline for it, so we need to create repository and then define the pipeline. So we create them manually using `cdk deploy`
- Following source code creates a repository and a pipeline function to create pipeline base on input branch.
  ```
  import { Stack, StackProps } from 'aws-cdk-lib';
  import { Repository } from 'aws-cdk-lib/aws-codecommit';
  import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
  import { Construct } from 'constructs';
  import { DEV_REGION, PROD_REGION } from './constants';
  import { WorkshopPipelineStage } from './pipeline-stage';

  export class CdkPipelineTest extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
      super(scope, id, props);

      const repo = new Repository(this, 'workshop-cdk-pipeline-repo', {
        description: 'Test CDK pipeline',
        repositoryName: 'cdk-pipeline-test',
      });

      const genPipeline = function(_scope: Construct, branch: string) {
        const _pipeline = new CodePipeline(_scope, `workshop-cdk-pipeline-${branch}`, {
          pipelineName: `workshop-cdk-pipeline-${branch}`,
          synth: new CodeBuildStep('SynthStep', {
            input: CodePipelineSource.codeCommit(repo, branch),
            installCommands: ['npm install -g aws-cdk'],
            commands: [
              'yarn install --frozen-lockfile',
              'npx projen build',
              'npx projen synth',
            ],
          }),
        });
        return _pipeline
      }
    }
  }
  ```

- Run `cdk deploy` to create reposity

  <img src=images/init-repo.png width=1100>

## 🚀 **Add pipeline stages to deploy CDK stacks** <a name="Add-pipeline-stages-to-deploy-CDK-stacks"></a>
- We create pipeline for `master` and `develop` branches. `master` branch represent for product environment which is deployed on region `ap-southeast-1` and `develop` branch represents for development/test environment which is deployed on region `ap-south-1`.
- And note that, we use Dev/test environment to host the codecommit and pipeline (it's up to you to decide this).
  ```
  const developPipeline = genPipeline(this, 'HitCounterHandler` evelop');
  const masterPipeline = genPipeline(this, 'master');
  ```

- From the pipeline we add stages which is our application stacks
  ```
  developPipeline.addStage(new WorkshopPipelineStage(this, 'Deploy', {
    env: {
      account: this.account,
      region: DEV_REGION
    }
  }));

  masterPipeline.addStage(new WorkshopPipelineStage(this, 'DeploySin', {
    env: {
      account: this.account,
      region: PROD_REGION
    }
  }));
  ```

  <img src=images/pipeline-stacks.png width=1100>

- The application stacks here is the CDK Workshop which includes
  - API GW (REST API) to handle api request with lambda integration.
  - The lambda function `HitCounterHandler` counts the API hits and stores them in dynamoDB and then call the `HelloHandler` lambda function to return output which is `string` text.

  <img src=images/app-stacks.png width=1100>

- Run `cdk deploy` again to add the pipelines.

  <img src=images/init-pipeline.png width=1100>

## 🚀 **Push code to test pipelines** <a name="Push-code-to-test-pipelines"></a>
- We now already have repository and pipeline, next steps we add `git remote origin` as our codecommit repo and then push code to `master` / `develop` branch in order to let the pipeline deploy the CDK application stacks.
- Add remote origin
  ```
  git remote add origin ssh://git-codecommit.ap-southeast-1.amazonaws.com/v1/repos/cdk-pipeline-test

## 🚀 **Build Kyverno policy from code** <a name="Build-Kyverno-policy-from-code"></a>
- Source code:
  ```
  ⚡ $ tree src/
  src/
  ├── imports
  │   └── kyverno.io.ts
  ├── kyverno-policies
  │   ├── deny-delete-resources.ts
  │   ├── kverno-list.ts
  │   ├── kyvernoProps.ts
  │   ├── require-app-labels.ts
  │   ├── require-requests-limits.ts
  │   └── require-runasnonroot.ts
  ├── main.ts
  └── test-yaml
      ├── inflate-negative-test-deployment.yaml
      └── inflate-positive-test-deployment.yaml

  3 directories, 10 files
  ```

- Build
  ```
  ⚡ $ npx projen build
  👾 build » default | ts-node --project tsconfig.dev.json .projenrc.ts
  👾 build » compile | tsc --build
  👾 build » post-compile » synth | cdk8s synth
  No manifests synthesized
  👾 build » test | jest --passWithNoTests --all --updateSnapshot
  No tests found, exiting with code 0
  ----------|---------|----------|---------|---------|-------------------
  File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
  ----------|---------|----------|---------|---------|-------------------
  All files |       0 |        0 |       0 |       0 |
  ----------|---------|----------|---------|---------|-------------------
  👾 build » test » eslint | eslint --ext .ts,.tsx --fix --no-error-on-unmatched-pattern src test build-tools projenrc .projenrc.ts
  ```

- Output yaml files
  ```
  ⚡ $ tree dist/
  dist/
  └── kyverno
      ├── require-app-label-kyverno-policy.yaml
      ├── require-request-limit-kyverno-policy.yaml
      └── run-as-non-root-kyverno-policy.yaml

  1 directory, 3 files
  ```

## 🚀 **Apply and test** <a name="Apply-and-test"></a>
- Apply policies and check result
  ```
  ⚡ $ kubectl apply -f dist/kyverno/
  clusterpolicy.kyverno.io/require-app-label configured
  clusterpolicy.kyverno.io/require-request-limit configured
  clusterpolicy.kyverno.io/run-as-non-root configured
  ```

- Test negative, the deployment `inflate-negative-test-deployment.yaml` does not have resource limit and request and enable `runAsNonRoot`
  ```
  ⚡ $ kubectl apply -f src/test-yaml/inflate-negative-test-deployment.yaml
  Error from server: error when creating "src/test-yaml/inflate-negative-test-deployment.yaml": admission webhook "validate.kyverno.svc-fail" denied the request:

  policy Deployment/default/inflate-negative-test for resource violations:

  require-app-label: {}
  require-request-limit:
    autogen-require-request-limit: 'validation error: All containers must have CPU and
      memory resource requests and limits defined. rule autogen-require-request-limit
      failed at path /spec/template/spec/containers/0/resources/limits/'
  ```

- Test positive
  ```
  kubectl apply -f src/test-yaml/inflate-positive-test-deployment.yaml
  deployment.apps/inflate-positive-test created
  ```

- Test without non-root user enabled, because the validation failure action is `AUDIT` so the deployment is applied successfully
  ```
  ⚡ $ kubectl apply -f src/test-yaml/inflate-without-nonroot-test-deployment.yaml
  deployment.apps/inflate-without-nonroot-test created
  ```

- But let's view the policy violations
  ```
  ⚡ $ kubectl describe polr polr-ns-default | grep inflate -A15 -B10| grep "Result: \+fail" -B10
      Seconds:  1661326749
    Category:   Pod Security Standards
    Message:    validation error: Containers must be required to run as non-root users. This policy ensures runAsNonRoot is set to true. rule autogen-run-as-non-root[0] failed at path /spec/template/spec/securityContext/runAsNonRoot/ rule autogen-run-as-non-root[1] failed at path /spec/template/spec/containers/0/securityContext/
    Policy:     run-as-non-root
    Resources:
      API Version:  apps/v1
      Kind:         Deployment
      Name:         inflate-without-nonroot-test
      Namespace:    default
      UID:          b05068c1-425c-41f4-ae0f-c913100a1c9c
    Result:         fail
  ```

## 🚀 Conclusion <a name="Conclusion"></a>
- Someone said `Kyverno policy as code` but the code in yaml language, it's not actual programming language.
- Using CDK8S to generate Kyverno policy help to leverage the strong programming skill of developer and structure project more efficiently.

---

<h3 align="center">
  <a href="https://dev.to/vumdao">:stars: Blog</a>
  <span> · </span>
  <a href="https://github.com/vumdao/kyverno-policy-as-code-with-cdk8s/">Github</a>
  <span> · </span>
  <a href="https://stackoverflow.com/users/11430272/vumdao">stackoverflow</a>
  <span> · </span>
  <a href="https://www.linkedin.com/in/vu-dao-9280ab43/">Linkedin</a>
  <span> · </span>
  <a href="https://www.linkedin.com/groups/12488649/">Group</a>
  <span> · </span>
  <a href="https://www.facebook.com/CloudOpz-104917804863956">Page</a>
  <span> · </span>
  <a href="https://twitter.com/VuDao81124667">Twitter :stars:</a>
</h3>
