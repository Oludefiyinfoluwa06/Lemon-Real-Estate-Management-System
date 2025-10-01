import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { images } from "../assets/constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import GetStartedCTA from "../components/common/GetStartedCTA";

const SplashScreen = () => {
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // keep the nav bar style
    NavigationBar.setBackgroundColorAsync("#212A2B");

    // logo breathing animation (unchanged)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0.8, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      ),
      -1,
      true,
    );

    // NOTE: intentionally do NOT auto-navigate here.
    // The app will wait for the user to press the Get Started CTA.
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-darkUmber-dark">
      <Animated.Image
        source={images.logo}
        resizeMode="contain"
        className="w-32 h-32"
        style={animatedStyle}
      />

      {/* Show CTA — user must tap to proceed */}
      <GetStartedCTA forceShow={true} />

      <StatusBar backgroundColor="#212A2B" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default SplashScreen;
