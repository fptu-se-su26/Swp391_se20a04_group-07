import React from "react";
import { View, Text, Pressable, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { StatusPill } from "@/components/StatusPill";

const ROLE_LABEL: Record<string, string> = { student: "Học sinh", parent: "Phụ huynh" };

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function confirmLogout() {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top"]}>
      <View className="bg-ink px-5 pt-3 pb-8 rounded-b-3xl items-center">
        {user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} className="w-20 h-20 rounded-full border-2 border-amber" />
        ) : (
          <View className="w-20 h-20 rounded-full bg-amber items-center justify-center">
            <Text className="font-display-bold text-[24px] text-ink">
              {(user?.full_name || "?").charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text className="font-display text-[18px] text-white mt-3">{user?.full_name}</Text>
        <Text className="font-mono text-[12px] text-white/60 mt-1">{user?.email}</Text>
        <View className="mt-3">
          <StatusPill label={ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? ""} tone="amber" />
        </View>
      </View>

      <View className="px-5 mt-5">
        {user?.role === "student" && (
          <InfoRow label="Lớp" value={user.class_name || "—"} />
        )}
        {user?.role === "parent" && (
          <InfoRow label="Học sinh" value={user.student_name || "—"} />
        )}
        <InfoRow label="Mã học sinh" value={user?.student_id || "—"} />

        <Pressable
          onPress={confirmLogout}
          className="bg-white rounded-2xl py-3.5 items-center mt-6 border border-flag/20 active:opacity-80"
        >
          <Text className="font-body-semibold text-[14px] text-flag">Đăng xuất</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3.5 mb-2.5">
      <Text className="font-body text-[13px] text-graphite">{label}</Text>
      <Text className="font-body-semibold text-[13px] text-ink">{value}</Text>
    </View>
  );
}
