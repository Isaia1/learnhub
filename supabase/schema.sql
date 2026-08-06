-- LearnHub Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Courses
create table if not exists courses (
  id text primary key,
  title text not null,
  description text not null,
  subject text not null,
  icon text not null,
  color text not null,
  sort_order int default 0
);

alter table courses enable row level security;
create policy "Anyone can read courses" on courses for select using (true);

-- Lessons
create table if not exists lessons (
  id text primary key,
  course_id text not null references courses(id) on delete cascade,
  title text not null,
  content text not null,
  duration int not null,
  sort_order int default 0
);

alter table lessons enable row level security;
create policy "Anyone can read lessons" on lessons for select using (true);

-- Quiz questions
create table if not exists quiz_questions (
  id text primary key,
  course_id text not null references courses(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_index int not null,
  explanation text not null,
  sort_order int default 0
);

alter table quiz_questions enable row level security;
create policy "Anyone can read quizzes" on quiz_questions for select using (true);

-- Flashcards
create table if not exists flashcards (
  id text primary key,
  course_id text not null references courses(id) on delete cascade,
  front text not null,
  back text not null,
  sort_order int default 0
);

alter table flashcards enable row level security;
create policy "Anyone can read flashcards" on flashcards for select using (true);

-- Live classes
create table if not exists live_classes (
  id text primary key,
  title text not null,
  instructor text not null,
  subject text not null,
  scheduled_at text not null,
  duration int not null,
  participants int default 0,
  is_live boolean default false
);

alter table live_classes enable row level security;
create policy "Anyone can read live classes" on live_classes for select using (true);

-- User progress (per-user, synced across devices)
create table if not exists user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_lessons jsonb default '[]',
  quiz_scores jsonb default '{}',
  mastered_flashcards jsonb default '[]',
  streak int default 0,
  last_active_date date,
  total_xp int default 0,
  updated_at timestamptz default now()
);

alter table user_progress enable row level security;
create policy "Users can read own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on user_progress for update using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  insert into public.user_progress (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed course data
insert into courses (id, title, description, subject, icon, color, sort_order) values
  ('math-algebra', 'Algebra Fundamentals', 'Master the basics of algebra — equations, variables, and problem solving.', 'math', 'calculator-outline', '#6366F1', 1),
  ('science-physics', 'Physics Basics', 'Explore motion, forces, energy, and the laws that govern our universe.', 'science', 'flask-outline', '#10B981', 2),
  ('coding-basics', 'Intro to Programming', 'Learn programming fundamentals with JavaScript — variables, loops, and functions.', 'coding', 'code-slash', '#8B5CF6', 3),
  ('history-world', 'World History', 'Journey through major civilizations, wars, and turning points in human history.', 'history', 'globe-outline', '#F59E0B', 4)
on conflict (id) do nothing;

