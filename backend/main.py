from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import Base, engine, get_db

from models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserSkillProgress,
    LessonAttempt,
    PracticeAttempt,
)


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Duolingo Clone API"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://duolingo-clone-phi-nine.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class PracticeCompleteRequest(BaseModel):
    xp_earned: int
    correct_answers: int
    total_questions: int


class LessonCompleteRequest(BaseModel):
    xp_earned: int
    correct_answers: int
    total_questions: int
    hearts: int


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Duolingo Clone API is running"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }


# ============================================================
# HOME
# ============================================================

@app.get("/api/home")
def get_home(
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .first()
    )

    course = (
        db.query(Course)
        .first()
    )

    if not user or not course:
        return {
            "error": "Database has not been seeded"
        }

    units = (
        db.query(Unit)
        .filter(
            Unit.course_id == course.id
        )
        .order_by(
            Unit.order_index
        )
        .all()
    )

    result = []

    for unit in units:

        skills = (
            db.query(Skill)
            .filter(
                Skill.unit_id == unit.id
            )
            .order_by(
                Skill.order_index
            )
            .all()
        )

        skill_data = []

        for skill in skills:

            lesson = (
                db.query(Lesson)
                .filter(
                    Lesson.skill_id == skill.id
                )
                .order_by(
                    Lesson.order_index
                )
                .first()
            )

            progress = (
                db.query(UserSkillProgress)
                .filter(
                    UserSkillProgress.user_id == user.id,
                    UserSkillProgress.skill_id == skill.id
                )
                .first()
            )

            skill_data.append({
                "id": skill.id,
                "title": skill.title,
                "description": skill.description,

                "lesson_id": (
                    lesson.id
                    if lesson
                    else None
                ),

                "completed": (
                    progress.completed
                    if progress
                    else False
                ),

                "progress": (
                    progress.progress
                    if progress
                    else 0
                ),

                "crowns": (
                    progress.crowns
                    if progress
                    else 0
                ),
            })

        result.append({
            "id": unit.id,
            "title": unit.title,
            "skills": skill_data,
        })

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "xp": user.xp,
            "streak": user.streak,
            "hearts": user.hearts,
            "gems": user.gems,
        },

        "course": {
            "id": course.id,
            "name": course.name,
            "language": course.language,
        },

        "units": result,
    }


# ============================================================
# GET LESSON
# ============================================================

@app.get("/api/lesson/{lesson_id}")
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if not lesson:
        return {
            "error": "Lesson not found"
        }

    exercises = (
        db.query(Exercise)
        .filter(
            Exercise.lesson_id == lesson_id
        )
        .order_by(
            Exercise.order_index
        )
        .all()
    )

    return {
        "id": lesson.id,
        "title": lesson.title,

        "exercises": [
            {
                "id": exercise.id,

                "type": exercise.type,

                "question": exercise.question,

                "correct_answer":
                    exercise.correct_answer,

                "options": (
                    exercise.options.split("|")
                    if exercise.options
                    else []
                ),
            }

            for exercise in exercises
        ],
    }


# ============================================================
# COMPLETE LESSON
# ============================================================

@app.post("/api/lesson/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    data: LessonCompleteRequest,
    db: Session = Depends(get_db)
):

    # ========================================================
    # GET USER
    # ========================================================

    user = (
        db.query(User)
        .first()
    )

    if not user:
        return {
            "error": "User not found"
        }


    # ========================================================
    # GET LESSON
    # ========================================================

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if not lesson:
        return {
            "error": "Lesson not found"
        }


    # ========================================================
    # GET DATA FROM JSON BODY
    # ========================================================

    xp_earned = max(
        0,
        data.xp_earned
    )

    correct_answers = max(
        0,
        data.correct_answers
    )

    total_questions = max(
        0,
        data.total_questions
    )

    hearts = max(
        0,
        data.hearts
    )


    # ========================================================
    # UPDATE USER STATS
    # ========================================================

    user.xp += xp_earned

    user.hearts = hearts


    # ========================================================
    # CREATE LESSON ATTEMPT
    # ========================================================

    attempt = LessonAttempt(
        user_id=user.id,

        lesson_id=lesson_id,

        xp_earned=xp_earned,

        correct_answers=correct_answers,

        total_questions=total_questions,
    )

    db.add(attempt)


    # ========================================================
    # UPDATE SKILL PROGRESS + CROWNS
    # ========================================================

    crowns_earned = 1

    if lesson.skill_id:

        skill_progress = (
            db.query(
                UserSkillProgress
            )
            .filter(
                UserSkillProgress.user_id == user.id,
                UserSkillProgress.skill_id == lesson.skill_id
            )
            .first()
        )


        # ====================================================
        # CALCULATE SCORE
        # ====================================================

        if total_questions > 0:

            percentage = (
                correct_answers /
                total_questions
            ) * 100

        else:

            percentage = 0


        # ====================================================
        # CROWN SYSTEM
        # ====================================================

        if percentage >= 90:

            crowns_earned = 5

        elif percentage >= 80:

            crowns_earned = 4

        elif percentage >= 70:

            crowns_earned = 3

        elif percentage >= 60:

            crowns_earned = 2

        else:

            crowns_earned = 1


        # ====================================================
        # FIRST COMPLETION
        # ====================================================

        if not skill_progress:

            skill_progress = UserSkillProgress(

                user_id=user.id,

                skill_id=lesson.skill_id,

                completed=True,

                progress=100,

                crowns=crowns_earned,

            )

            db.add(
                skill_progress
            )


        # ====================================================
        # EXISTING COMPLETION
        # ====================================================

        else:

            skill_progress.completed = True

            skill_progress.progress = 100

            # Keep the highest crown ever achieved
            skill_progress.crowns = max(
                skill_progress.crowns,
                crowns_earned
            )


    # ========================================================
    # SAVE
    # ========================================================

    db.commit()

    db.refresh(user)

    db.refresh(attempt)


    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "message":
            "Lesson completed successfully",

        "user": {

            "id": user.id,

            "name": user.name,

            "xp": user.xp,

            "hearts": user.hearts,

            "streak": user.streak,

            "gems": user.gems,

        },

        "lesson": {

            "id": lesson.id,

            "completed": True,

            "xp_earned":
                xp_earned,

            "correct_answers":
                correct_answers,

            "total_questions":
                total_questions,

            "crowns_earned":
                crowns_earned,

        },

    }


