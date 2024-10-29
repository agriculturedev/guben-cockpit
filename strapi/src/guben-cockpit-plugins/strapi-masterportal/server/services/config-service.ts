import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getConfig() {
    const data = await strapi.entityService.findOne('api::config.config', 1, {});
    return data.config;
  },
});
