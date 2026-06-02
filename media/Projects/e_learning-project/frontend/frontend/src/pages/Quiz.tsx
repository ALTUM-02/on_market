import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import DashboardLayout
from "../layouts/DashboardLayout";

type Question = {

  id: number;

  question: string;

  option_a: string;

  option_b: string;

  option_c: string;

  option_d: string;

  correct_answer: string;

};

const Quiz = () => {

  const [questions,
    setQuestions] =
    useState<Question[]>([]);

  const [currentQuestion,
    setCurrentQuestion] =
    useState(0);

  const [score,
    setScore] =
    useState(0);

  const [finished,
    setFinished] =
    useState(false);

  useEffect(() => {

    api.get("questions/")
      .then((response) => {

        setQuestions(
          response.data
        );

      });

  }, []);

  const handleAnswer = (
    answer: string
  ) => {

    if (
      answer ===
      questions[
        currentQuestion
      ].correct_answer
    ) {

      setScore(
        prev => prev + 1
      );

    }

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        prev => prev + 1
      );

    } else {

      setFinished(true);

    }

  };

  if (
    questions.length === 0
  ) {

    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );

  }

  if (finished) {

    return (

      <DashboardLayout>

        <h1
          className="
          text-5xl
          font-bold
          "
        >
          Quiz Finished
        </h1>

        <p
          className="
          mt-4
          text-xl
          "
        >
          Score:
          {score}
          /
          {questions.length}
        </p>

      </DashboardLayout>

    );

  }

  const q =
    questions[currentQuestion];

  return (

    <DashboardLayout>

      <h1
        className="
        text-3xl
        font-bold
        mb-8
        "
      >
        Question
        {" "}
        {currentQuestion + 1}
      </h1>

      <div
        className="
        bg-white
        p-8
        rounded-2xl
        shadow
        "
      >

        <h2
          className="
          text-xl
          mb-6
          "
        >
          {q.question}
        </h2>

        <div
          className="
          grid
          gap-4
          "
        >

          <button
            onClick={() =>
              handleAnswer("A")
            }
          >
            {q.option_a}
          </button>

          <button
            onClick={() =>
              handleAnswer("B")
            }
          >
            {q.option_b}
          </button>

          <button
            onClick={() =>
              handleAnswer("C")
            }
          >
            {q.option_c}
          </button>

          <button
            onClick={() =>
              handleAnswer("D")
            }
          >
            {q.option_d}
          </button>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default Quiz;