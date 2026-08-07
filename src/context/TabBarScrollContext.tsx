import React, { createContext, useContext, useRef, useCallback, useMemo, ReactNode } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_PILL_HEIGHT = 58;
export const TAB_BAR_FLOAT_GAP = 12;
export const TAB_BAR_COMPACT_SCALE = 0.84;
const SCROLL_THRESHOLD = 8;

interface TabBarScrollContextType {
  tabBarScale: Animated.Value;
  tabBarHeight: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  expandTabBar: () => void;
}

const TabBarScrollContext = createContext<TabBarScrollContextType | undefined>(undefined);

export function TabBarScrollProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, TAB_BAR_FLOAT_GAP);
  const tabBarHeight = TAB_BAR_PILL_HEIGHT + bottomOffset + TAB_BAR_FLOAT_GAP;
  const tabBarScale = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const isCompact = useRef(false);

  const expandTabBar = useCallback(() => {
    isCompact.current = false;
    Animated.spring(tabBarScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 9,
      tension: 90,
    }).start();
  }, [tabBarScale]);

  const shrinkTabBar = useCallback(() => {
    isCompact.current = true;
    Animated.spring(tabBarScale, {
      toValue: TAB_BAR_COMPACT_SCALE,
      useNativeDriver: true,
      friction: 9,
      tension: 90,
    }).start();
  }, [tabBarScale]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const diff = currentY - lastScrollY.current;

      if (currentY <= 10) {
        if (isCompact.current) expandTabBar();
      } else if (diff > SCROLL_THRESHOLD && currentY > 40) {
        if (!isCompact.current) shrinkTabBar();
      } else if (diff < -SCROLL_THRESHOLD) {
        if (isCompact.current) expandTabBar();
      }

      lastScrollY.current = currentY;
    },
    [expandTabBar, shrinkTabBar]
  );

  const value = useMemo(
    () => ({ tabBarScale, tabBarHeight, onScroll, expandTabBar }),
    [tabBarScale, tabBarHeight, onScroll, expandTabBar]
  );

  return <TabBarScrollContext.Provider value={value}>{children}</TabBarScrollContext.Provider>;
}

export function useTabBarScroll() {
  const context = useContext(TabBarScrollContext);
  if (!context) throw new Error('useTabBarScroll must be used within TabBarScrollProvider');
  return context;
}
