
// Gebruik dit niet, dit is een oude die ik bewaar voor archival en vergelijking purposes. 

import React, { useState } from "react";
// Zorg ervoor dat dit pad klopt naar de map waar je CoinExplosion hebt opgeslagen!
import CoinExplosion from "../Effects/CoinExplosion";

// 1. Functie om saldo toe te voegen
const handleAddBalance = async (amount, opts = { showError: true }) => {
  try {
    const parsedAmount = Number(amount);

    const res = await fetch("http://localhost:3000/add-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: parsedAmount }),
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

// 2. Component met de nieuwe "quizId" prop (standaardwaarde "default-quiz")
export default function LessonQuiz({ questions, balanceGainAmount = 0, quizId = "default-quiz" }) {
  
  // 3. States initialiseren met localStorage
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = localStorage.getItem(`${quizId}-index`);
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  const [quizFinished, setQuizFinished] = useState(() => {
    const savedFinished = localStorage.getItem(`${quizId}-finished`);
    return savedFinished === "true";
  });

  // NIEUW: State om bij te houden of de quiz NU net is afgerond
  const [justFinished, setJustFinished] = useState(false);

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

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
      // Check of dit de laatste vraag is
      if (currentQuestionIndex + 1 < questions.length) {
        setFeedback("correct");
        setTimeout(() => {
          setFeedback(null);
          setUserAnswer("");
          
          // 4. Sla de nieuwe index op in localStorage
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          localStorage.setItem(`${quizId}-index`, nextIndex);
        }, 1500);
      } else {
        setFeedback(null);
        setUserAnswer("");
        setQuizFinished(true); 
        
        // NIEUW: Zet justFinished op true zodat de animatie alleen nú speelt
        setJustFinished(true);
        
        // 5. Sla op dat de quiz is afgerond
        localStorage.setItem(`${quizId}-finished`, "true");
        
        // Voeg munten toe
        if (balanceGainAmount > 0) {
          handleAddBalance(balanceGainAmount);
        }
      }
    } else {
      setFeedback("incorrect");
    }
  };

  if (quizFinished) {
    return (
      <div className="card shadow-sm p-4 text-center mt-4" style={{ borderRadius: "20px", backgroundColor: "#e8f5e9" }}>
        
        {/* AANGEPAST: Munten explosie checkt nu ook op 'justFinished' */}
        {justFinished && balanceGainAmount > 0 && <CoinExplosion />}

        <h3 className="text-success">
          <i className="bi bi-trophy-fill me-2"></i>
          Gefeliciteerd!
        </h3>
        <p>Je hebt alle vragen van deze quiz succesvol beantwoord.</p>
        
        {/* Laten zien hoeveel ze hebben verdiend! */}
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