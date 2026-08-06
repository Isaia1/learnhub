import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useCourses } from '../context/CoursesContext';
import { useProgress } from '../context/ProgressContext';
import { colors } from '../theme/colors';
import FlashcardComponent from '../components/Flashcard';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Flashcards'>;
  route: RouteProp<RootStackParamList, 'Flashcards'>;
};

export default function FlashcardsScreen({ navigation, route }: Props) {
  const { courseId } = route.params;
  const { getCourseById } = useCourses();
  const course = getCourseById(courseId);
  const { masterFlashcard, progress } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!course || course.flashcards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No flashcards available for this course.</Text>
      </SafeAreaView>
    );
  }

  const card = course.flashcards[currentIndex];
  const isMastered = progress.masteredFlashcards.includes(card.id);

  const handleKnow = () => {
    masterFlashcard(card.id);
    goNext();
  };

  const handleReview = () => {
    goNext();
  };

  const goNext = () => {
    setIsFlipped(false);
    if (currentIndex + 1 >= course.flashcards.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {course.flashcards.length}
        </Text>
        {isMastered && (
          <View style={styles.masteredBadge}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.masteredText}>Mastered</Text>
          </View>
        )}
      </View>

      <View style={styles.cardArea}>
        <FlashcardComponent
          front={card.front}
          back={card.back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      </View>

      {isFlipped && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.reviewButton} onPress={handleReview}>
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            <Text style={styles.reviewText}>Review Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.knowButton} onPress={handleKnow}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.knowText}>Got It!</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  masteredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  masteredText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  reviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  knowButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.success,
  },
  knowText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
  },
});
