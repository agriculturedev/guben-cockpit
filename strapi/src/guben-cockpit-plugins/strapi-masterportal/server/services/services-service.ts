import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getServices() {
    const data = await strapi.entityService.findOne('api::service.service', 1, {});
    return data.services;
  },
});
