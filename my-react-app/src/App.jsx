import "./App.css";
import { useFetch } from "./hooks/useFetch";
import { useMemo, useState, useEffect } from "react";
import useLocalStorage from "./hooks/uselockalestorage";
import { useToggle } from "./hooks/useToggle";

function App() {
  const { data = [], loading, error } = useFetch();
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [showDetails, toggleShowDetails] = useToggle(false);
  const [secondsLeft, setSecondsLeft] = useState(30);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(id);
  }, []);
  // Memoize the filtered users
  const filteredUsers = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  console.log("App render - data:", data, "loading:", loading, "error:", error);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className={`app ${theme}-theme`}>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <h1>Annuaire des Utilisateurs</h1>
      <div className="search-row">
        <p className="timer">Auto-refresh dans : {secondsLeft} s</p>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          type="button"
          onClick={toggleShowDetails}
          className={`details-toggle ${showDetails ? "active" : ""}`}
        >
          {showDetails ? "Masquer tous les détails" : "Voir tous les détails"}
        </button>
      </div>

      <div className="users-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} showDetails={showDetails} />
          ))
        ) : (
          <p className="no-users">No users found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
}

function UserCard({ user, showDetails }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      {showDetails && (
        <>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Company:</strong> {user.company?.name}
          </p>
          <p>
            <strong>City:</strong> {user.address?.city}
          </p>
        </>
      )}
    </div>
  );
}

export default App;
