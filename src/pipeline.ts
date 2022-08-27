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

    const developPipeline = genPipeline(this, 'develop');
    developPipeline.addStage(new WorkshopPipelineStage(this, 'DeployDevelop', {
      env: {
        account: this.account,
        region: DEV_REGION
      }
    }));

    const masterPipeline = genPipeline(this, 'master');
    masterPipeline.addStage(new WorkshopPipelineStage(this, 'DeployMaster', {
      env: {
        account: this.account,
        region: PROD_REGION
      }
    }));
  }
}