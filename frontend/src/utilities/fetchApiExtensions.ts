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
          ...FetchInterceptor.headers
        }
      };

      return await originalFetch(resource, newOptions);
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
