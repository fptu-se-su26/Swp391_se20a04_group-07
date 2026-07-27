import React from "react";
import { View, Text } from "react-native";

type Tone = "route" | "amber" | "flag" | "graphite";

const toneMap: Record<Tone, { bg: string; text: string; dot: string }> = {
  route: { bg: "bg-route-soft", text: "text-route", dot: "bg-route" },
  amber: { bg: "bg-amber-soft", text: "text-amber", dot: "bg-amber" },
  flag: { bg: "bg-flag-soft", text: "text-flag", dot: "bg-flag" },
  graphite: { bg: "bg-paper-dim", text: "text-graphite", dot: "bg-graphite" },
};

export function StatusPill({ label, tone = "graphite" }: { label: string; tone?: Tone }) {
  const t = toneMap[tone];
  return (
    <View className={`flex-row items-center px-3 py-1.5 rounded-full ${t.bg}`}>
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.dot}`} />
      <Text className={`font-body-semibold text-[12px] ${t.text}`}>{label}</Text>
    </View>
  );
}
