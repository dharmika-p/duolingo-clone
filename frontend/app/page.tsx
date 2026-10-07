"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Skill = {
  id: number;
  title: string;
  description: string;
  lesson_id: number | null;
  completed: boolean;
  progress: number;
  crowns: number;
};

type Unit = {
  id: number;
  title: string;
  skills: Skill[];
};

type HomeData = {
  user: {
    id: number;
    name: string;
    xp: number;
    streak: number;
    hearts: number;
    gems: number;
  };

  course: {
    id: number;
    name: string;
    language: string;
  };

  units: Unit[];
};

export default function Home() {
  const router = useRouter();

  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://duolingo-clone-jqmu.onrender.com/api/home")
      .then((res) => res.json())
      .then((result) => {
        console.log("HOME DATA:", result);

        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load home data:", error);
        setLoading(false);
      });
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="loading">
        Loading your course...
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (!data) {
    return (
      <div className="loading">
        Failed to load course.
      </div>
    );
  }

  /* ---------------- HOME ---------------- */

  return (
    <main className="app">

      {/* ================= TOP BAR ================= */}

      <header className="topbar">

        <div className="logo">
          duolingo
        </div>

        <div className="stats">

          {/* STREAK */}

          <div className="stat">
            🔥
            <span>
              {data.user.streak}
            </span>
          </div>

          {/* GEMS */}

          <div className="stat">
            💎
            <span>
              {data.user.gems}
            </span>
          </div>

          {/* HEARTS */}

          <div className="stat">
            ❤️
            <span>
              {data.user.hearts}
            </span>
          </div>

          {/* XP */}

          <div className="stat">
            ⭐
            <span>
              {data.user.xp} XP
            </span>
          </div>

        </div>

      </header>


      {/* ================= LAYOUT ================= */}

      <div className="layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="sidebar">

          <div className="side-logo">
            🦉
          </div>


          {/* LEARN */}

          <button
            className="nav active"
            onClick={() => router.push("/")}
          >
            🏠
            <span>
              Learn
            </span>
          </button>


          {/* PRACTICE */}

          <button
            className="nav"
            onClick={() => router.push("/practice")}
          >
            🏋️
            <span>
              Practice
            </span>
          </button>


          {/* LEADERBOARD */}

          <button
            className="nav"
            onClick={() => router.push("/leaderboard")}
          >
            🏆
            <span>
              Leaderboard
            </span>
          </button>


          {/* PROFILE */}

          <button
            className="nav"
            onClick={() => router.push("/profile")}
          >
            👤
            <span>
              Profile
            </span>
          </button>


          {/* SETTINGS */}

          <button
            className="nav"
            onClick={() => router.push("/settings")}
          >
            ⚙️
            <span>
              Settings
            </span>
          </button>

        </aside>


        {/* ================= MAIN CONTENT ================= */}

        <section className="content">

          {/* ================= COURSE HEADER ================= */}

          <div className="course-header">

            <div>

              <p className="eyebrow">
                LEARNING PATH
              </p>

              <h1>
                {data.course.name}
              </h1>

              <p>
                {data.course.language} course
              </p>

            </div>


            {/* DAILY GOAL */}

            <div className="daily-goal">

              <div className="goal-title">
                Daily Goal
              </div>

              <div className="goal-bar">

                <div
                  className="goal-progress"
                  style={{
                    width: `${Math.min(
                      data.user.xp,
                      100
                    )}%`,
                  }}
                />

              </div>

              <small>
                {Math.min(data.user.xp, 100)}/100 XP
              </small>

            </div>

          </div>


          {/* ================= UNITS ================= */}

          {data.units.map((unit) => (

            <div
              className="unit"
              key={unit.id}
            >

              {/* UNIT HEADER */}

              <div className="unit-header">

                <div>

                  <span>
                    UNIT {unit.id}
                  </span>

                  <h2>
                    {unit.title}
                  </h2>

                </div>

                <button className="more">
                  ⋯
                </button>

              </div>


              {/* ================= SKILL PATH ================= */}

              <div className="path">

                {unit.skills.map(
                  (skill, index) => {

                    /*
                     * UNLOCK LOGIC
                     *
                     * First skill is unlocked.
                     *
                     * Every next skill becomes unlocked
                     * when the previous skill is completed.
                     */

                    const previousSkill =
                      unit.skills[index - 1];

                    const unlocked =
                      index === 0 ||
                      previousSkill?.completed === true;


                    return (

                      <div
                        className={`skill ${
                          unlocked
                            ? "unlocked"
                            : "locked"
                        }`}
                        key={skill.id}
                      >

                        {/* CONNECTOR */}

                        <div className="connector" />


                        {/* SKILL BUTTON */}

                        <button
                          className="skill-button"
                          disabled={!unlocked}
                          onClick={() => {

                            if (
                              unlocked &&
                              skill.lesson_id
                            ) {

                              router.push(
                                `/lesson/${skill.lesson_id}`
                              );

                            }

                          }}
                        >

                          {/* COMPLETED */}

                          {skill.completed

                            ? "✓"

                            /* UNLOCKED */

                            : unlocked

                            ? "★"

                            /* LOCKED */

                            : "🔒"}

                        </button>


                        {/* SKILL INFORMATION */}

                        <div className="skill-info">

                          <strong>
                            {skill.title}
                          </strong>

                          <span>
                            {skill.description}
                          </span>


                          {/* CROWNS */}

                          <div className="crowns">

                            {[0, 1, 2, 3, 4].map(
                              (crown) => (

                                <span
                                  key={crown}
                                >
                                  {crown <
                                  skill.crowns
                                    ? "★"
                                    : "☆"}
                                </span>

                              )
                            )}

                          </div>


                          {/* COMPLETED LABEL */}

                          {skill.completed && (

                            <span className="completed-label">
                              ✓ Completed
                            </span>

                          )}

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </div>

          ))}

        </section>

      </div>

    </main>
  );
}