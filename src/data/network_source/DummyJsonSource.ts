import type { UsersDTO } from "../dto/UsersDTO";
import type { NetworkSource, UserQuery } from "./NetworkSource";
import {
  HttpError,
  NetworkError,
  ParseError,
  TimeoutError,
} from "../../domain/errors/Errors";
import { API_BASE_URL, PAGE_SIZE, REQUEST_TIMEOUT_MS } from "../../config/constants";

export class DummyJsonSource implements NetworkSource {
  async fetchUsers(query: UserQuery, signal?: AbortSignal): Promise<UsersDTO> {
    const params = new URLSearchParams();

    params.set("limit", String(PAGE_SIZE));
    params.set("skip", String((query.page - 1) * PAGE_SIZE));

    if (query.sort) {
      params.set("sortBy", query.sort.field);
      params.set("order", query.sort.order);
    }

    let url = API_BASE_URL;
    if (query.filter && query.filter.value.trim() !== "") {
      url = `${API_BASE_URL}/filter`;
      params.set("key", query.filter.key);
      params.set("value", query.filter.value.trim());
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const onParentAbort = () => controller.abort();
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener("abort", onParentAbort, { once: true });
    }

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
      }

      try {
        return (await response.json()) as UsersDTO;
      } catch {
        throw new ParseError();
      }
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
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onParentAbort);
    }
  }
}
