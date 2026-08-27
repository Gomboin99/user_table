import { useState, useEffect, useCallback } from "react";
import type { User } from "../../domain/models/User";
import { container } from "../../di/Container";
import type { GetUserParams } from "../../domain/models/GetUserParams";
import type { GetUsersResult } from "../../domain/models/GetUserResult";

export function useFetchUsers(params: GetUserParams) {
  const userInteractor = container.getUserInteractor();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    
    userInteractor
      .getUsers(params, controller.signal, setLoading)
      .then((result: GetUsersResult) => {
        if (cancelled) return;
        if (result.success) {
          setUsers(result.users);
          setTotal(result.total);
          setError(null);
        } else {
          setError(result.error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userInteractor, params, reloadToken]);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  return { users, total, loading, error, reload };
}
