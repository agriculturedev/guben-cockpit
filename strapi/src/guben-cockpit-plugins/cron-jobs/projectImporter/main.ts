import { RawProject } from "./types/RawProject";
import { Project } from "./classes/Project";

export class ProjectImporter {
  _strapi: any;
  _startTime = null;
  _endTime = null;

  constructor(strapi) {
    console.log("Starting project importer...");
    this._startTime = new Date();
    this._strapi = strapi;
    this.run();
  }

  get strapi() {
    return this._strapi;
  }

  async run() {
    // @ts-ignore
    const headers = { 'Authorization': `Bearer ${process.env.GUBEN_ARTICLES_BEARER_TOKEN}` }; // not sure if this is correct, because importer is disabled from now on
    const response = await fetch("https://www.guben.de/index.php?option=com_api&app=guben&resource=articles", {
      method: "GET",
      headers: headers
    });

    const data = await response.json();

    if (data["err_msg"] != "") {
      console.log(data["err_msg"]);
    }

    const projects = data["data"];
    try {
      projects.forEach((project: RawProject) => {
        this.saveProject(new Project(project));
      });
    } catch (e) {
      console.error("Error while saving projects", e);
    }

  }

  async saveProject(project: Project) {
    const projectExists = await this.strapi.db.query('api::project.project').findOne({
      where: {
        projectId: project.id.toString()
      }
    });

    const projectData = {
      projectId: project.id.toString(),
      title: project.title,
      description: project.introtext,
      fullText: project.fulltext,
      imageUrl: project.image_url,
      imageCaption: project.image_caption,
      imageCredits: project.image_credits
    };
    // console.log(projectData);

    try {
      if (!projectExists) {
        await this.strapi.entityService.create('api::project.project', { data: projectData });
      } else {
        await this.strapi.entityService.update('api::project.project', projectExists.id, { data: projectData });
      }

    } catch (e) {
      console.error(e);
    }
  }

}
