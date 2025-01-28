import i18next from "i18next"

export class FetchInterceptor {
  private static headers: Record<string, string> = {};

  public static register() {
    const {fetch: originalFetch} = window;

    window.fetch = async (...args) => {
      let [resource, options] = args;

      const newOptions = {
        ...options,
        headers: {
          ...options?.headers,
          "Accept-Language": i18next.language,
          ...FetchInterceptor.headers
        }
      };

      const response = await originalFetch(resource, newOptions);
      return response;
    }
  }

  public static setHeader(key: string, value: string) {
    FetchInterceptor.headers[key] = value;
  }

  public static removeHeader(key: string) {
    delete FetchInterceptor.headers[key]
  }

  public static hasHeader(key: string) {
    return FetchInterceptor.headers[key] != undefined;
  }
}
