import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getClassSchedule } from "@/api/schoolbus";
import { TicketCard } from "@/components/TicketCard";

const DAYS = [
  { key: 2, label: "T2" }, { key: 3, label: "T3" }, { key: 4, label: "T4" },
  { key: 5, label: "T5" }, { key: 6, label: "T6" }, { key: 7, label: "T7" }, { key: 8, label: "CN" },
];

function todayDow() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 8 : jsDay + 1;
}

export default function ScheduleScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState("");
  const [schedule, setSchedule] = useState<Record<number, any[]>>({});
  const [activeDay, setActiveDay] = useState(todayDow());

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      setLoading(true);
      getClassSchedule(user.role)
        .then((data) => {
          if (data) {
            setSemester(data.semester);
            setSchedule(data.schedule as any);
          }
        })
        .finally(() => setLoading(false));
    }, [user])
  );

  const dayClasses = schedule[activeDay] ?? [];

  if (user?.role === "parent") {
    return (
      <SafeAreaView className="flex-1 bg-paper items-center justify-center px-8">
        <Text className="font-body text-[13px] text-graphite text-center">
          Thời khóa biểu chi tiết hiện chỉ hiển thị trong tài khoản học sinh.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="bg-ink px-5 pt-3 pb-5">
        <Text className="font-display-bold text-[20px] text-white">Thời khóa biểu</Text>
        {!!semester && (
          <Text className="font-mono text-[12px] text-amber mt-1">Học kỳ {semester}</Text>
        )}
      </View>

      {/* Chọn ngày trong tuần */}
      <View className="flex-row justify-between px-5 py-3 bg-white">
        {DAYS.map((d) => {
          const active = d.key === activeDay;
          return (
            <Pressable
              key={d.key}
              onPress={() => setActiveDay(d.key)}
              className={`w-11 h-11 rounded-xl items-center justify-center ${
                active ? "bg-ink" : "bg-paper"
              }`}
            >
              <Text className={`font-body-semibold text-[12px] ${active ? "text-white" : "text-graphite"}`}>
                {d.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color="#16233F" />
          </View>
        ) : dayClasses.length === 0 ? (
          <View className="bg-white rounded-2xl px-4 py-8 items-center">
            <Text className="font-body text-[13px] text-graphite">
              Không có tiết học nào trong ngày này
            </Text>
          </View>
        ) : (
          dayClasses.map((c: any, i: number) => (
            <TicketCard
              key={c.id}
              eyebrow={`Tiết ${i + 1} · ${c.start_time?.slice(0, 5)} - ${c.end_time?.slice(0, 5)}`}
              title={c.subject}
              meta={`${c.teacher || "Chưa phân công"} · Phòng ${c.room || "—"}`}
              statusLabel={c.is_active ? "Đang áp dụng" : "Tạm ngưng"}
              statusTone={c.is_active ? "route" : "graphite"}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
