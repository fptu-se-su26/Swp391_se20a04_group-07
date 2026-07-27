import React from "react";
import { Tabs } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { colors } from "@/theme/colors";

function Icon({ name, color }: { name: string; color: string }) {
  const s = { width: 22, height: 22 };
  switch (name) {
    case "home":
      return (
        <Svg {...s} viewBox="0 0 24 24" fill="none">
          <Path d="M4 11L12 4L20 11V19C20 19.5 19.5 20 19 20H5C4.5 20 4 19.5 4 19V11Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Rect x={10} y={14} width={4} height={6} stroke={color} strokeWidth={2} />
        </Svg>
      );
    case "schedule":
      return (
        <Svg {...s} viewBox="0 0 24 24" fill="none">
          <Rect x={4} y={5} width={16} height={15} rx={2} stroke={color} strokeWidth={2} />
          <Path d="M4 9.5H20" stroke={color} strokeWidth={2} />
          <Path d="M8 3V6.5M16 3V6.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case "bus":
      return (
        <Svg {...s} viewBox="0 0 24 24" fill="none">
          <Rect x={4} y={5} width={16} height={12} rx={2.5} stroke={color} strokeWidth={2} />
          <Path d="M4 11H20" stroke={color} strokeWidth={2} />
          <Circle cx={8} cy={19.5} r={1.5} fill={color} />
          <Circle cx={16} cy={19.5} r={1.5} fill={color} />
        </Svg>
      );
    case "bell":
      return (
        <Svg {...s} viewBox="0 0 24 24" fill="none">
          <Path d="M6 10C6 6.7 8.7 4 12 4C15.3 4 18 6.7 18 10V14L20 17H4L6 14V10Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M10 20C10 20.8 10.9 21.5 12 21.5C13.1 21.5 14 20.8 14 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    default:
      return (
        <Svg {...s} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={8} r={3.5} stroke={color} strokeWidth={2} />
          <Path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
  }
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.graphite,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Trang chủ", tabBarIcon: ({ color }) => <Icon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="schedule"
        options={{ title: "Lịch học", tabBarIcon: ({ color }) => <Icon name="schedule" color={color} /> }}
      />
      <Tabs.Screen
        name="bus"
        options={{ title: "Xe buýt", tabBarIcon: ({ color }) => <Icon name="bus" color={color} /> }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ title: "Thông báo", tabBarIcon: ({ color }) => <Icon name="bell" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Cá nhân", tabBarIcon: ({ color }) => <Icon name="profile" color={color} /> }}
      />
    </Tabs>
  );
}
