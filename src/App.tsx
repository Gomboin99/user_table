import { useUsers } from "./presentation/hooks/useUsers";
import { UserTable } from "./presentation/components/UserTable";
import { Pagination } from "./presentation/components/Pagination";
import "./App.css";

function App() {
  const {
    users,
    total,
    totalPages,
    page,
    loading,
    error,
    sort,
    filter,
    cycleSort,
    changeFilter,
    setPage,
    reload,
  } = useUsers();

  return (
    <main className="app">
      <h1>Таблица пользователей</h1>
      <p className="hint">
        Нажмите на заголовок сортируемой колонки, чтобы переключить состояние:
        по возрастанию → по убыванию → без сортировки. Используйте поля фильтра
        под заголовками и постраничную навигацию.
      </p>
      {loading ? (
        <p className="status">Загрузка...</p>
      ) : error ? (
        <div className="status error">
          <p>Ошибка: {error}</p>
          <button type="button" onClick={reload}>
            Повторить попытку
          </button>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            sort={sort}
            onSort={cycleSort}
            filter={filter}
            onFilterChange={changeFilter}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}

export default App;
