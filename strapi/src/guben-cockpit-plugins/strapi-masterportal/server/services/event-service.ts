import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getEvents() {
    const data = await strapi.entityService.findMany('api::event.event');

    return {
      "type": "FeatureCollection",
      features: data.map((event) => ({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          // @ts-ignore
          "coordinates": [event.coords.lng, event.coords.lat]
        },
        "properties": event
      }))
    };
  },
});
