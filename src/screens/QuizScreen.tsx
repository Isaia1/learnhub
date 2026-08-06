import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { courses } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { colors } from '../theme/colors';
import ProgressBar from '../components/ProgressBar';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

export default function QuizScreen({ navigation, route }: Props) {
  const { courseId } = route.params;
  const course = courses.find((c) => c.id === courseId);
  const { saveQuizScore } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!course || course.quizzes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No quiz available for this course.</Text>
      </SafeAreaView>
    );
  }

  const question = course.quizzes[currentIndex];
  const progress = ((currentIndex + (showExplanation ? 1 : 0)) / course.quizzes.length) * 100;

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= course.quizzes.length) {
      const finalScore = Math.round((score / course.quizzes.length) * 100);
      saveQuizScore(courseId, finalScore);
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setShowExplanation(false);
  };

  if (finished) {
    const finalScore = Math.round((score / course.quizzes.length) * 100);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons
            name={finalScore >= 70 ? 'trophy' : 'ribbon'}
            size={80}
            color={finalScore >= 70 ? colors.accent : colors.primary}
          />
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultScore}>{finalScore}%</Text>
          <Text style={styles.resultDetail}>
            {score} of {course.quizzes.length} correct
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Back to Course</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.questionCount}>
          Question {currentIndex + 1} of {course.quizzes.length}
        </Text>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.body}>
        <Text style={styles.question}>{question.question}</Text>

        {question.options.map((option, index) => {
          let optionStyle = styles.option;
          if (selectedIndex !== null) {
            if (index === question.correctIndex) {
              optionStyle = { ...styles.option, ...styles.optionCorrect };
            } else if (index === selectedIndex) {
              optionStyle = { ...styles.option, ...styles.optionWrong };
            }
          } else if (selectedIndex === index) {
            optionStyle = { ...styles.option, ...styles.optionSelected };
          }

          return (
            <TouchableOpacity
              key={index}
              style={optionStyle}
              onPress={() => handleSelect(index)}
              disabled={selectedIndex !== null}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>{String.fromCharCode(65 + index)}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
              {selectedIndex !== null && index === question.correctIndex && (
                <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              )}
              {selectedIndex === index && index !== question.correctIndex && (
                <Ionicons name="close-circle" size={22} color={colors.error} />
              )}
            </TouchableOpacity>
          );
        })}

        {showExplanation && (
          <View style={styles.explanation}>
            <Text style={styles.explanationLabel}>Explanation</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </View>

      {showExplanation && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 >= course.quizzes.length ? 'See Results' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    gap: 12,
  },
  questionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
    marginBottom: 28,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  optionWrong: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetterText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  explanation: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
  },
  resultScore: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 8,
  },
  resultDetail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
  },
});
