import { useState, useEffect, useCallback } from "react";
import type { User } from "../../domain/models/User";
import type { UserRepository } from "../../domain/interfaces/UserRepository";
import { RequestError } from "../../errors/Errors";
import { container } from "../../di/Container";

type UsersQuery = Parameters<UserRepository["getUsers"]>[0];

export function useFetchUsers(query: UsersQuery) {
  const userRepository = container.getUsersRepository();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    userRepository
      .getUsers(query, controller.signal)
      .then(({ users, total }) => {
        if (cancelled) return;
        setUsers(users);
        setTotal(total);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof RequestError) {
          setError(err.message);
        } else if (err instanceof DOMException && err.name === "AbortError") {
          setError(null);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userRepository, query, reloadToken]);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  return { users, total, loading, error, reload };
}
