import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuth } from "@/context/AuthContext";
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "@/theme/colors";

WebBrowser.maybeCompleteAuthSession();

// Icon xe buýt đơn giản vẽ bằng SVG - dùng ở màn hình chào
function BusMark() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={32} fill={colors.amber} />
      <Path
        d="M16 22C16 19 18 17 21 17H43C46 17 48 19 48 22V38C48 39.5 47 40.5 45.5 40.5H44V43C44 44.5 43 45.5 41.5 45.5C40 45.5 39 44.5 39 43V40.5H25V43C25 44.5 24 45.5 22.5 45.5C21 45.5 20 44.5 20 43V40.5H18.5C17 40.5 16 39.5 16 38V22Z"
        fill={colors.ink}
      />
      <Circle cx={22} cy={40} r={3} fill={colors.paper} />
      <Circle cx={42} cy={40} r={3} fill={colors.paper} />
    </Svg>
  );
}

export default function LoginScreen() {
  const { loginGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const extra = Constants.expoConfig?.extra ?? {};
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: extra.googleExpoClientId,
    iosClientId: extra.googleIosClientId,
    androidClientId: extra.googleAndroidClientId,
  });

  React.useEffect(() => {
    if (response?.type === "success" && response.params.id_token) {
      handleLogin(response.params.id_token);
    } else if (response?.type === "error") {
      Alert.alert("Đăng nhập thất bại", "Vui lòng thử lại.");
    }
  }, [response]);

  async function handleLogin(idToken: string) {
    setSubmitting(true);
    try {
      await loginGoogle(idToken);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Tài khoản Google này chưa được đăng ký trong hệ thống. Vui lòng liên hệ quản trị viên.";
      Alert.alert("Không thể đăng nhập", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-ink">
      <View className="flex-1 justify-between px-6 pb-8">
        <View className="items-center mt-24">
          <BusMark />
          <Text className="font-display-bold text-[28px] text-white mt-6">
            SchoolBus
          </Text>
          <Text className="font-body text-[14px] text-white/60 mt-2 text-center">
            Lịch học, lịch xe và điểm danh{"\n"}trong một điểm dừng duy nhất
          </Text>
        </View>

        <View>
          <View className="bg-white/10 rounded-2xl px-4 py-4 mb-6">
            <Text className="font-body-medium text-[13px] text-white/80 leading-5">
              Đăng nhập bằng Gmail đã được nhà trường đăng ký. Nếu Gmail của bạn
              chưa có trong hệ thống, hãy liên hệ quản trị viên để được thêm vào.
            </Text>
          </View>

          <Pressable
            disabled={submitting}
            onPress={() => promptAsync()}
            className="bg-white rounded-2xl py-4 flex-row items-center justify-center active:opacity-80"
          >
            {submitting ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <>
                <GoogleG />
                <Text className="font-body-semibold text-[15px] text-ink ml-2.5">
                  Đăng nhập với Google
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function GoogleG() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <Path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"
      />
      <Path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"
      />
      <Path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </Svg>
  );
}
