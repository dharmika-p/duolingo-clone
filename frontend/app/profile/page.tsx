"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


// ============================================================
// TYPES
// ============================================================

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


// ============================================================
// PRACTICE DATA
// ============================================================

type PracticeData = {
  has_practice: boolean;

  practice?: {
    id: number;
    xp_earned: number;
    correct_answers: number;
    total_questions: number;
    hearts_remaining: number;
    completed_at: string;
  };
};


// ============================================================
// PROFILE PAGE
// ============================================================

export default function ProfilePage() {

  const router = useRouter();


  // ==========================================================
  // STATE
  // ==========================================================

  const [data, setData] =
    useState<HomeData | null>(null);

  const [practice, setPractice] =
    useState<PracticeData | null>(null);

  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // LOAD PROFILE + PRACTICE DATA
  // ==========================================================

  useEffect(() => {

    // --------------------------------------------------------
    // Load profile data
    // --------------------------------------------------------

    fetch("http://localhost:8000/api/home")

      .then((res) => res.json())

      .then((result) => {

        console.log(
          "PROFILE DATA:",
          result
        );

        setData(result);

        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Failed to load profile:",
          error
        );

        setLoading(false);

      });


    // --------------------------------------------------------
    // Load latest practice attempt
    // --------------------------------------------------------

    fetch(
      "http://localhost:8000/api/practice/latest"
    )

      .then((res) => res.json())

      .then((result) => {

        console.log(
          "LATEST PRACTICE:",
          result
        );

        setPractice(result);

      })

      .catch((error) => {

        console.error(
          "Failed to load practice history:",
          error
        );

      });

  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="loading">

        Loading profile...

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (!data) {

    return (

      <div className="loading">

        Failed to load profile.

      </div>

    );

  }


  // ==========================================================
  // CALCULATE PROGRESS
  // ==========================================================

  const allSkills =
    data.units.flatMap(
      (unit) => unit.skills
    );


  const totalSkills =
    allSkills.length;


  const completedSkills =
    allSkills.filter(
      (skill) => skill.completed
    ).length;


  const totalCrowns =
    allSkills.reduce(
      (total, skill) =>
        total + skill.crowns,
      0
    );


  const maxCrowns =
    totalSkills * 5;


  const overallProgress =
    totalSkills > 0
      ? Math.round(
          (completedSkills /
            totalSkills) *
            100
        )
      : 0;


  // ==========================================================
  // FORMAT PRACTICE DATE
  // ==========================================================

  const formatPracticeDate = (
    dateString: string
  ) => {

    const date =
      new Date(dateString);

    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <main className="profile-page">


      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="topbar">

        <div className="logo">
          duolingo
        </div>


        <div className="stats">

          <div className="stat">

            🔥{" "}

            <span>
              {data.user.streak}
            </span>

          </div>


          <div className="stat">

            💎{" "}

            <span>
              {data.user.gems}
            </span>

          </div>


          <div className="stat">

            ❤️{" "}

            <span>
              {data.user.hearts}
            </span>

          </div>


          <div className="stat">

            ⭐{" "}

            <span>
              {data.user.xp} XP
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          LAYOUT
      ===================================================== */}

      <div className="layout">


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="sidebar">


          <div className="side-logo">
            🦉
          </div>


          <button
            className="nav"
            onClick={() =>
              router.push("/")
            }
          >

            🏠

            <span>
              Learn
            </span>

          </button>


          <button
            className="nav"
            onClick={() =>
              router.push("/practice")
            }
          >

            🏋️

            <span>
              Practice
            </span>

          </button>


          <button
            className="nav"
            onClick={() =>
              router.push("/leaderboard")
            }
          >

            🏆

            <span>
              Leaderboard
            </span>

          </button>


          <button className="nav active">

            👤

            <span>
              Profile
            </span>

          </button>


          <button
            className="nav"
            onClick={() =>
              router.push("/settings")
            }
          >

            ⚙️

            <span>
              Settings
            </span>

          </button>


        </aside>


        {/* ===================================================
            PROFILE CONTENT
        =================================================== */}

        <section className="profile-content">


          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="profile-header">


            <div className="profile-avatar">
              🦉
            </div>


            <div>

              <p className="eyebrow">
                PROFILE
              </p>


              <h1>
                {data.user.name}
              </h1>


              <p>
                Learning{" "}
                {data.course.language}
              </p>

            </div>


          </div>


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="profile-stats">


            {/* TOTAL XP */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                ⭐
              </div>

              <div>

                <strong>
                  {data.user.xp}
                </strong>

                <span>
                  Total XP
                </span>

              </div>

            </div>


            {/* STREAK */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                🔥
              </div>

              <div>

                <strong>
                  {data.user.streak}
                </strong>

                <span>
                  Day Streak
                </span>

              </div>

            </div>


            {/* GEMS */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                💎
              </div>

              <div>

                <strong>
                  {data.user.gems}
                </strong>

                <span>
                  Gems
                </span>

              </div>

            </div>


            {/* HEARTS */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon">
                ❤️
              </div>

              <div>

                <strong>
                  {data.user.hearts}
                </strong>

                <span>
                  Hearts
                </span>

              </div>

            </div>


          </div>


          {/* =================================================
              COURSE PROGRESS
          ================================================= */}

          <div className="profile-card">


            <div className="profile-card-header">


              <div>

                <p className="eyebrow">
                  COURSE PROGRESS
                </p>


                <h2>
                  {data.course.name}
                </h2>

              </div>


              <strong className="progress-percentage">

                {overallProgress}%

              </strong>


            </div>


            <div className="profile-progress-bar">

              <div
                className="profile-progress-fill"
                style={{
                  width:
                    `${overallProgress}%`,
                }}
              />

            </div>


            <div className="progress-details">

              <span>

                {completedSkills} of{" "}

                {totalSkills} skills completed

              </span>


              <span>

                {totalCrowns} /{" "}

                {maxCrowns} crowns

              </span>

            </div>


          </div>


          {/* =================================================
              LEARNING UNITS
          ================================================= */}

          <div className="profile-card">


            <div className="profile-card-header">


              <div>

                <p className="eyebrow">
                  LEARNING PATH
                </p>


                <h2>
                  Your Progress
                </h2>

              </div>


            </div>


            <div className="unit-progress-list">


              {data.units.map(
                (unit) => {

                  const unitCompleted =
                    unit.skills.filter(
                      (skill) =>
                        skill.completed
                    ).length;


                  const unitTotal =
                    unit.skills.length;


                  const unitProgress =
                    unitTotal > 0
                      ? Math.round(
                          (unitCompleted /
                            unitTotal) *
                            100
                        )
                      : 0;


                  return (

                    <div
                      className="unit-progress"
                      key={unit.id}
                    >


                      <div className="unit-progress-top">


                        <div>

                          <strong>
                            Unit {unit.id}
                          </strong>

                          <span>
                            {unit.title}
                          </span>

                        </div>


                        <strong>
                          {unitProgress}%
                        </strong>


                      </div>


                      <div className="unit-progress-bar">

                        <div
                          className="unit-progress-fill"
                          style={{
                            width:
                              `${unitProgress}%`,
                          }}
                        />

                      </div>


                      <small>

                        {unitCompleted} of{" "}

                        {unitTotal} skills
                        completed

                      </small>


                    </div>

                  );

                }
              )}


            </div>

          </div>


          {/* =================================================
              PRACTICE HISTORY
          ================================================= */}

          <div className="profile-card">


            <div className="profile-card-header">


              <div>

                <p className="eyebrow">
                  PRACTICE
                </p>


                <h2>
                  Recent Practice
                </h2>

              </div>


              {practice?.has_practice && (

                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#58cc02",
                  }}
                >
                  Completed ✓
                </span>

              )}

            </div>


            {/* =================================================
                NO PRACTICE YET
            ================================================= */}

            {!practice?.has_practice ? (

              <div
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                  color: "#777",
                }}
              >

                <div
                  style={{
                    fontSize: "36px",
                    marginBottom: "8px",
                  }}
                >
                  📝
                </div>


                <strong>
                  No practice sessions yet
                </strong>


                <p
                  style={{
                    marginTop: "6px",
                    fontSize: "14px",
                  }}
                >
                  Complete a practice
                  session to see your
                  results here.
                </p>


              </div>

            ) : (

              <>


                {/* =============================================
                    PRACTICE RESULT CARDS
                ============================================= */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >


                  {/* SCORE */}

                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      background: "#f7f7f7",
                      textAlign: "center",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      🎯
                    </div>


                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        marginTop: "5px",
                      }}
                    >
                      {
                        practice.practice
                          ?.correct_answers
                      }

                      /

                      {
                        practice.practice
                          ?.total_questions
                      }

                    </strong>


                    <span
                      style={{
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      Correct
                    </span>


                  </div>


                  {/* XP */}

                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      background: "#f7f7f7",
                      textAlign: "center",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      ⭐
                    </div>


                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        marginTop: "5px",
                      }}
                    >
                      +

                      {
                        practice.practice
                          ?.xp_earned
                      }

                    </strong>


                    <span
                      style={{
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      XP Earned
                    </span>


                  </div>


                  {/* HEARTS */}

                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      background: "#f7f7f7",
                      textAlign: "center",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      ❤️
                    </div>


                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        marginTop: "5px",
                      }}
                    >
                      {
                        practice.practice
                          ?.hearts_remaining
                      }

                    </strong>


                    <span
                      style={{
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      Hearts Remaining
                    </span>


                  </div>


                </div>


                {/* =============================================
                    COMPLETION DATE
                ============================================= */}

                {practice.practice && (

                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "12px",
                      borderTop:
                        "1px solid #e5e5e5",
                      fontSize: "13px",
                      color: "#777",
                    }}
                  >

                    🕐 Completed{" "}

                    {formatPracticeDate(
                      practice.practice
                        .completed_at
                    )}

                  </div>

                )}


              </>

            )}


          </div>


          {/* =================================================
              ACHIEVEMENTS
          ================================================= */}

          <div className="profile-card">


            <div className="profile-card-header">


              <div>

                <p className="eyebrow">
                  ACHIEVEMENTS
                </p>


                <h2>
                  Your Milestones
                </h2>

              </div>


            </div>


            <div className="achievements">


              {/* FIRST LESSON */}

              <div
                className={
                  `achievement ${
                    completedSkills >= 1
                      ? "earned"
                      : ""
                  }`
                }
              >

                <div className="achievement-icon">
                  🎯
                </div>


                <div>

                  <strong>
                    First Lesson
                  </strong>


                  <span>
                    Complete your first
                    lesson
                  </span>

                </div>


              </div>


              {/* XP HUNTER */}

              <div
                className={
                  `achievement ${
                    data.user.xp >= 100
                      ? "earned"
                      : ""
                  }`
                }
              >

                <div className="achievement-icon">
                  ⭐
                </div>


                <div>

                  <strong>
                    XP Hunter
                  </strong>


                  <span>
                    Earn 100 XP
                  </span>

                </div>


              </div>


              {/* ON FIRE */}

              <div
                className={
                  `achievement ${
                    data.user.streak >= 3
                      ? "earned"
                      : ""
                  }`
                }
              >

                <div className="achievement-icon">
                  🔥
                </div>


                <div>

                  <strong>
                    On Fire
                  </strong>


                  <span>
                    Reach a 3 day streak
                  </span>

                </div>


              </div>


              {/* COURSE EXPLORER */}

              <div
                className={
                  `achievement ${
                    completedSkills >= 5
                      ? "earned"
                      : ""
                  }`
                }
              >

                <div className="achievement-icon">
                  🏆
                </div>


                <div>

                  <strong>
                    Course Explorer
                  </strong>


                  <span>
                    Complete 5 skills
                  </span>

                </div>


              </div>


            </div>


          </div>


        </section>


      </div>


    </main>

  );

}