import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  gubenProd: {
    from: {
      relativePath:
        "../strapi/src/extensions/documentation/documentation/1.0.0/full_documentation.json",
      source: "file",
    },
    outputDir: "src/endpoints",
    to: async (context) => {
      const filenamePrefix = "gubenProd";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
