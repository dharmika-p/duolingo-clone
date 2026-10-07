from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


# ============================================================
# USER
# ============================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Learner")

    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=100)

    # --------------------------------------------------------
    # Relationships
    # --------------------------------------------------------

    skill_progress = relationship(
        "UserSkillProgress",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    lesson_attempts = relationship(
        "LessonAttempt",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    practice_attempts = relationship(
        "PracticeAttempt",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ============================================================
# COURSE
# ============================================================

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    language = Column(String)

    units = relationship(
        "Unit",
        back_populates="course",
        cascade="all, delete-orphan"
    )


# ============================================================
# UNIT
# ============================================================

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    order_index = Column(Integer)

    course_id = Column(
        Integer,
        ForeignKey("courses.id")
    )

    course = relationship(
        "Course",
        back_populates="units"
    )

    skills = relationship(
        "Skill",
        back_populates="unit",
        cascade="all, delete-orphan"
    )


# ============================================================
# SKILL
# ============================================================

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    description = Column(String)
    order_index = Column(Integer)

    unit_id = Column(
        Integer,
        ForeignKey("units.id")
    )

    unit = relationship(
        "Unit",
        back_populates="skills"
    )

    lessons = relationship(
        "Lesson",
        back_populates="skill",
        cascade="all, delete-orphan"
    )


# ============================================================
# LESSON
# ============================================================

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    order_index = Column(Integer)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id")
    )

    skill = relationship(
        "Skill",
        back_populates="lessons"
    )

    exercises = relationship(
        "Exercise",
        back_populates="lesson",
        cascade="all, delete-orphan"
    )


# ============================================================
# EXERCISE
# ============================================================

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(String)
    question = Column(String)
    correct_answer = Column(String)

    # Stored as a string, for example:
    # "Hola,Hello,Hi"
    options = Column(
        String,
        nullable=True
    )

    order_index = Column(Integer)

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id")
    )

    lesson = relationship(
        "Lesson",
        back_populates="exercises"
    )


# ============================================================
# USER SKILL PROGRESS
# ============================================================

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id")
    )

    completed = Column(
        Boolean,
        default=False
    )

    progress = Column(
        Integer,
        default=0
    )

    crowns = Column(
        Integer,
        default=0
    )

    user = relationship(
        "User",
        back_populates="skill_progress"
    )


# ============================================================
# LESSON ATTEMPT
# ============================================================

class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id")
    )

    xp_earned = Column(
        Integer,
        default=0
    )

    correct_answers = Column(
        Integer,
        default=0
    )

    total_questions = Column(
        Integer,
        default=0
    )

    completed_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="lesson_attempts"
    )


# ============================================================
# PRACTICE ATTEMPT
# ============================================================

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    # --------------------------------------------------------
    # Practice performance
    # --------------------------------------------------------

    xp_earned = Column(
        Integer,
        default=0
    )

    correct_answers = Column(
        Integer,
        default=0
    )

    total_questions = Column(
        Integer,
        default=0
    )

    # --------------------------------------------------------
    # Hearts remaining after practice
    # --------------------------------------------------------

    hearts_remaining = Column(
        Integer,
        default=5
    )

    # --------------------------------------------------------
    # Completion time
    # --------------------------------------------------------

    completed_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # --------------------------------------------------------
    # Relationship with User
    # --------------------------------------------------------

    user = relationship(
        "User",
        back_populates="practice_attempts"
    )