import React, { useState, useEffect } from "react";
// Zorg ervoor dat dit pad klopt naar de map waar je CoinExplosion hebt opgeslagen!
import CoinExplosion from "../Effects/CoinExplosion";
import { triggerAchievement } from "../../utils/achievementSystem";

const handleAddBalance = async (amount, opts = { showError: true }) => {
  try {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      if (opts.showError) console.error("No logged-in user found");
      return { ok: false };
    }

    const parsedAmount = Number(amount);

    const res = await fetch("http://127.0.0.1:3000/add-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: parsedAmount }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (opts.showError)
        console.error(data.error || "Could not update balance");
      return { ok: false };
    }

    window.dispatchEvent(new Event("balance-updated"));
    void triggerAchievement("coins_earned", { amount: parsedAmount });
    return { ok: true, balance: data.balance };
  } catch {
    if (opts.showError) console.error("Server not reachable");
    return { ok: false };
  }
};

export default function LessonQuiz({
  questions,
  balanceGainAmount = 0,
  quizId = "default-quiz",
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = localStorage.getItem(`${quizId}-index`);
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  const [quizFinished, setQuizFinished] = useState(() => {
    const savedFinished = localStorage.getItem(`${quizId}-finished`);
    return savedFinished === "true";
  });

  const [justFinished, setJustFinished] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    if (isQuizActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isQuizActive]);

  if (!questions || questions.length === 0) {
    return <div className="alert alert-warning">Geen quizvragen gevonden.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleCheckAnswer = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    let isCorrect = false;

    if (
      currentQuestion.answerIncludes &&
      Array.isArray(currentQuestion.answerIncludes)
    ) {
      isCorrect = currentQuestion.answerIncludes.some((keyword) =>
        normalizedUserAnswer.includes(keyword.trim().toLowerCase()),
      );
    } else if (Array.isArray(currentQuestion.correctAnswer)) {
      isCorrect = currentQuestion.correctAnswer.some(
        (answer) => answer.trim().toLowerCase() === normalizedUserAnswer,
      );
    } else if (currentQuestion.correctAnswer) {
      isCorrect =
        normalizedUserAnswer ===
        currentQuestion.correctAnswer.trim().toLowerCase();
    }

    if (isCorrect) {
      if (currentQuestionIndex + 1 < questions.length) {
        setFeedback("correct");
        setTimeout(() => {
          setFeedback(null);
          setUserAnswer("");

          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          localStorage.setItem(`${quizId}-index`, nextIndex);
        }, 1500);
      } else {
        setFeedback(null);
        setUserAnswer("");
        setQuizFinished(true);
        setIsQuizActive(false);

        setJustFinished(true);
        localStorage.setItem(`${quizId}-finished`, "true");

        if (balanceGainAmount > 0) {
          handleAddBalance(balanceGainAmount);
        }
      }
    } else {
      setFeedback("incorrect");
    }
  };

  // UI 1: Quiz completely finished
  if (quizFinished) {
    return (
      // Changed inline #e8f5e9 to Bootstrap's bg-success-subtle so it adapts to dark mode
      <div
        className="card shadow-sm p-4 text-center mt-4 bg-success-subtle border-success"
        style={{ borderRadius: "20px" }}
      >
        {justFinished && balanceGainAmount > 0 && <CoinExplosion />}
        <h3 className="text-success">
          <i className="bi bi-trophy-fill me-2"></i>
          Gefeliciteerd!
        </h3>
        <p className="text-body">
          Je hebt alle vragen van deze quiz succesvol beantwoord.
        </p>

        {balanceGainAmount > 0 && (
          // Changed inline bg-white to bg-body
          <div className="mt-3 p-2 bg-body rounded shadow-sm d-inline-block">
            <h5 className="text-warning m-0" style={{ fontWeight: "bold" }}>
              <i className="dth-coin me-2"></i>+{balanceGainAmount} Munten
              verdiend!
            </h5>
          </div>
        )}
      </div>
    );
  }

  // UI 2: Start Quiz prompt
  if (!isQuizActive) {
    return (
      // Replaced inline blue border with border-primary and border-2 classes
      <div
        className="card shadow-sm p-4 mt-4 text-center border-primary border-2 bg-body"
        style={{ borderRadius: "20px" }}
      >
        {/* Replaced inline #1e88e5 color with text-primary */}
        <h4 className="text-primary">Quiz Tijd!</h4>
        <p className="mb-4 text-body">
          Test wat je zojuist hebt geleerd om munten te verdienen.
        </p>
        <button
          className="btn btn-primary fw-bold px-4 py-2"
          style={{ borderRadius: "10px" }}
          onClick={() => setIsQuizActive(true)}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // UI 3: Active Quiz Overlay
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Slight opacity tweak for dark mode comfort
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        // Added bg-body to adapt the card background and border-primary to adapt the border
        className="card shadow-lg p-4 w-100 bg-body border-primary border-2"
        style={{
          maxWidth: "600px",
          borderRadius: "20px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Changed inline color to text-primary */}
          <h4 className="text-primary m-0">Quiz Tijd!</h4>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-primary rounded-pill text-light">
              Vraag {currentQuestionIndex + 1} van {questions.length}
            </span>
            <button
              className="btn-close"
              onClick={() => setIsQuizActive(false)}
              aria-label="Close"
              title="Annuleer quiz"
            ></button>
          </div>
        </div>

        {/* Ensure text uses text-body so it changes from black to white in dark mode */}
        <h5 className="mb-4 text-body">{currentQuestion.question}</h5>

        {currentQuestion.type === "multiple-choice" && (
          <div className="d-flex flex-column gap-2 mb-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`btn text-start ${userAnswer === option ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => {
                  setUserAnswer(option);
                  setFeedback(null);
                }}
                style={{ borderRadius: "10px" }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "text-input" && (
          <div className="mb-4">
            <input
              type="text"
              // Input fields automatically adapt in BS 5.3+, form-control handles it
              className="form-control"
              placeholder="Typ je antwoord hier..."
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setFeedback(null);
              }}
              style={{ borderRadius: "10px" }}
            />
          </div>
        )}

        {feedback === "correct" && (
          <div
            className="alert alert-success d-flex align-items-center"
            style={{ borderRadius: "10px" }}
          >
            <i className="bi bi-check-circle-fill fs-4 me-2"></i>
            <div>Helemaal goed! We gaan door naar de volgende vraag...</div>
          </div>
        )}

        {feedback === "incorrect" && (
          <div
            className="alert alert-danger d-flex align-items-center"
            style={{ borderRadius: "10px" }}
          >
            <i className="bi bi-x-circle-fill fs-4 me-2"></i>
            <div>Oeps, dat is niet helemaal juist. Probeer het nog eens!</div>
          </div>
        )}

        <button
          className="btn btn-success w-100"
          onClick={handleCheckAnswer}
          disabled={!userAnswer || feedback === "correct"}
          style={{ borderRadius: "10px", fontWeight: "bold" }}
        >
          Controleer Antwoord
        </button>
      </div>
    </div>
  );
}
