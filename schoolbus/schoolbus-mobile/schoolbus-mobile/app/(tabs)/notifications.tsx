import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getNotifications, markNotificationRead } from "@/api/schoolbus";

const TYPE_TONE: Record<string, "route" | "amber" | "flag" | "graphite"> = {
  trip_started: "route",
  attendance_boarded: "route",
  attendance_dropped_off: "route",
  attendance_absent: "flag",
  bus_suspended: "flag",
  incident: "flag",
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      setLoading(true);
      getNotifications(user.role)
        .then((data) => setItems(data?.data ?? data ?? []))
        .finally(() => setLoading(false));
    }, [user])
  );

  async function handlePress(item: any) {
    if (item.is_read) return;
    setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)));
    if (user) await markNotificationRead(user.role, item.id).catch(() => {});
  }

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="bg-ink px-5 pt-3 pb-5">
        <Text className="font-display-bold text-[20px] text-white">Thông báo</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color="#16233F" />
          </View>
        ) : items.length === 0 ? (
          <View className="bg-white rounded-2xl px-4 py-10 items-center">
            <Text className="font-body text-[13px] text-graphite">Chưa có thông báo nào</Text>
          </View>
        ) : (
          items.map((item) => {
            const tone = TYPE_TONE[item.type] ?? "graphite";
            const dotColor = { route: "bg-route", amber: "bg-amber", flag: "bg-flag", graphite: "bg-graphite" }[tone];
            return (
              <Pressable
                key={item.id}
                onPress={() => handlePress(item)}
                className={`flex-row bg-white rounded-2xl px-4 py-3.5 mb-2.5 ${
                  !item.is_read ? "border border-amber/30" : ""
                }`}
              >
                <View className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${dotColor}`} />
                <View className="flex-1">
                  <Text className="font-body-semibold text-[14px] text-ink">{item.title}</Text>
                  <Text className="font-body text-[12.5px] text-graphite mt-1 leading-5">{item.body}</Text>
                  <Text className="font-mono text-[11px] text-graphite/70 mt-1.5">
                    {timeAgo(item.sent_at)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
