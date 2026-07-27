import React from "react";
import { View, Text } from "react-native";

interface TicketCardProps {
  eyebrow: string; // nhãn nhỏ phía trên, ví dụ "TIẾT 3 · TOÁN"
  title: string; // nội dung chính, ví dụ "Đại số tuyến tính"
  meta: string; // dòng phụ, ví dụ "07:45 - 09:15 · Phòng A203"
  statusLabel: string; // ví dụ "Sắp diễn ra", "Đã lên xe", "Vắng"
  statusTone?: "route" | "amber" | "flag" | "graphite";
  children?: React.ReactNode;
}

const toneMap = {
  route: { bg: "bg-route-soft", text: "text-route" },
  amber: { bg: "bg-amber-soft", text: "text-amber" },
  flag: { bg: "bg-flag-soft", text: "text-flag" },
  graphite: { bg: "bg-paper-dim", text: "text-graphite" },
};

export function TicketCard({
  eyebrow,
  title,
  meta,
  statusLabel,
  statusTone = "graphite",
  children,
}: TicketCardProps) {
  const tone = toneMap[statusTone];
  return (
    <View className="mb-3 flex-row bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Cuống vé bên trái - dải màu đặc trưng "ticket stub" */}
      <View className="w-2.5 bg-ink" />

      <View className="flex-1 px-4 py-3.5">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="font-body-semibold text-[11px] tracking-wide text-graphite uppercase">
            {eyebrow}
          </Text>
          <View className={`px-2.5 py-1 rounded-full ${tone.bg}`}>
            <Text className={`font-body-semibold text-[11px] ${tone.text}`}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <Text className="font-display text-[17px] text-ink mb-1">{title}</Text>
        <Text className="font-mono text-[12px] text-graphite">{meta}</Text>

        {children}
      </View>

      {/* Đường đục lỗ mô phỏng vé xé - viền chấm bên phải */}
      <View className="w-0 border-r border-dashed border-line" />
      {/* Notch trên/dưới mô phỏng lỗ bấm vé */}
      <View className="absolute -right-2 top-[-8] w-4 h-4 rounded-full bg-paper" />
      <View className="absolute -right-2 bottom-[-8] w-4 h-4 rounded-full bg-paper" />
    </View>
  );
}
