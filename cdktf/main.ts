import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { DataGoogleIamPolicy } from "@cdktf/provider-google/lib/data-google-iam-policy";
import { CloudRunV2ServiceIamPolicy } from "@cdktf/provider-google/lib/cloud-run-v2-service-iam-policy";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      project: "GOOGLE_CLOUD_PROJECT",
    });

    const location = "asia-northeast1";

    new StorageBucket(this, "storage", {
      location,
      name: "web-litestream",
    });

    const image = "IMAGE_TAG";

    const cloudRunService = new CloudRunV2Service(
      this,
      "web-cloud-run-service",
      {
        location,
        name: "web-service",
        template: {
          scaling: {
            maxInstanceCount: 1,
            minInstanceCount: 0,
          },
          containers: [
            {
              ports: [
                {
                  containerPort: 80,
                },
              ],
              image,
            },
          ],
        },
      }
    );

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

    new TerraformOutput(this, "cloud-run-service-fqn", {
      value: cloudRunService.fqn,
    });

    new TerraformOutput(this, "cloud-run-service-uri", {
      value: cloudRunService.uri,
    });
  }
}

const app = new App();
new MyStack(app, "cdktf");
app.synth();
