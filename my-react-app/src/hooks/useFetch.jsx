import { useState, useEffect } from "react";

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch form this api https://jsonplaceholder.typicode.com/users
  // This hook will fetch user data when component mounts

  useEffect(() => {
    console.log("Starting data fetch...");
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        console.log("Response received:", res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};
