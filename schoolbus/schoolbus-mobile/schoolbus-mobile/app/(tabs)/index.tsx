import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getCurrentTrip, getClassSchedule } from "@/api/schoolbus";
import { StatusPill } from "@/components/StatusPill";

const DAY_LABEL: Record<number, string> = {
  2: "Thứ 2", 3: "Thứ 3", 4: "Thứ 4", 5: "Thứ 5", 6: "Thứ 6", 7: "Thứ 7", 8: "Chủ nhật",
};

function todayDow() {
  const jsDay = new Date().getDay(); // 0=CN
  return jsDay === 0 ? 8 : jsDay + 1;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);

  const isSuspended = !!user?.bus_suspended;
  const dow = todayDow();

  async function load() {
    if (!user) return;
    try {
      const [trip, schedule] = await Promise.all([
        getCurrentTrip(user.role, user.role === "parent" ? user.student_db_id : undefined).catch(() => null),
        getClassSchedule(user.role).catch(() => null),
      ]);
      setCurrentTrip(trip);
      setTodayClasses(schedule?.schedule?.[dow] ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [user])
  );

  async function onRefresh() {
    setRefreshing(true);
    load();
  }

  const displayName = user?.role === "parent" ? user?.student_name : user?.full_name;
  const greetTitle = user?.role === "parent" ? "Phụ huynh của" : "Chào";

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      {/* Header navy - bảng thông báo */}
      <View className="bg-ink px-5 pt-3 pb-6 rounded-b-3xl">
        <Text className="font-body text-[13px] text-white/60">{greetTitle}</Text>
        <Text className="font-display-bold text-[22px] text-white mt-0.5">
          {displayName || "..."}
        </Text>
        <Text className="font-mono text-[12px] text-amber mt-2">
          {DAY_LABEL[dow]} · {new Date().toLocaleDateString("vi-VN")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16233F" />}
      >
        {isSuspended && (
          <View className="bg-flag-soft border border-flag/20 rounded-2xl px-4 py-3.5 mb-4">
            <Text className="font-body-semibold text-[13px] text-flag mb-1">
              🚫 Đang bị tạm đình chỉ đưa đón xe buýt
            </Text>
            <Text className="font-body text-[12.5px] text-flag/90 leading-5">
              {user?.bus_suspended_reason || "Vui lòng liên hệ quản trị viên để biết thêm chi tiết."}
            </Text>
          </View>
        )}

        {loading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color="#16233F" />
          </View>
        ) : (
          <>
            {/* Trạng thái xe buýt hôm nay */}
            <Text className="font-body-semibold text-[13px] text-graphite uppercase tracking-wide mb-2">
              Xe buýt hôm nay
            </Text>
            <View className="bg-white rounded-2xl px-4 py-4 mb-5">
              {currentTrip ? (
                <>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-display text-[16px] text-ink">
                      {currentTrip.Route?.route_name || "Chuyến xe"}
                    </Text>
                    <StatusPill
                      label={currentTrip.status === "in_progress" ? "Đang di chuyển" : "Đã lên lịch"}
                      tone={currentTrip.status === "in_progress" ? "route" : "amber"}
                    />
                  </View>
                  <Text className="font-mono text-[12px] text-graphite">
                    Tài xế: {currentTrip.driver?.full_name || "—"} · {currentTrip.driver?.phone || ""}
                  </Text>
                </>
              ) : (
                <View className="items-center py-4">
                  <Text className="font-body text-[13px] text-graphite">
                    Chưa có chuyến xe nào đang diễn ra
                  </Text>
                </View>
              )}
            </View>

            {/* Lịch học hôm nay */}
            <Text className="font-body-semibold text-[13px] text-graphite uppercase tracking-wide mb-2">
              Lịch học hôm nay
            </Text>
            {todayClasses.length === 0 ? (
              <View className="bg-white rounded-2xl px-4 py-6 items-center">
                <Text className="font-body text-[13px] text-graphite">
                  Không có tiết học nào hôm nay
                </Text>
              </View>
            ) : (
              todayClasses.map((c: any) => (
                <View key={c.id} className="flex-row bg-white rounded-2xl px-4 py-3.5 mb-2.5 items-center">
                  <View className="w-11 h-11 rounded-xl bg-amber-soft items-center justify-center mr-3">
                    <Text className="font-mono text-[11px] text-amber">
                      {c.start_time?.slice(0, 5)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-semibold text-[14px] text-ink">{c.subject}</Text>
                    <Text className="font-body text-[12px] text-graphite mt-0.5">
                      {c.teacher ? `${c.teacher} · ` : ""}Phòng {c.room || "—"}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
