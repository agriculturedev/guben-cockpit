import { RawProject } from "../types/RawProject";

export class Project {
  id: string;
  catid: string;
  title: string;
  alias: string;
  introtext: string;
  fulltext: string;
  created: Date;
  publish_up: Date;
  publish_down: Date;
  image_caption: string;
  image_credits: string;
  image_url: string;

  constructor(project: RawProject) {
    this.id = project.id;
    this.catid = project.catid;
    this.title = project.title;
    this.alias = project.alias;
    this.introtext = project.introtext;
    this.fulltext = project.fulltext;
    this.created = new Date(project.created);
    this.publish_up = new Date(project.publish_up);
    this.publish_down = new Date(project.publish_down);
    this.image_caption = project.image_caption;
    this.image_credits = project.image_credits;
    this.image_url = project.image_url;

  }
}
