import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getMyRoute, getCurrentTrip } from "@/api/schoolbus";
import { RouteTimeline, RouteStopItem } from "@/components/RouteTimeline";
import { StatusPill } from "@/components/StatusPill";

export default function BusScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      setLoading(true);
      const studentId = user.role === "parent" ? user.student_db_id : undefined;
      Promise.all([
        getMyRoute(user.role, studentId).catch(() => null),
        getCurrentTrip(user.role, studentId).catch(() => null),
      ])
        .then(([r, t]) => {
          setRoute(Array.isArray(r) ? r[0] : r);
          setTrip(t);
        })
        .finally(() => setLoading(false));
    }, [user])
  );

  const rawStops = route?.Route?.RouteStops ?? route?.[0]?.Route?.RouteStops ?? [];
  const stops: RouteStopItem[] = rawStops.map((s: any, i: number) => ({
    id: s.id,
    name: s.stop_name,
    time: s.estimated_time?.slice?.(0, 5) ?? "",
    state: trip ? (i === 0 ? "done" : i === rawStops.length - 1 ? "upcoming" : "current") : "upcoming",
  }));

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="bg-ink px-5 pt-3 pb-6 rounded-b-3xl">
        <Text className="font-display-bold text-[20px] text-white">Xe buýt của tôi</Text>
        <Text className="font-body text-[12.5px] text-white/60 mt-1">
          {route?.Route?.route_name || route?.[0]?.Route?.route_name || "Chưa đăng ký tuyến xe"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
        {loading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color="#16233F" />
          </View>
        ) : (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-body-semibold text-[13px] text-graphite uppercase tracking-wide">
                Lộ trình điểm dừng
              </Text>
              {trip && (
                <StatusPill
                  label={trip.status === "in_progress" ? "Đang chạy" : "Chưa xuất phát"}
                  tone={trip.status === "in_progress" ? "route" : "amber"}
                />
              )}
            </View>

            {stops.length > 0 ? (
              <RouteTimeline stops={stops} />
            ) : (
              <View className="bg-white rounded-2xl px-4 py-8 items-center">
                <Text className="font-body text-[13px] text-graphite">
                  Chưa có thông tin lộ trình
                </Text>
              </View>
            )}

            {trip?.driver && (
              <View className="bg-white rounded-2xl px-4 py-4 mt-4">
                <Text className="font-body-semibold text-[13px] text-graphite uppercase tracking-wide mb-2">
                  Tài xế phụ trách
                </Text>
                <Text className="font-display text-[16px] text-ink">{trip.driver.full_name}</Text>
                <Text className="font-mono text-[12px] text-graphite mt-1">{trip.driver.phone}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
