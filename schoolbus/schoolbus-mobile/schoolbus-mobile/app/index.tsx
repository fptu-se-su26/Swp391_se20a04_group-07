import React from "react";
import { View, ActivityIndicator } from "react-native";

// Route gốc chỉ hiển thị loading — RootNavigation trong _layout.tsx sẽ
// redirect sang (auth)/login hoặc (tabs) dựa trên trạng thái đăng nhập.
export default function Index() {
  return (
    <View className="flex-1 bg-ink items-center justify-center">
      <ActivityIndicator color="#F2A93B" />
    </View>
  );
}
