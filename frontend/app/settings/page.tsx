"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <main className="settings-page">

      {/* HEADER */}

      <header className="settings-header">

        <button
          className="settings-back"
          onClick={goHome}
        >
          ←
        </button>

        <div>
          <h1>⚙️ Settings</h1>
          <p>Manage your learning experience</p>
        </div>

      </header>


      {/* CONTENT */}

      <section className="settings-content">

        {/* ACCOUNT */}

        <div className="settings-card">

          <h2>Account</h2>

          <div className="setting-row">

            <div>
              <strong>Profile</strong>
              <span>View your learning progress</span>
            </div>

            <button
              className="settings-action"
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              View
            </button>

          </div>

        </div>


        {/* PREFERENCES */}

        <div className="settings-card">

          <h2>Preferences</h2>

          <div className="setting-row">

            <div>
              <strong>Sound Effects</strong>
              <span>Play sounds during lessons</span>
            </div>

            <button
              className={`toggle ${
                sound ? "on" : ""
              }`}
              onClick={() => setSound(!sound)}
            >
              <span />
            </button>

          </div>


          <div className="setting-row">

            <div>
              <strong>Notifications</strong>
              <span>Receive learning reminders</span>
            </div>

            <button
              className={`toggle ${
                notifications ? "on" : ""
              }`}
              onClick={() =>
                setNotifications(!notifications)
              }
            >
              <span />
            </button>

          </div>

        </div>


        {/* LEARNING */}

        <div className="settings-card">

          <h2>Learning</h2>

          <div className="setting-row">

            <div>
              <strong>Practice</strong>
              <span>Review words and skills</span>
            </div>

            <button
              className="settings-action"
              onClick={() => {
                window.location.href = "/practice";
              }}
            >
              Practice
            </button>

          </div>


          <div className="setting-row">

            <div>
              <strong>Leaderboard</strong>
              <span>See your ranking</span>
            </div>

            <button
              className="settings-action"
              onClick={() => {
                window.location.href = "/leaderboard";
              }}
            >
              View
            </button>

          </div>

        </div>


        {/* ABOUT */}

        <div className="settings-card">

          <h2>About</h2>

          <div className="about-row">
            <strong>Duolingo Clone</strong>
            <span>Learning platform project</span>
          </div>

          <div className="about-row">
            <strong>Version</strong>
            <span>1.0.0</span>
          </div>

        </div>


        {/* BACK */}

        <button
          className="home-button"
          onClick={goHome}
        >
          ← Back to Learning
        </button>

      </section>

    </main>
  );
}