# ============================================================
# PRACTICE
# ============================================================

@app.get("/api/practice")
def get_practice(
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .first()
    )

    if not user:
        return {
            "error": "User not found"
        }

    exercises = (
        db.query(Exercise)
        .order_by(
            Exercise.id
        )
        .all()
    )

    if not exercises:
        return {
            "error": "No practice questions found"
        }

    return {

        "user": {

            "id": user.id,

            "name": user.name,

            "xp": user.xp,

            "streak": user.streak,

            "hearts": user.hearts,

            "gems": user.gems,

        },

        "exercises": [

            {

                "id": exercise.id,

                "type": exercise.type,

                "question": exercise.question,

                "correct_answer":
                    exercise.correct_answer,

                "options": (

                    exercise.options.split("|")

                    if exercise.options

                    else []

                ),

            }

            for exercise in exercises

        ]

    }


# ============================================================
# COMPLETE PRACTICE
# ============================================================

@app.post("/api/practice/complete")
def complete_practice(
    data: PracticeCompleteRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .first()
    )

    if not user:
        return {
            "error": "User not found"
        }


    # ========================================================
    # VALIDATE VALUES
    # ========================================================

    xp_earned = max(
        0,
        data.xp_earned
    )

    correct_answers = max(
        0,
        data.correct_answers
    )

    total_questions = max(
        0,
        data.total_questions
    )


    # ========================================================
    # AWARD XP
    # ========================================================

    user.xp += xp_earned


    # ========================================================
    # RESTORE ONE HEART
    # ========================================================

    old_hearts = user.hearts

    user.hearts = min(
        user.hearts + 1,
        3
    )

    heart_restored = (
        user.hearts > old_hearts
    )


    # ========================================================
    # SAVE PRACTICE ATTEMPT
    # ========================================================

    practice_attempt = PracticeAttempt(

        user_id=user.id,

        xp_earned=xp_earned,

        correct_answers=correct_answers,

        total_questions=total_questions,

        hearts_remaining=user.hearts,

    )

    db.add(
        practice_attempt
    )


    # ========================================================
    # SAVE EVERYTHING
    # ========================================================

    db.commit()

    db.refresh(user)

    db.refresh(
        practice_attempt
    )


    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "message":
            "Practice completed successfully",

        "user": {

            "id": user.id,

            "name": user.name,

            "xp": user.xp,

            "hearts": user.hearts,

            "streak": user.streak,

            "gems": user.gems,

        },

        "practice": {

            "id":
                practice_attempt.id,

            "xp_earned":
                xp_earned,

            "correct_answers":
                correct_answers,

            "total_questions":
                total_questions,

            "heart_restored":
                heart_restored,

            "hearts_remaining":
                practice_attempt.hearts_remaining,

            "completed_at":
                practice_attempt.completed_at,

        },

    }


# ============================================================
# LATEST PRACTICE
# ============================================================

@app.get("/api/practice/latest")
def get_latest_practice(
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .first()
    )

    if not user:
        return {
            "error": "User not found"
        }


    attempt = (
        db.query(PracticeAttempt)
        .filter(
            PracticeAttempt.user_id == user.id
        )
        .order_by(
            PracticeAttempt.completed_at.desc()
        )
        .first()
    )


    if not attempt:

        return {
            "has_practice": False
        }


    return {

        "has_practice": True,

        "practice": {

            "id":
                attempt.id,

            "xp_earned":
                attempt.xp_earned,

            "correct_answers":
                attempt.correct_answers,

            "total_questions":
                attempt.total_questions,

            "hearts_remaining":
                attempt.hearts_remaining,

            "completed_at":
                attempt.completed_at,

        }

    }


# ============================================================
# LEADERBOARD
# ============================================================

@app.get("/api/leaderboard")
def get_leaderboard(
    db: Session = Depends(get_db)
):

    users = (
        db.query(User)
        .order_by(
            User.xp.desc()
        )
        .all()
    )

    leaderboard = []

    for index, user in enumerate(users):

        leaderboard.append({

            "rank":
                index + 1,

            "id":
                user.id,

            "name":
                user.name,

            "xp":
                user.xp,

            "streak":
                user.streak,

        })


    return {

        "leaderboard":
            leaderboard

    }