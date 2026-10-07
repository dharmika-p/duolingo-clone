"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Exercise = {
  id: number;
  type: string;
  question: string;
  correct_answer: string;
  options: string[];
};

type User = {
  id: number;
  name: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
};

export default function PracticePage() {
  const router = useRouter();

  // ==========================================
  // STATE
  // ==========================================

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [isCorrect, setIsCorrect] =
    useState<boolean | null>(null);

  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);

  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);

  // ==========================================
  // LOAD PRACTICE QUESTIONS
  // ==========================================

  useEffect(() => {
    async function loadPractice() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/practice"
        );

        if (!response.ok) {
          throw new Error(
            `Practice API failed: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("PRACTICE DATA:", data);

        if (data.exercises) {
          setExercises(data.exercises);
        }

        if (data.user) {
          setUser(data.user);
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Failed to load practice:",
          error
        );

        setLoading(false);
      }
    }

    loadPractice();
  }, []);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="lesson-loading">
        <div>
          <div
            style={{
              fontSize: 40,
              marginBottom: 12,
            }}
          >
            🧠
          </div>

          <strong>
            Preparing your practice...
          </strong>

          <p
            style={{
              color: "#777",
              marginTop: 6,
            }}
          >
            Let's strengthen your Spanish skills.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO QUESTIONS
  // ==========================================

  if (!exercises.length) {
    return (
      <div className="lesson-loading">
        <div>
          <div
            style={{
              fontSize: 40,
              marginBottom: 12,
            }}
          >
            📚
          </div>

          <h2>
            No practice questions available
          </h2>

          <p
            style={{
              color: "#777",
              marginBottom: 20,
            }}
          >
            Complete a lesson first to build your
            practice set.
          </p>

          <button
            className="continue-button"
            onClick={() => router.push("/")}
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // COMPLETION SCREEN
  // ==========================================

  if (finished) {
    return (
      <main className="lesson-page">
        <section
          className="lesson-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight:
              "calc(100vh - 100px)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: 520,
              padding: 40,
            }}
          >
            <div
              style={{
                fontSize: 72,
                marginBottom: 15,
              }}
            >
              🎉
            </div>

            <p
              style={{
                fontWeight: 800,
                color: "#777",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              PRACTICE COMPLETE
            </p>

            <h1
              style={{
                fontSize: 38,
                marginBottom: 12,
              }}
            >
              Nice work, {user?.name || "learner"}!
            </h1>

            <p
              style={{
                color: "#777",
                fontSize: 18,
                marginBottom: 30,
              }}
            >
              You strengthened your Spanish and
              earned some rewards.
            </p>

            {/* =================================
                RESULT CARDS
            ================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 30,
              }}
            >
              <div className="stat-card">
                <div
                  style={{
                    fontSize: 28,
                  }}
                >
                  ⭐
                </div>

                <strong>
                  +{xp}
                </strong>

                <span>
                  XP earned
                </span>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    fontSize: 28,
                  }}
                >
                  ✓
                </div>

                <strong>
                  {score}/{exercises.length}
                </strong>

                <span>
                  Correct
                </span>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    fontSize: 28,
                  }}
                >
                  ❤️
                </div>

                <strong>
                  {user?.hearts ?? 0}
                </strong>

                <span>
                  Hearts
                </span>
              </div>
            </div>

            {/* =================================
                UPDATED TOTAL XP
            ================================= */}

            {user && (
              <p
                style={{
                  color: "#777",
                  marginBottom: 24,
                  fontWeight: 600,
                }}
              >
                Total XP: {user.xp} ⭐
              </p>
            )}

            <button
              className="continue-button"
              style={{
                width: "100%",
                maxWidth: 360,
              }}
              onClick={() =>
                router.push("/")
              }
            >
              Continue Learning
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // CURRENT EXERCISE
  // ==========================================

  const exercise =
    exercises[currentIndex];

  const progress =
    ((currentIndex + 1) /
      exercises.length) *
    100;

  // ==========================================
  // ANSWER HANDLER
  // ==========================================

  const handleAnswer = (
    answer: string
  ) => {
    // Don't allow answering twice
    if (isCorrect !== null) {
      return;
    }

    const cleanAnswer =
      answer.trim().toLowerCase();

    const cleanCorrectAnswer =
      exercise.correct_answer
        .trim()
        .toLowerCase();

    const correct =
      cleanAnswer ===
      cleanCorrectAnswer;

    setSelectedAnswer(answer);

    if (correct) {
      setIsCorrect(true);

      setScore(
        (previous) => previous + 1
      );

      setXp(
        (previous) => previous + 5
      );
    } else {
      setIsCorrect(false);
    }
  };

  // ==========================================
  // SAVE PRACTICE TO BACKEND
  // ==========================================

  const finishPractice = async () => {
    if (finishing) {
      return;
    }

    setFinishing(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/practice/complete",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            xp_earned: xp,
            correct_answers: score,
            total_questions:
              exercises.length,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Practice completion failed:",
          errorText
        );

        throw new Error(
          `Failed to save practice: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "PRACTICE COMPLETE:",
        data
      );

      // ======================================
      // UPDATE USER WITH DATABASE RESPONSE
      // ======================================

      if (data.user) {
        setUser(data.user);
      }

      // ======================================
      // ONLY SHOW SUCCESS AFTER DATABASE SAVE
      // ======================================

      setFinished(true);
    } catch (error) {
      console.error(
        "Failed to save practice:",
        error
      );

      alert(
        "We couldn't save your practice result. Please try again."
      );
    } finally {
      setFinishing(false);
    }
  };

  // ==========================================
  // CONTINUE BUTTON
  // ==========================================

  const handleContinue = () => {
    if (isCorrect === null) {
      return;
    }

    // ----------------------------------------
    // More questions remaining
    // ----------------------------------------

    if (
      currentIndex <
      exercises.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      setSelectedAnswer(null);
      setIsCorrect(null);

      return;
    }

    // ----------------------------------------
    // Last question
    // ----------------------------------------

    finishPractice();
  };

  // ==========================================
  // RENDER PRACTICE
  // ==========================================

  return (
    <main className="lesson-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="lesson-header">

        <button
          className="close-button"
          onClick={() =>
            router.push("/")
          }
          aria-label="Exit practice"
        >
          ✕
        </button>

        {/* Progress bar */}

        <div className="lesson-progress">
          <div
            className="lesson-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* XP */}

        <div
          className="lesson-heart"
          style={{
            fontWeight: 800,
            minWidth: 80,
          }}
        >
          ⭐ {xp} XP
        </div>

      </header>

      {/* =====================================
          CONTENT
      ====================================== */}

      <section className="lesson-content">

        <div className="lesson-card">

          {/* Question number */}

          <p className="exercise-number">
            Practice{" "}
            {currentIndex + 1} of{" "}
            {exercises.length}
          </p>

          {/* Motivational badge */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#f1fce8",
              color: "#58a700",
              borderRadius: 20,
              padding: "7px 12px",
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            🧠 Strengthen your skills
          </div>

          {/* Question */}

          <h1>
            {exercise.question}
          </h1>

          {/* =================================
              MULTIPLE CHOICE
          ================================= */}

          {exercise.type ===
            "multiple_choice" && (
            <div className="answer-options">

              {exercise.options.map(
                (option) => {
                  let className =
                    "answer-button";

                  // Selected
                  if (
                    selectedAnswer ===
                    option
                  ) {
                    className +=
                      " selected";
                  }

                  // Correct
                  if (
                    selectedAnswer ===
                      option &&
                    isCorrect === true
                  ) {
                    className +=
                      " correct";
                  }

                  // Incorrect
                  if (
                    selectedAnswer ===
                      option &&
                    isCorrect === false
                  ) {
                    className +=
                      " incorrect";
                  }

                  return (
                    <button
                      key={option}
                      className={
                        className
                      }
                      onClick={() =>
                        handleAnswer(
                          option
                        )
                      }
                      disabled={
                        isCorrect !== null
                      }
                    >
                      {option}
                    </button>
                  );
                }
              )}

            </div>
          )}

          {/* =================================
              TEXT ANSWER
          ================================= */}

          {exercise.type !==
            "multiple_choice" && (
            <div className="text-answer">

              <input
                type="text"
                placeholder="Type your answer..."
                value={
                  selectedAnswer ?? ""
                }
                onChange={(event) =>
                  setSelectedAnswer(
                    event.target.value
                  )
                }
                disabled={
                  isCorrect !== null
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      "Enter" &&
                    selectedAnswer?.trim() &&
                    isCorrect === null
                  ) {
                    handleAnswer(
                      selectedAnswer.trim()
                    );
                  }
                }}
              />

              <button
                className="check-button"
                onClick={() =>
                  handleAnswer(
                    selectedAnswer
                      ?.trim() || ""
                  )
                }
                disabled={
                  !selectedAnswer?.trim() ||
                  isCorrect !== null
                }
              >
                Check
              </button>

            </div>
          )}

        </div>

      </section>

      {/* =====================================
          FEEDBACK FOOTER
      ====================================== */}

      <footer
        className={`lesson-footer ${
          isCorrect === true
            ? "success"
            : isCorrect === false
            ? "error"
            : ""
        }`}
      >

        <div className="feedback">

          {/* ---------------------------------
              CORRECT
          --------------------------------- */}

          {isCorrect === true && (
            <>
              <span className="feedback-icon">
                ✓
              </span>

              <div>
                <strong>
                  Excellent!
                </strong>

                <p>
                  Correct answer · +5 XP
                </p>
              </div>
            </>
          )}

          {/* ---------------------------------
              INCORRECT
          --------------------------------- */}

          {isCorrect === false && (
            <>
              <span className="feedback-icon">
                !
              </span>

              <div>
                <strong>
                  Keep practicing!
                </strong>

                <p>
                  Correct answer:{" "}
                  {exercise.correct_answer}
                </p>
              </div>
            </>
          )}

          {/* ---------------------------------
              BEFORE ANSWERING
          --------------------------------- */}

          {isCorrect === null && (
            <div>
              <strong>
                Choose the best answer
              </strong>

              <p>
                Keep going — every practice
                question strengthens your skills.
              </p>
            </div>
          )}

        </div>

        {/* =================================
            CONTINUE / FINISH
        ================================= */}

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={
            isCorrect === null ||
            finishing
          }
        >
          {finishing
            ? "Saving..."
            : currentIndex ===
              exercises.length - 1
            ? "Finish"
            : "Continue"}
        </button>

      </footer>

    </main>
  );
}