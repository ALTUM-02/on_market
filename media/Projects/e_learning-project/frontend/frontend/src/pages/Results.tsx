import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import DashboardLayout
from "../layouts/DashboardLayout";

const Results = () => {

  const [results,
    setResults] =
    useState([]);

  useEffect(() => {

    api.get("results/")
      .then((response) => {

        setResults(
          response.data
        );

      });

  }, []);

  return (

    <DashboardLayout>

      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        Quiz Results
      </h1>

      {results.map(
        (result: any) => (

          <div
            key={result.id}
            className="
            bg-white
            p-5
            rounded-xl
            mb-4
            "
          >

            {result.student_name}
            {" - "}
            {result.score}
            /
            {result.total_questions}

          </div>

      ))}

    </DashboardLayout>

  );

};

export default Results;