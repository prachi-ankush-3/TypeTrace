from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    tests = relationship("TypingTest", back_populates="user", cascade="all,delete")

class TypingTest(Base):
    __tablename__ = "typing_tests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration = Column(Integer, nullable=False)
    paragraph = Column(Text, nullable=False)
    wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    correct_chars = Column(Integer, default=0)
    incorrect_chars = Column(Integer, default=0)
    errors = Column(Integer, default=0)
    time_taken = Column(Float, default=0)
    score = Column(Float, default=0)
    ghost_test_id = Column(Integer, nullable=True)
    ghost_won = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    timeline = Column(Text, default="[]")
    user = relationship("User", back_populates="tests")

class UserStats(Base):
    __tablename__ = "user_stats"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    best_wpm = Column(Float, default=0)
    best_accuracy = Column(Float, default=0)
    average_wpm = Column(Float, default=0)
    average_accuracy = Column(Float, default=0)
    total_tests = Column(Integer, default=0)
    total_typing_time = Column(Float, default=0)

class Streak(Base):
    __tablename__ = "streaks"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    last_test_date = Column(String(10), nullable=True)

class Ghost(Base):
    __tablename__ = "ghosts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    best_wpm = Column(Float, default=0)
    best_accuracy = Column(Float, default=0)
    ghost_name = Column(String(80), default="THE FIRST TRACE")
    created_at = Column(DateTime, default=datetime.utcnow)
    best_test_id = Column(Integer, nullable=True)

class GhostRace(Base):
    __tablename__ = "ghost_races"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ghost_test_id = Column(Integer, ForeignKey("typing_tests.id"), nullable=False)
    current_test_id = Column(Integer, ForeignKey("typing_tests.id"), nullable=False)
    ghost_score = Column(Float, default=0)
    current_score = Column(Float, default=0)
    won = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_key = Column(String(80), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("user_id", "achievement_key"),)

class KeyStats(Base):
    __tablename__ = "key_stats"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key = Column(String(1), nullable=False)
    mistakes = Column(Integer, default=0)
    correct = Column(Integer, default=0)
    __table_args__ = (UniqueConstraint("user_id", "key"),)
