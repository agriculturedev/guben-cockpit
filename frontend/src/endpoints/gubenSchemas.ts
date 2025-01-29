/**
 * Generated by @openapi-codegen
 *
 * @version 1.0.0
 */
export enum EventSortOption {
  Title = "Title",
  StartDate = "StartDate",
}

export enum SortDirection {
  Ascending = "Ascending",
  Descending = "Descending",
}

export type ButtonResponse = {
  title?: string;
  url?: string;
  openInNewTab?: boolean;
} | null;

export type CategoryResponse = {
  name: string;
  /**
   * @format uuid
   */
  id: string;
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

export type CreateProjectCommand = {
  title: string;
  description?: string | null;
  fullText?: string | null;
  imageCaption?: string | null;
  imageUrl?: string | null;
  imageCredits?: string | null;
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

export type EventResponse = {
  /**
   * @format uuid
   */
  id: string;
  eventId: string;
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

export type GetAllProjectsResponse = {
  projects: ProjectResponse[];
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

export type GetMeResponse = {
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  /**
   * @format uuid
   */
  id: string;
};

export type GetUserResponse = {
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  /**
   * @format uuid
   */
  id: string;
};

export type InformationCardResponse = {
  title?: string | null;
  description?: string | null;
  button?: ButtonResponse;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type LocationResponse = {
  name: string;
  city?: string | null;
};

export type PageResponse = {
  name: string;
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
  title: string;
  description?: string | null;
  fullText?: string | null;
  imageCaption?: string | null;
  imageUrl?: string | null;
  imageCredits?: string | null;
  highlighted?: boolean;
};

export type PublishProjectsQuery = {
  publish?: boolean;
  projectIds: string[];
};

export type PublishProjectsResponse = Record<string, any>;

export type UpdateDashboardTabQuery = {
  /**
   * @format uuid
   */
  id: string;
  title: string;
  mapUrl: string;
};

export type UpdateDashboardTabResponse = Record<string, any>;

export type UrlResponse = {
  link: string;
  description: string;
};

export type UserResponse = {
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  /**
   * @format uuid
   */
  id: string;
};