insert into lessons (id, course_id, title, content, duration, sort_order) values
  ('math-algebra-l1', 'math-algebra', 'Introduction to Variables', 'Variables are symbols (usually letters like x, y, or n) that represent unknown values in mathematical expressions.

For example, in the equation x + 5 = 12, x is the variable we need to solve for.

Key concepts:
• A variable can hold different values
• We use variables to write general rules
• Solving means finding the value that makes the equation true', 12, 1),
  ('math-algebra-l2', 'math-algebra', 'Solving Linear Equations', 'A linear equation has the form ax + b = c, where a, b, and c are constants.

Steps to solve:
1. Simplify both sides
2. Move variable terms to one side
3. Move constants to the other side
4. Divide by the coefficient

Example: 2x + 3 = 11 → 2x = 8 → x = 4', 15, 2),
  ('math-algebra-l3', 'math-algebra', 'Working with Inequalities', 'Inequalities use <, >, ≤, or ≥ instead of =.

Important rule: When you multiply or divide both sides by a negative number, flip the inequality sign.

Example: -2x > 6 → x < -3', 10, 3),
  ('science-physics-l1', 'science-physics', 'Newton''s First Law', 'An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced force.

This is also called the Law of Inertia.

Real-world example: When a car brakes suddenly, passengers lurch forward because their bodies want to keep moving.', 14, 1),
  ('science-physics-l2', 'science-physics', 'Force and Acceleration', 'Newton''s Second Law: F = ma

Force equals mass times acceleration.

• More force → more acceleration
• More mass → less acceleration for the same force

Unit of force: Newton (N)', 16, 2),
  ('coding-basics-l1', 'coding-basics', 'What is Programming?', 'Programming is giving instructions to a computer to perform tasks.

Programs are written in programming languages like JavaScript, Python, or Java.

Key concepts:
• Code is read top to bottom
• Computers follow instructions exactly
• Bugs are mistakes in code', 10, 1),
  ('coding-basics-l2', 'coding-basics', 'Variables and Data Types', 'Variables store data values.

In JavaScript:
let name = "Alice";    // string
let age = 25;           // number
let isStudent = true;   // boolean

Use const for values that won''t change, let for values that will.', 18, 2),
  ('history-world-l1', 'history-world', 'The Renaissance', 'The Renaissance (14th–17th century) was a period of cultural rebirth in Europe.

Key features:
• Revival of classical Greek and Roman art
• Humanism — focus on human potential
• Major artists: Leonardo da Vinci, Michelangelo
• Printing press spread knowledge rapidly', 20, 1)
on conflict (id) do nothing;

insert into quiz_questions (id, course_id, question, options, correct_index, explanation, sort_order) values
  ('math-algebra-q1', 'math-algebra', 'What is the value of x in: x + 7 = 15?', '["6","7","8","9"]', 2, 'Subtract 7 from both sides: x = 15 - 7 = 8', 1),
  ('math-algebra-q2', 'math-algebra', 'Solve: 3x - 4 = 11', '["x = 3","x = 4","x = 5","x = 6"]', 2, 'Add 4 to both sides: 3x = 15, then divide by 3: x = 5', 2),
  ('math-algebra-q3', 'math-algebra', 'Which symbol represents "greater than or equal to"?', '[">","<","≥","≠"]', 2, '≥ means greater than or equal to', 3),
  ('science-physics-q1', 'science-physics', 'What is Newton''s First Law also known as?', '["Law of Gravity","Law of Inertia","Law of Action-Reaction","Law of Energy"]', 1, 'Newton''s First Law is the Law of Inertia', 1),
  ('science-physics-q2', 'science-physics', 'F = ma represents which law?', '["First Law","Second Law","Third Law","Law of Gravity"]', 1, 'F = ma is Newton''s Second Law', 2),
  ('coding-basics-q1', 'coding-basics', 'Which keyword declares a variable that can be reassigned?', '["const","let","var only","static"]', 1, 'let declares a variable that can be reassigned', 1),
  ('coding-basics-q2', 'coding-basics', 'What data type is true?', '["string","number","boolean","object"]', 2, 'true and false are boolean values', 2),
  ('history-world-q1', 'history-world', 'When did the Renaissance primarily occur?', '["5th–8th century","14th–17th century","18th–19th century","20th century"]', 1, 'The Renaissance flourished from the 14th to 17th century', 1)
on conflict (id) do nothing;

insert into flashcards (id, course_id, front, back, sort_order) values
  ('math-algebra-f1', 'math-algebra', 'Variable', 'A symbol representing an unknown value', 1),
  ('math-algebra-f2', 'math-algebra', 'Coefficient', 'The number multiplied by a variable (e.g., 3 in 3x)', 2),
  ('math-algebra-f3', 'math-algebra', 'Linear Equation', 'An equation where the highest power of the variable is 1', 3),
  ('science-physics-f1', 'science-physics', 'Inertia', 'The tendency of an object to resist changes in motion', 1),
  ('science-physics-f2', 'science-physics', 'F = ma', 'Force equals mass times acceleration', 2),
  ('science-physics-f3', 'science-physics', 'Newton (N)', 'The SI unit of force', 3),
  ('coding-basics-f1', 'coding-basics', 'Variable', 'A named container for storing data', 1),
  ('coding-basics-f2', 'coding-basics', 'Boolean', 'A data type with only true or false values', 2),
  ('coding-basics-f3', 'coding-basics', 'Function', 'A reusable block of code that performs a task', 3),
  ('history-world-f1', 'history-world', 'Renaissance', 'A period of cultural rebirth in Europe (14th–17th c.)', 1),
  ('history-world-f2', 'history-world', 'Humanism', 'Philosophy emphasizing human potential and achievement', 2)
on conflict (id) do nothing;

insert into live_classes (id, title, instructor, subject, scheduled_at, duration, participants, is_live) values
  ('live-1', 'Algebra Q&A Session', 'Dr. Sarah Chen', 'math', 'Today, 3:00 PM', 45, 24, true),
  ('live-2', 'Physics Lab Demo', 'Prof. James Miller', 'science', 'Today, 5:30 PM', 60, 18, false),
  ('live-3', 'JavaScript Workshop', 'Alex Rivera', 'coding', 'Tomorrow, 10:00 AM', 90, 42, false),
  ('live-4', 'History Discussion: Renaissance', 'Dr. Emily Watson', 'history', 'Tomorrow, 2:00 PM', 50, 15, false)
on conflict (id) do nothing;
