/**
 * Generated by @openapi-codegen
 *
 * @version 1.0.0
 */
export type AddCardToTabQuery = {
  /**
   * @format uuid
   */
  tabId: string;
  title?: string | null;
  description?: string | null;
  button?: UpsertButtonQuery;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type AddCardToTabResponse = Record<string, any>;

export type CategoryResponse = {
  /**
   * @format uuid
   */
  id: string;
  name: string;
};

export type CoordinatesResponse = {
  /**
   * @format double
   */
  latitude?: number;
  /**
   * @format double
   */
  longitude?: number;
} | null;

export type CreateDashboardTabQuery = {
  title: string;
  mapUrl: string;
};

export type CreateDashboardTabResponse = Record<string, any>;

export type CreateEventQuery = {
  eventId: string;
  terminId: string;
  title: string;
  description: string;
  /**
   * @format date-time
   */
  startDate?: string;
  /**
   * @format date-time
   */
  endDate?: string;
  /**
   * @format double
   */
  latitude?: number;
  /**
   * @format double
   */
  longitude?: number;
  urls: CreateUrlQuery[];
  categoryIds: string[];
  /**
   * @format uuid
   */
  locationId?: string;
};

export type CreateEventResponse = Record<string, any>;

export type CreateProjectQuery = {
  title: string;
  description?: string | null;
  fullText?: string | null;
  imageCaption?: string | null;
  imageUrl?: string | null;
  imageCredits?: string | null;
  highlighted?: boolean | null;
};

export type CreateProjectResponse = Record<string, any>;

export type CreateUrlQuery = {
  link: string;
  description: string;
};

export type DashboardTabResponse = {
  /**
   * @format uuid
   */
  id: string;
  title: string;
  /**
   * @format int32
   */
  sequence: number;
  mapUrl: string;
  informationCards?: InformationCardResponse[];
};

export type DataSourceResponse = {
  id: string;
  name: string;
  wms?: SourceResponse;
  wfs?: SourceResponse;
};

export type DeleteCardFromTabResponse = Record<string, any>;

export type DeleteDashboardTabResponse = Record<string, any>;

export type DeleteProjectResponse = Record<string, any>;

export type EventResponse = {
  /**
   * @format uuid
   */
  id: string;
  eventId: string;
  terminId: string;
  title: string;
  description: string;
  /**
   * @format date-time
   */
  startDate: string;
  /**
   * @format date-time
   */
  endDate: string;
  location: LocationResponse;
  coordinates?: CoordinatesResponse;
  urls: UrlResponse[];
  categories: CategoryResponse[];
};

export type GetAllCategoriesResponse = {
  categories: CategoryResponse[];
};

export type GetAllDashboardTabsResponse = {
  tabs?: DashboardTabResponse[];
};

export type GetAllEventsResponse = {
  /**
   * @format int32
   */
  pageNumber: number;
  /**
   * @format int32
   */
  pageSize: number;
  /**
   * @format int32
   */
  totalCount: number;
  /**
   * @format int32
   */
  pageCount: number;
  results: EventResponse[];
};

export type GetAllLocationsResponse = {
  locations: LocationResponse[];
};

export type GetAllPagesResponse = {
  pages: PageResponse[];
};

export type GetAllProjectsResponse = {
  /**
   * @format int32
   */
  pageNumber: number;
  /**
   * @format int32
   */
  pageSize: number;
  /**
   * @format int32
   */
  totalCount: number;
  /**
   * @format int32
   */
  pageCount: number;
  results: ProjectResponse[];
};

export type GetAllUsersResponse = {
  /**
   * @format int32
   */
  pageNumber: number;
  /**
   * @format int32
   */
  pageSize: number;
  /**
   * @format int32
   */
  totalCount: number;
  /**
   * @format int32
   */
  pageCount: number;
  results: UserResponse[];
};

export type GetHighlightedProjectsResponse = {
  projects: ProjectResponse[];
};

export type GetMyProjectsResponse = {
  results: ProjectResponse[];
};

export type GetTopicsResponse = {
  topics: TopicResponse[];
};

export type InformationCardResponse = {
  /**
   * @format uuid
   */
  id: string;
  title?: string | null;
  description?: string | null;
  button?: NullableOfButtonResponse;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type LocationResponse = {
  /**
   * @format uuid
   */
  id: string;
  name: string;
  city?: string | null;
};

export type NullableOfButtonResponse = {
  title: string;
  url: string;
  openInNewTab: boolean;
} | null;

export type PageResponse = {
  id: string;
  title: string;
  description: string;
};

export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  /**
   * @format int32
   */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
};

export type ProjectResponse = {
  id: string;
  title: string;
  description?: string | null;
  fullText?: string | null;
  imageCaption?: string | null;
  imageUrl?: string | null;
  imageCredits?: string | null;
  highlighted?: boolean;
  published?: boolean;
};

export type PublishProjectsQuery = {
  publish?: boolean;
  projectIds: string[];
};

export type PublishProjectsResponse = Record<string, any>;

export type SourceResponse = {
  name: string;
  url: string;
} | null;

export type TopicResponse = {
  id: string;
  name: string;
  dataSources: DataSourceResponse[];
};

export type UpdateCardOnTabQuery = {
  /**
   * @format uuid
   */
  cardId: string;
  /**
   * @format uuid
   */
  tabId: string;
  title?: string | null;
  description?: string | null;
  button?: UpsertButtonQuery;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type UpdateCardOnTabResponse = Record<string, any>;

export type UpdateDashboardTabQuery = {
  /**
   * @format uuid
   */
  id: string;
  title: string;
  mapUrl: string;
};

export type UpdateDashboardTabResponse = Record<string, any>;

export type UpdatePageQuery = {
  id: string;
  title: string;
  description: string;
};

export type UpdatePageResponse = Record<string, any>;

export type UpdateProjectQuery = {
  id?: string | null;
  title: string;
  description?: string | null;
  fullText?: string | null;
  imageCaption?: string | null;
  imageUrl?: string | null;
  imageCredits?: string | null;
  highlighted?: boolean | null;
};

export type UpsertButtonQuery = {
  title: string;
  url: string;
  openInNewTab: boolean;
} | null;

export type UrlResponse = {
  link: string;
  description: string;
};

export type UserResponse = {
  /**
   * @format uuid
   */
  id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
};
