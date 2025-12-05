import React, { useEffect, useState } from "react";
import ImageSet from "./components/ImageSet";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/images")
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("API Error"));
  }, []);

  if (!data) return <h2>Loading…</h2>;

  return (
    <div className="app">
      <ImageSet {...data} />
    </div>
  );
}
