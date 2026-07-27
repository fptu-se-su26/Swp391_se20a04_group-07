import React from "react";
import { View, Text } from "react-native";
import Svg, { Line, Circle } from "react-native-svg";
import { colors } from "@/theme/colors";

export interface RouteStopItem {
  id: string;
  name: string;
  time: string;
  state: "done" | "current" | "upcoming";
}

// Dòng thời gian lộ trình dạng SVG đơn giản (đường kẻ dọc + chấm điểm dừng),
// đồng bộ với cách hệ thống web hiện tại render bản đồ bằng SVG, không phụ
// thuộc thư viện bản đồ ngoài.
export function RouteTimeline({ stops }: { stops: RouteStopItem[] }) {
  const rowHeight = 56;
  const svgHeight = stops.length * rowHeight;
  const cx = 14;

  const dotColor = (state: RouteStopItem["state"]) =>
    state === "done" ? colors.route : state === "current" ? colors.amber : colors.line;

  return (
    <View className="flex-row bg-white rounded-2xl px-4 py-4">
      <Svg width={28} height={svgHeight}>
        <Line x1={cx} y1={0} x2={cx} y2={svgHeight} stroke={colors.line} strokeWidth={2} />
        {stops.map((s, i) => (
          <Circle
            key={s.id}
            cx={cx}
            cy={i * rowHeight + rowHeight / 2}
            r={s.state === "current" ? 7 : 5}
            fill={dotColor(s.state)}
          />
        ))}
      </Svg>

      <View className="flex-1 ml-3">
        {stops.map((s) => (
          <View key={s.id} style={{ height: rowHeight }} className="justify-center">
            <Text
              className={`font-body-semibold text-[14px] ${
                s.state === "upcoming" ? "text-graphite" : "text-ink"
              }`}
            >
              {s.name}
            </Text>
            <Text className="font-mono text-[12px] text-graphite mt-0.5">{s.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
