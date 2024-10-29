import { BrandenburgEvents, RawEvent } from "./types/events";
import { Event } from "./classes/Event";
import { ca } from 'date-fns/locale';
const { XMLParser } = require("fast-xml-parser");

export class EventImporter {
  _strapi: any;
  _startTime = null;
  _endTime = null;
  _parser = new XMLParser();

  constructor(strapi) {
    console.log("Starting Event importer...");
    this._startTime = new Date();
    this._strapi = strapi;
    this.run();
  }

  get strapi() {
    return this._strapi;
  }

  async run() {
    const response = await fetch("https://eingabe.events-in-brandenburg.de/exportdata/tmbevents_custom_stadtguben.xml");
    const data = await response.text();
    const xml = this._parser.parse(data).brandenburgevents as BrandenburgEvents;
    console.log(`Importing ${xml.count} events...`);

    for (const event of xml.EVENT) {
      await this.saveEvent(event);
    }
    this._endTime = new Date();
    console.log(`Import finished in ${this._endTime - this._startTime}ms`);
  }

  async getCategoryIds (event: Event) {
    let categoriesIds = [];
    // create an array of ids with the ids of the categories that exist. else create them

    for (const eventCategory of event.categories) {
      if (eventCategory.name.DE) {
        let categoryExists = await this.strapi.db.query('api::category.category').findOne({
          where: {
            Name: eventCategory.name.DE
          }
        });

        if (categoryExists === null) {
          await this.strapi.entityService.create('api::category.category', { data: {
              Name: eventCategory.name.DE
            }});
          categoryExists = await this.strapi.db.query('api::category.category').findOne({
            where: {
              Name: eventCategory.name.DE
            }
          });
        }

        if (categoryExists) {
          categoriesIds.push(categoryExists.id);
        }
      }
    }
    return categoriesIds;
  }

  async saveEvent(data: RawEvent) {
    const event = new Event(data);
    const eventExists = await this.strapi.db.query('api::event.event').findOne({
      where: {
        E_ID: event.id,
        eventId: event.eventId,
        terminId: event.meetingId
      }
    });

    const eventData = {
      E_ID: event.id,
      eventId: event.eventId,
      terminId: event.meetingId,
      title: event.title.DE,
      description: event.description.DE,
      coords: {
        lat: event.coords.lat,
        lng: event.coords.lng
      },
      startDate: !isNaN(event.von.getTime()) ? event.von.toISOString() : null,
      endDate: !isNaN(event.bis.getTime()) ? event.bis.toISOString() : null,
      imageUrl: event.pictures[0]?.url,
      urls: event.urls.map(u => {
        return { link: u.link, description: u.description.DE }
      }),
      locationCity: event.location.city
      // categories: event.categories.map(c => {
      //   return { id: c.id, newId: c.newId, name: c.name.DE }
      // })
    };



    try {
      let savedEvent;

      if (!eventExists) {
        const categoriesIds = await this.getCategoryIds(event);
        savedEvent = await this.strapi.entityService.create('api::event.event', { data: {...eventData, categories: categoriesIds }});
      } else {
        const categoriesIds = await this.getCategoryIds(event);
        savedEvent = await this.strapi.entityService.update('api::event.event', eventExists.id, { data: {...eventData, categories: categoriesIds }});
      }

    } catch (e) {
      console.error(e);
    }
  }
}
