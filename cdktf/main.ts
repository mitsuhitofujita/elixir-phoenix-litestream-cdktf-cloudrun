import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, GcsBackend } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { DataGoogleIamPolicy } from "@cdktf/provider-google/lib/data-google-iam-policy";
import { CloudRunV2ServiceIamPolicy } from "@cdktf/provider-google/lib/cloud-run-v2-service-iam-policy";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const backendBucket = process.env.CDKTF_BACKEND_BUCKET;

    new GcsBackend(this, {
      bucket: backendBucket,
    });

    const project = process.env.GOOGLE_CLOUD_PROJECT;

    new GoogleProvider(this, "google", {
      project,
    });

    const location = process.env.CDKTF_LOCATION;
    const prefix = process.env.CDKTF_PREFIX;
    const environment = process.env.CDKTF_ENVIRONMENT;
    const image = `${location}-docker.pkg.dev/${project}/web-docker/${environment}:1`;

    const cloudRunServiceName = `${prefix}-web-${environment}`;
    const cloudRunService = new CloudRunV2Service(this, cloudRunServiceName, {
      location,
      name: cloudRunServiceName,
      template: {
        scaling: {
          maxInstanceCount: 1,
          minInstanceCount: 0,
        },
        containers: [
          {
            ports: [
              {
                containerPort: 4000,
              },
            ],
            image,
            env: [
              {
                name: "SECRET_KEY_BASE",
                value: process.env.PHOENIX_SECRET_KEY_BASE,
              },
              {
                name: "DATABASE_PATH",
                value: process.env.PHOENIX_DATABASE_PATH,
              },
              {
                name: "LITESTREAM_DATABASE_PATH",
                value: process.env.LITESTREAM_DATABASE_PATH,
              },
              {
                name: "LITESTREAM_REPLICA_URL",
                value: process.env.LITESTREAM_REPLICA_URL,
              },
            ],
          },
        ],
      },
    });

    const policyData = new DataGoogleIamPolicy(this, "web-policy", {
      binding: [
        {
          role: "roles/run.invoker",
          members: ["allUsers"],
        },
      ],
    });

    new CloudRunV2ServiceIamPolicy(this, "web-cloud-run-service-policy", {
      location,
      project: cloudRunService.project,
      name: cloudRunService.name,
      policyData: policyData.policyData,
    });

    new TerraformOutput(this, "web-cloud-run-service-fqn", {
      value: cloudRunService.fqn,
    });

    new TerraformOutput(this, "web-cloud-run-service-uri", {
      value: cloudRunService.uri,
    });
  }
}

const app = new App();
new MyStack(app, "cdktf");
app.synth();
