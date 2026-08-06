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
  Live: undefined;
  Progress: undefined;
  Profile: undefined;
};
