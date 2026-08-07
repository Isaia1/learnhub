import React, { ReactNode } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTabBarScroll } from '../context/TabBarScrollContext';

interface TabScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function TabScrollView({
  children,
  contentContainerStyle,
  onScroll,
  ...props
}: TabScrollViewProps) {
  const { onScroll: hideOnScroll, tabBarHeight } = useTabBarScroll();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    hideOnScroll(event);
    onScroll?.(event);
  };

  return (
    <ScrollView
      {...props}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[
        contentContainerStyle,
        { paddingBottom: tabBarHeight + 12 },
      ]}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator ?? false}
    >
      {children}
    </ScrollView>
  );
}
