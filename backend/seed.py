from database import Base, engine, SessionLocal
from models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserSkillProgress,
)


def seed_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Avoid duplicating seed data
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    # -------------------------
    # User
    # -------------------------
    user = User(
        name="Dharmika",
        xp=120,
        streak=5,
        hearts=5,
        gems=120,
    )

    db.add(user)

    # -------------------------
    # Course
    # -------------------------
    course = Course(
        name="Spanish",
        language="Spanish",
    )

    db.add(course)
    db.flush()

    # -------------------------
    # Unit 1
    # -------------------------
    unit1 = Unit(
        title="Basics",
        order_index=1,
        course_id=course.id,
    )

    db.add(unit1)
    db.flush()

    # -------------------------
    # Skills
    # -------------------------
    skills_data = [
        ("Greetings", "Learn basic greetings", 1),
        ("Introductions", "Introduce yourself", 2),
        ("Common Words", "Useful everyday words", 3),
        ("Food", "Learn food vocabulary", 4),
        ("Numbers", "Learn numbers", 5),
    ]

    skills = []

    for title, description, order in skills_data:
        skill = Skill(
            title=title,
            description=description,
            order_index=order,
            unit_id=unit1.id,
        )

        db.add(skill)
        db.flush()
        skills.append(skill)

    # -------------------------
    # Lessons
    # -------------------------
    exercises_by_skill = [
        [
            ("multiple_choice", "How do you say Hello?", "Hola", "Hola|Gracias|Adiós"),
            ("type_answer", "Translate: Good morning", "Buenos días", None),
            ("multiple_choice", "How do you say Goodbye?", "Adiós", "Hola|Adiós|Gracias"),
            ("fill_blank", "Complete: ___ días", "Buenos", None),
            ("translate", "Translate: Thank you", "Gracias", None),
            ("type_answer", "Translate: Hello", "Hola", None),
        ],
        [
            ("multiple_choice", "How do you say I am Dharmika?", "Soy Dharmika", "Soy Dharmika|Tengo Dharmika|Estoy Dharmika"),
            ("type_answer", "Translate: My name is Ana", "Me llamo Ana", None),
            ("multiple_choice", "What does 'Soy' mean?", "I am", "I am|You are|They are"),
            ("fill_blank", "___ llamo Carlos", "Me", None),
            ("translate", "Translate: Nice to meet you", "Mucho gusto", None),
            ("type_answer", "Translate: I am a student", "Soy estudiante", None),
        ],
        [
            ("multiple_choice", "What does 'Sí' mean?", "Yes", "Yes|No|Please"),
            ("multiple_choice", "What does 'No' mean?", "No", "Yes|No|Thanks"),
            ("type_answer", "Translate: Please", "Por favor", None),
            ("translate", "Translate: Sorry", "Lo siento", None),
            ("fill_blank", "Por ___", "favor", None),
            ("multiple_choice", "What does 'Gracias' mean?", "Thank you", "Hello|Thank you|Goodbye"),
        ],
        [
            ("multiple_choice", "How do you say bread?", "Pan", "Pan|Leche|Agua"),
            ("multiple_choice", "How do you say water?", "Agua", "Pan|Agua|Arroz"),
            ("type_answer", "Translate: Milk", "Leche", None),
            ("translate", "Translate: Rice", "Arroz", None),
            ("fill_blank", "P___", "Pan", None),
            ("multiple_choice", "How do you say coffee?", "Café", "Café|Té|Agua"),
        ],
        [
            ("multiple_choice", "What is one in Spanish?", "Uno", "Uno|Dos|Tres"),
            ("multiple_choice", "What is two in Spanish?", "Dos", "Uno|Dos|Cinco"),
            ("type_answer", "Translate: Three", "Tres", None),
            ("translate", "Translate: Five", "Cinco", None),
            ("fill_blank", "Cua___", "Cuatro", None),
            ("multiple_choice", "What is ten in Spanish?", "Diez", "Seis|Ocho|Diez"),
        ],
    ]

    for skill_index, skill in enumerate(skills):
        lesson = Lesson(
            title=f"{skill.title} Lesson",
            order_index=1,
            skill_id=skill.id,
        )

        db.add(lesson)
        db.flush()

        for exercise_index, exercise_data in enumerate(
            exercises_by_skill[skill_index],
            start=1,
        ):
            exercise_type, question, answer, options = exercise_data

            exercise = Exercise(
                type=exercise_type,
                question=question,
                correct_answer=answer,
                options=options,
                order_index=exercise_index,
                lesson_id=lesson.id,
            )

            db.add(exercise)

        # First skill available, rest locked initially
        progress = UserSkillProgress(
            user_id=user.id,
            skill_id=skill.id,
            completed=False,
            progress=0,
            crowns=0,
        )

        db.add(progress)

    db.commit()
    db.close()

    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()