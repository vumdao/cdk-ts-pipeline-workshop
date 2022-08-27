import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkWorkshopStack } from './workshop';

export class WorkshopPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new CdkWorkshopStack(this, 'WebService', {
      env: props?.env,
    });
  }
}
