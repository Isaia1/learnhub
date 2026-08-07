import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useTabBarScroll,
  TAB_BAR_FLOAT_GAP,
  TAB_BAR_PILL_HEIGHT,
  TAB_BAR_COMPACT_SCALE,
} from '../context/TabBarScrollContext';

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Courses: { focused: 'library', unfocused: 'library-outline' },
  Progress: { focused: 'stats-chart', unfocused: 'stats-chart-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export default function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { tabBarScale, expandTabBar } = useTabBarScroll();
  const prevIndex = useRef(state.index);
  const bottomOffset = Math.max(insets.bottom, TAB_BAR_FLOAT_GAP);

  useEffect(() => {
    if (prevIndex.current !== state.index) {
      expandTabBar();
      prevIndex.current = state.index;
    }
  }, [state.index, expandTabBar]);

  const anchorY = tabBarScale.interpolate({
    inputRange: [TAB_BAR_COMPACT_SCALE, 1],
    outputRange: [(TAB_BAR_PILL_HEIGHT * (1 - TAB_BAR_COMPACT_SCALE)) / 2, 0],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          bottom: bottomOffset,
          height: TAB_BAR_PILL_HEIGHT,
          transform: [{ translateY: anchorY }, { scale: tabBarScale }],
          opacity: tabBarScale.interpolate({
            inputRange: [TAB_BAR_COMPACT_SCALE, 1],
            outputRange: [0.92, 1],
          }),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? TAB_ICONS.Home;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapFocused]}>
                <Ionicons
                  name={isFocused ? icons.focused : icons.unfocused}
                  size={isFocused ? 26 : 24}
                  color={isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.55)'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(22, 22, 28, 0.88)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconWrap: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  iconWrapFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
