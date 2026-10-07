"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Exercise = {
  id: number;
  type: string;
  question: string;
  correct_answer: string;
  options: string[];
};

type Lesson = {
  id: number;
  title: string;
  exercises: Exercise[];
};

function LessonContent() {
  const params = useParams();
  const router = useRouter();

  const lessonId = params.lesson_id;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LESSON STATE
  // ============================================================

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [isCorrect, setIsCorrect] =
    useState<boolean | null>(null);

  // ============================================================
  // GAME STATE
  // ============================================================

  const [hearts, setHearts] = useState(3);
  const [xp, setXp] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // ============================================================
  // FETCH LESSON
  // ============================================================

  useEffect(() => {
    fetch(
      `http://duolingo-clone-jqmu.onrender.com/api/lesson/${lessonId}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("LESSON DATA:", data);

        setLesson(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to load lesson:",
          error
        );

        setLoading(false);
      });
  }, [lessonId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="lesson-loading">
        Loading lesson...
      </div>
    );
  }

  // ============================================================
  // NO LESSON
  // ============================================================

  if (!lesson || !lesson.exercises?.length) {
    return (
      <div className="lesson-loading">
        No exercises found.
      </div>
    );
  }

  const exercise =
    lesson.exercises[currentIndex];

  // ============================================================
  // PROGRESS
  // ============================================================

  const progress =
    ((currentIndex + 1) /
      lesson.exercises.length) *
    100;

  // ============================================================
  // ANSWER HANDLER
  // ============================================================

  const handleAnswer = (answer: string) => {
    // Don't allow another answer
    // after checking
    if (isCorrect !== null) return;

    setSelectedAnswer(answer);

    // ========================================================
    // CORRECT
    // ========================================================

    if (
      answer.trim().toLowerCase() ===
      exercise.correct_answer.trim().toLowerCase()
    ) {
      setIsCorrect(true);

      // +10 XP
      setXp((prev) => prev + 10);

      // +1 correct answer
      setCorrectAnswers((prev) => prev + 1);
    }

    // ========================================================
    // WRONG
    // ========================================================

    else {
      setIsCorrect(false);

      // Lose one heart
      setHearts((prev) =>
        Math.max(0, prev - 1)
      );
    }
  };

  // ============================================================
  // CONTINUE HANDLER
  // ============================================================

  const handleContinue = async () => {
    if (isCorrect === null) return;

    // ========================================================
    // NEXT QUESTION
    // ========================================================

    if (
      currentIndex <
      lesson.exercises.length - 1
    ) {
      setCurrentIndex(
        currentIndex + 1
      );

      setSelectedAnswer(null);

      setIsCorrect(null);

      return;
    }

    // ========================================================
    // LESSON FINISHED
    // ========================================================

    /*
      React state updates are asynchronous.

      Therefore, if the LAST answer was correct,
      xp and correctAnswers may still contain
      the previous values.

      We calculate the final values manually.
    */

    const finalXp =
      xp +
      (isCorrect === true ? 10 : 0);

    const finalCorrectAnswers =
      correctAnswers +
      (isCorrect === true ? 1 : 0);

    console.log(
      "FINAL LESSON RESULTS:",
      {
        xp: finalXp,
        correctAnswers:
          finalCorrectAnswers,
        totalQuestions:
          lesson.exercises.length,
        hearts,
      }
    );

    // ========================================================
    // SAVE TO BACKEND
    // ========================================================

    try {
      const response = await fetch(
        `http://duolingo-clone-jqmu.onrender.com/api/lesson/${lessonId}/complete`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            xp_earned: finalXp,
            correct_answers:
              finalCorrectAnswers,
            total_questions:
              lesson.exercises.length,
            hearts: hearts,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "LESSON COMPLETION:",
        data
      );

      // ======================================================
      // API ERROR
      // ======================================================

      if (!response.ok) {
        console.error(
          "Failed to save lesson:",
          data
        );

        alert(
          "Could not save lesson progress."
        );

        return;
      }

      // ======================================================
      // SUCCESS
      // ======================================================

      const crowns =
        data.lesson?.crowns_earned ?? 1;

      alert(
        `🎉 Lesson complete!\n\n` +
        `You earned ${finalXp} XP!\n` +
        `You earned ${crowns} crown${
          crowns === 1 ? "" : "s"
        }!`
      );

      // Go back to Home
      router.push("/");

    } catch (error) {
      console.error(
        "Error completing lesson:",
        error
      );

      alert(
        "Something went wrong while saving your progress."
      );
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="lesson-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="lesson-header">

        {/* Close */}

        <button
          className="close-button"
          onClick={() =>
            router.push("/")
          }
        >
          ✕
        </button>

        {/* Progress */}

        <div className="lesson-progress">

          <div
            className="lesson-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        {/* Hearts */}

        <div className="lesson-heart">
          ❤️ {hearts}
        </div>

        {/* XP */}

        <div className="lesson-xp">
          ⭐ {xp} XP
        </div>

      </header>


      {/* =====================================================
          QUESTION CONTENT
      ===================================================== */}

      <section className="lesson-content">

        <div className="lesson-card">

          {/* Question number */}

          <p className="exercise-number">
            Question{" "}
            {currentIndex + 1}{" "}
            of{" "}
            {lesson.exercises.length}
          </p>


          {/* Question */}

          <h1>
            {exercise.question}
          </h1>


          {/* =================================================
              MULTIPLE CHOICE
          ================================================= */}

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
                    >
                      {option}
                    </button>
                  );
                }
              )}

            </div>
          )}


          {/* =================================================
              TEXT ANSWER
          ================================================= */}

          {exercise.type !==
            "multiple_choice" && (

            <div className="text-answer">

              <input
                type="text"
                placeholder="Type your answer..."
                value={
                  selectedAnswer ??
                  ""
                }
                onChange={(e) =>
                  setSelectedAnswer(
                    e.target.value
                  )
                }
                disabled={
                  isCorrect !== null
                }
              />

              <button
                className="check-button"
                onClick={() =>
                  handleAnswer(
                    selectedAnswer?.trim() ||
                      ""
                  )
                }
                disabled={
                  !selectedAnswer?.trim()
                }
              >
                Check
              </button>

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          BOTTOM FEEDBACK
      ===================================================== */}

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

          {/* Correct */}

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
                  That's correct! +10 XP
                </p>

              </div>
            </>
          )}


          {/* Incorrect */}

          {isCorrect === false && (
            <>
              <span className="feedback-icon">
                !
              </span>

              <div>

                <strong>
                  Not quite!
                </strong>

                <p>
                  Correct answer:{" "}
                  {
                    exercise.correct_answer
                  }
                </p>

              </div>
            </>
          )}

        </div>


        {/* Continue / Finish */}

        <button
          className="continue-button"
          onClick={
            handleContinue
          }
          disabled={
            isCorrect === null
          }
        >
          {currentIndex ===
          lesson.exercises.length - 1
            ? "Finish"
            : "Continue"}
        </button>

      </footer>

    </main>
  );
}


// ============================================================
// PAGE
// ============================================================

export default function LessonPage() {

  return (
    <Suspense
      fallback={
        <div className="lesson-loading">
          Loading lesson...
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}