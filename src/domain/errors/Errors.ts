export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NetworkError extends RequestError {
  constructor(
    message = "Не удалось выполнить запрос к серверу. Проверьте подключение к интернету."
  ) {
    super(message);
  }
}

export class TimeoutError extends NetworkError {
  constructor(message = "Истекло время ожидания ответа от сервера.") {
    super(message);
  }
}

export class HttpError extends RequestError {
  public readonly status: number;
  public readonly statusText: string;

  constructor(status: number, statusText: string) {
    super(HttpError.formatMessage(status, statusText));
    this.status = status;
    this.statusText = statusText;
  }

  private static formatMessage(status: number, statusText: string): string {
    const known: Record<number, string> = {
      400: "Некорректный запрос",
      401: "Требуется авторизация",
      403: "Доступ запрещён",
      404: "Данные не найдены",
      429: "Слишком много запросов, попробуйте позже",
      500: "Внутренняя ошибка сервера",
      502: "Сервер недоступен",
      503: "Сервис временно недоступен",
    };

    const detail = known[status] ?? (statusText.trim() || "Неизвестная ошибка");
    return `Ошибка запроса (${status}): ${detail}`;
  }
}

export class ParseError extends RequestError {
  constructor(message = "Не удалось разобрать ответ сервера.") {
    super(message);
  }
}
