import React, { useState } from "react";
// Zorg ervoor dat dit pad klopt naar de map waar je CoinExplosion hebt opgeslagen!
import CoinExplosion from "../Effects/CoinExplosion";

// 1. We hebben jouw functie hier netjes bovenaan gezet, zodat de component hem kan gebruiken.
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
      if (opts.showError) console.error(data.error || "Could not update balance");
      return { ok: false };
    }

    window.dispatchEvent(new Event("balance-updated"));
    return { ok: true, balance: data.balance };
  } catch {
    if (opts.showError) console.error("Server not reachable");
    return { ok: false };
  }
};

// 2. We hebben "balanceGainAmount" toegevoegd aan de props. Als je niets invult, is het standaard 0.
export default function LessonQuiz({ questions, balanceGainAmount = 0 }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="alert alert-warning">Geen quizvragen gevonden.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleCheckAnswer = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    let isCorrect = false;

    if (Array.isArray(currentQuestion.correctAnswer)) {
      isCorrect = currentQuestion.correctAnswer.some(
        (answer) => answer.trim().toLowerCase() === normalizedUserAnswer
      );
    } else {
      isCorrect = normalizedUserAnswer === currentQuestion.correctAnswer.trim().toLowerCase();
    }

    if (isCorrect) {
      setFeedback("correct");
      
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer("");
        
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // De quiz is klaar!
          setQuizFinished(true); 
          
          // 3. Hier roepen we de functie aan om het saldo toe te voegen als het bedrag hoger is dan 0
          if (balanceGainAmount > 0) {
            handleAddBalance(balanceGainAmount);
          }
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
    }
  };

  if (quizFinished) {
    return (
      <div className="card shadow-sm p-4 text-center mt-4" style={{ borderRadius: "20px", backgroundColor: "#e8f5e9" }}>
        
        {/* NIEUW: Hier roepen we de munten explosie aan als de speler munten heeft verdiend! */}
        {balanceGainAmount > 0 && <CoinExplosion />}

        <h3 className="text-success">
          <i className="bi bi-trophy-fill me-2"></i>
          Gefeliciteerd!
        </h3>
        <p>Je hebt alle vragen van deze quiz succesvol beantwoord.</p>
        
        {/* 4. Hier laten we de leerling zien hoeveel ze hebben verdiend! */}
        {balanceGainAmount > 0 && (
          <div className="mt-3 p-2 bg-white rounded shadow-sm d-inline-block">
            <h5 className="text-warning m-0" style={{ fontWeight: "bold" }}>
              <i className="dth-coin me-2"></i>
              +{balanceGainAmount} Munten verdiend!
            </h5>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-4 mt-4" style={{ borderRadius: "20px", border: "2px solid #1e88e5" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "#1e88e5", margin: 0 }}>Quiz Tijd!</h4>
        <span className="badge bg-primary rounded-pill">
          Vraag {currentQuestionIndex + 1} van {questions.length}
        </span>
      </div>

      <h5 className="mb-4">{currentQuestion.question}</h5>

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
        <div className="alert alert-success d-flex align-items-center" style={{ borderRadius: "10px" }}>
          <i className="bi bi-check-circle-fill fs-4 me-2"></i>
          <div>Helemaal goed! We gaan door naar de volgende vraag...</div>
        </div>
      )}

      {feedback === "incorrect" && (
        <div className="alert alert-danger d-flex align-items-center" style={{ borderRadius: "10px" }}>
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
  );
}