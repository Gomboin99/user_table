import { useUsers } from "./presentation/hooks/useUsers";
import { UserTable } from "./presentation/components/UserTable";
import "./App.css";

function App() {
  const { users, loading, error, sort, cycleSort } = useUsers();

  return (
    <main className="app">
      <h1>Таблица пользователей</h1>
      <p className="hint">
        Нажмите на заголовок сортируемой колонки, чтобы переключить состояние:
        по возрастанию → по убыванию → без сортировки.
      </p>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p className="error">Ошибка: {error}</p>
      ) : (
        <UserTable users={users} sort={sort} onSort={cycleSort} />
      )}
    </main>
  );
}

export default App;
