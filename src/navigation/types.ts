export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CourseDetail: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
  Quiz: { courseId: string };
  Flashcards: { courseId: string };
};

export type TabParamList = {
  Home: undefined;
  Courses: undefined;
  Progress: undefined;
  Profile: undefined;
};
