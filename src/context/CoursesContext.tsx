import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Course, LiveClass } from '../types';
import { fetchCourses, fetchLiveClasses } from '../services/coursesService';
import { courses as mockCourses, liveClasses as mockLiveClasses } from '../data/mockData';

interface CoursesContextType {
  courses: Course[];
  liveClasses: LiveClass[];
  loading: boolean;
  getCourseById: (id: string) => Course | undefined;
  refresh: () => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(mockLiveClasses);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [fetchedCourses, fetchedLive] = await Promise.all([fetchCourses(), fetchLiveClasses()]);
      setCourses(fetchedCourses);
      setLiveClasses(fetchedLive);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  return (
    <CoursesContext.Provider value={{ courses, liveClasses, loading, getCourseById, refresh: load }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (!context) throw new Error('useCourses must be used within CoursesProvider');
  return context;
}
