import type { UsersDTO } from "../dto/UsersDTO";
import type { NetworkSource } from "./NetworkSource";
import type { UserRequest } from "../requests/UserRequest";
import {
  HttpError,
  NetworkError,
  ParseError,
  TimeoutError,
} from "../../errors/Errors";
import { API_BASE_URL, REQUEST_TIMEOUT_MS, PAGE_SIZE } from "../../config/constants";

export class DummyJsonSource implements NetworkSource {
  async fetchUsers(request: UserRequest, signal?: AbortSignal): Promise<UsersDTO> {
    const url = this.buildUrl(request);
    const { controller, clear } = this.createTimeoutController(signal);

    try {
      return await this.request(url, controller.signal);
    } catch (err) {
      if (err instanceof HttpError || err instanceof ParseError) {
        throw err;
      }
      if (signal?.aborted) {
        throw err;
      }
      if (controller.signal.aborted) {
        throw new TimeoutError();
      }
      throw new NetworkError();
    } finally {
      clear();
    }
  }

  private buildUrl(request: UserRequest): string {
    const params = new URLSearchParams();

    params.set("limit", String(PAGE_SIZE));
    params.set("skip", String((request.page - 1) * PAGE_SIZE));

    if (request.sort) {
      params.set("sortBy", request.sort.field);
      params.set("order", request.sort.order);
    }

    let url = API_BASE_URL;
    if (request.filter && request.filter.value.trim() !== "") {
      url = `${API_BASE_URL}/filter`;
      params.set("key", request.filter.key);
      params.set("value", request.filter.value.trim());
    }

    return `${url}?${params.toString()}`;
  }

  private createTimeoutController(signal?: AbortSignal): {
    controller: AbortController;
    clear: () => void;
  } {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const onParentAbort = () => controller.abort();

    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener("abort", onParentAbort, { once: true });
    }

    const clear = () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onParentAbort);
    };

    return { controller, clear };
  }

  private async request(url: string, signal: AbortSignal): Promise<UsersDTO> {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText);
    }

    try {
      return (await response.json()) as UsersDTO;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new ParseError();
    }
  }
}
