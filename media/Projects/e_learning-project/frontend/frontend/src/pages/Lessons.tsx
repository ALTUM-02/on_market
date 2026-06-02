import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const Lessons = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("lessons/")
      .then((response) => {
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          setLessons(responseData);
        } else if (Array.isArray(responseData?.results)) {
          setLessons(responseData.results);
        } else {
          setError("Received unexpected lessons data from the backend.");
        }
      })
      .catch(() => {
        setError("Unable to load lessons from the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (

    <div
      className="
      p-8
      "
    >

      <h1
        className="
        text-4xl
        font-bold
        mb-6
        "
      >

        Lessons

      </h1>

      {loading && <p className="text-gray-500">Loading lessons…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && lessons.length === 0 && (
        <p className="text-gray-500">No lessons found. Add lessons in the backend first.</p>
      )}

      <div className="space-y-6">
        {lessons.map((lesson: any) => (
          <div key={lesson.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        ))}
      </div>

    </div>

  );

};

export default Lessons;