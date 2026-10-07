"use client";

import { useEffect, useState } from "react";

type LeaderboardUser = {
  rank: number;
  id: number;
  name: string;
  xp: number;
  streak: number;
};

type LeaderboardData = {
  leaderboard: LeaderboardUser[];
};

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://duolingo-clone-jqmu.onrender.com
    // /api/leaderboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load leaderboard:", error);
        setLoading(false);
      });
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="loading">
        Loading leaderboard...
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (!data) {
    return (
      <div className="loading">
        Failed to load leaderboard.
      </div>
    );
  }

  const leaderboard = data.leaderboard || [];

  const first = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main className="leaderboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="leaderboard-header">

        <button
          className="back-button"
          onClick={() => {
            window.location.href = "/";
          }}
          aria-label="Back to learning"
        >
          ←
        </button>

        <div>
          <h1>🏆 Leaderboard</h1>

          <p>
            Compete, learn and climb the rankings
          </p>
        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="leaderboard-content">


        {/* ===================================================
            CURRENT LEAGUE
        =================================================== */}

        <div className="league-banner">

          <div className="league-icon">
            🏆
          </div>

          <div className="league-info">

            <span className="league-label">
              CURRENT LEAGUE
            </span>

            <h2>
              Bronze League
            </h2>

            <p>
              Keep learning to climb higher!
            </p>

          </div>

          <div className="league-progress">

            <strong>
              {leaderboard.length}
            </strong>

            <span>
              {leaderboard.length === 1
                ? "Learner"
                : "Learners"}
            </span>

          </div>

        </div>


        {/* ===================================================
            TOP LEARNERS
        =================================================== */}

        <div className="podium-section">

          <div className="section-heading">

            <div>

              <span>
                THIS WEEK
              </span>

              <h2>
                Top Learners
              </h2>

            </div>

            <div className="week-badge">
              Weekly
            </div>

          </div>


          {/* =================================================
              NO USERS
          ================================================= */}

          {leaderboard.length === 0 && (

            <div className="podium">

              <div className="empty-leaderboard">

                <div>
                  🦉
                </div>

                <h3>
                  You're the first learner!
                </h3>

                <p>
                  Start learning to appear on
                  the leaderboard.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              ONLY ONE USER
          ================================================= */}

          {leaderboard.length === 1 && first && (

            <div className="podium solo-podium">

              <div className="podium-user first">

                <div className="crown">
                  👑
                </div>

                <div className="podium-avatar large">
                  🦉
                </div>

                <div className="podium-medal">
                  🥇
                </div>

                <strong>
                  {first.name}
                </strong>

                <span>
                  ⭐ {first.xp} XP
                </span>

                <div className="podium-block">
                  #1
                </div>

              </div>


              <div className="solo-message">

                <strong>
                  🎉 You're currently #1!
                </strong>

                <p>
                  Keep learning to defend your
                  position and climb higher.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              TWO USERS
          ================================================= */}

          {leaderboard.length === 2 && first && second && (

            <div className="podium">

              {/* SECOND */}

              <div className="podium-user second">

                <div className="podium-avatar">
                  🦉
                </div>

                <div className="podium-medal">
                  🥈
                </div>

                <strong>
                  {second.name}
                </strong>

                <span>
                  ⭐ {second.xp} XP
                </span>

                <div className="podium-block">
                  2
                </div>

              </div>


              {/* FIRST */}

              <div className="podium-user first">

                <div className="crown">
                  👑
                </div>

                <div className="podium-avatar large">
                  🦉
                </div>

                <div className="podium-medal">
                  🥇
                </div>

                <strong>
                  {first.name}
                </strong>

                <span>
                  ⭐ {first.xp} XP
                </span>

                <div className="podium-block">
                  1
                </div>

              </div>

            </div>

          )}


          {/* =================================================
              THREE OR MORE USERS
          ================================================= */}

          {leaderboard.length >= 3 && first && second && third && (

            <div className="podium">

              {/* SECOND PLACE */}

              <div className="podium-user second">

                <div className="podium-avatar">
                  🦉
                </div>

                <div className="podium-medal">
                  🥈
                </div>

                <strong>
                  {second.name}
                </strong>

                <span>
                  ⭐ {second.xp} XP
                </span>

                <div className="podium-block">
                  2
                </div>

              </div>


              {/* FIRST PLACE */}

              <div className="podium-user first">

                <div className="crown">
                  👑
                </div>

                <div className="podium-avatar large">
                  🦉
                </div>

                <div className="podium-medal">
                  🥇
                </div>

                <strong>
                  {first.name}
                </strong>

                <span>
                  ⭐ {first.xp} XP
                </span>

                <div className="podium-block">
                  1
                </div>

              </div>


              {/* THIRD PLACE */}

              <div className="podium-user third">

                <div className="podium-avatar">
                  🦉
                </div>

                <div className="podium-medal">
                  🥉
                </div>

                <strong>
                  {third.name}
                </strong>

                <span>
                  ⭐ {third.xp} XP
                </span>

                <div className="podium-block">
                  3
                </div>

              </div>

            </div>

          )}

        </div>


        {/* ===================================================
            WEEKLY RANKINGS
        =================================================== */}

        <div className="leaderboard-card">

          <div className="leaderboard-title">

            <div>

              <span>
                WEEKLY RANKINGS
              </span>

              <strong>
                Learners
              </strong>

            </div>

            <strong>
              XP
            </strong>

          </div>


          {/* =================================================
              LEARNER ROWS
          ================================================= */}

          {leaderboard.map((user) => (

            <div
              className={`leaderboard-row ${
                user.rank === 1
                  ? "first"
                  : user.rank === 2
                  ? "second"
                  : user.rank === 3
                  ? "third"
                  : ""
              }`}
              key={user.id}
            >

              {/* RANK */}

              <div className="rank">

                {user.rank === 1
                  ? "🥇"
                  : user.rank === 2
                  ? "🥈"
                  : user.rank === 3
                  ? "🥉"
                  : `#${user.rank}`}

              </div>


              {/* USER */}

              <div className="leader-user">

                <div className="avatar">
                  🦉
                </div>

                <div>

                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    🔥 {user.streak} day streak
                  </span>

                </div>

              </div>


              {/* XP */}

              <div className="leader-xp">
                ⭐ {user.xp} XP
              </div>

            </div>

          ))}


          {/* EMPTY STATE */}

          {leaderboard.length === 0 && (

            <div className="empty-leaderboard">

              <div>
                🦉
              </div>

              <h3>
                No rankings yet
              </h3>

              <p>
                Complete a lesson to become the
                first learner.
              </p>

            </div>

          )}

        </div>


        {/* ===================================================
            MOTIVATION
        =================================================== */}

        <div className="leaderboard-motivation">

          <div className="motivation-icon">
            🔥
          </div>

          <div>

            <strong>
              Keep your streak alive!
            </strong>

            <p>
              Complete a lesson today to earn
              more XP and climb the leaderboard.
            </p>

          </div>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Learn
          </button>

        </div>

      </section>

    </main>
  );
}