// components/common/GetStartedCTA.js
import React, { useEffect, useCallback, useState } from "react";
import { Text, Pressable, View, AccessibilityInfo } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ONBOARDING_KEY = "onboarding_seen_v1";

/**
 * GetStartedCTA
 *
 * Props:
 *  - toAgent: route for agents (default "/agent/dashboard")
 *  - toUser: route for users (default "/user/home")
 *  - forceShow: ignore seen flag and show anyway
 *  - style: extra container style
 */
const GetStartedCTA = ({
  toAgent = "/agent/dashboard",
  toUser = "/user/home",
  forceShow = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [role, setRole] = useState(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((res) =>
      setReduceMotion(!!res),
    );
  }, []);

  useEffect(() => {
    // Fade in animation
    fadeIn.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });

    if (reduceMotion) {
      scale.value = withTiming(1, { duration: 0 });
      glow.value = withTiming(0, { duration: 0 });
      return;
    }

    // gentle pulse + glow loop
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1200, easing: Easing.out(Easing.exp) }),
        withTiming(1.0, { duration: 1200, easing: Easing.in(Easing.exp) }),
      ),
      -1,
      false,
    );

    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [reduceMotion, scale, glow, fadeIn]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        const seen = await AsyncStorage.getItem(ONBOARDING_KEY);

        if (!mounted) return;

        setRole(storedRole || null);

        // If forceShow is true, ignore seen flag
        if (!forceShow && seen === "true") {
          setVisible(false);
        } else {
          setVisible(true);
        }
      } catch (err) {
        // fallback: show CTA
        setVisible(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [forceShow]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [
      { scale: scale.value },
      { translateY: interpolate(fadeIn.value, [0, 1], [20, 0]) },
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    shadowOpacity: interpolate(glow.value, [0, 1], [0.15, 0.4]),
    elevation: interpolate(glow.value, [0, 1], [3, 8]),
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.2, 0.8]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.98, 1.08]) }],
  }));

  const glowRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0, 0.6]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [1, 1.2]) }],
  }));

  // Role-aware copy & icon
  const destination = role === "agent" ? toAgent : toUser;
  const label = "Get Started";
  const subtext =
    role === "agent"
      ? "List properties, manage leads and grow your business"
      : "Discover properties, save favorites and contact owners securely";
  const smallTag = role === "agent" ? "List Property" : "Browse Homes";
  const iconName = role === "agent" ? "briefcase-outline" : "home-outline";
  const trustedText =
    role === "agent" ? "agents & property managers" : "buyers & renters";

  const onPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.96, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  }, [buttonScale]);

  const onPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  }, [buttonScale]);

  const onPress = useCallback(async () => {
    try {
      // persist that user tapped onboarding CTA
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (e) {
      // ignore write errors
    } finally {
      // navigate to role-appropriate destination
      router.push(destination);
    }
  }, [destination]);

  if (loading || !visible) return null;

  return (
    <Animated.View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 24,
          paddingHorizontal: 20,
        },
        style,
        containerStyle,
      ]}
    >
      {/* Outer glow ring */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 280,
            height: 80,
            borderRadius: 45,
            backgroundColor: "rgba(187,204,19,0.08)",
            borderWidth: 1,
            borderColor: "rgba(187,204,19,0.16)",
          },
          glowRingStyle,
        ]}
      />

      {/* Gradient background */}
      <Animated.View
        style={[
          { position: "absolute", width: 260, height: 74, borderRadius: 42 },
          gradientStyle,
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(187,204,19,0.25)",
            "rgba(34,197,94,0.06)",
            "rgba(187,204,19,0.12)",
          ]}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            flex: 1,
            borderRadius: 42,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
          }}
        />
      </Animated.View>

      {/* Main button */}
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[
          {
            width: 260,
            height: 74,
            borderRadius: 42,
            backgroundColor: "#BBCC13",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            paddingHorizontal: 24,
            shadowColor: "#BBCC13",
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.12)",
          },
          buttonStyle,
        ]}
      >
        {/* Icon container */}
        <View
          style={{
            backgroundColor: "rgba(15,23,32,0.12)",
            borderRadius: 20,
            padding: 8,
            marginRight: 14,
          }}
        >
          <Ionicons name={iconName} size={22} color="#0F1720" />
        </View>

        {/* Text content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#0F1720",
              fontWeight: "800",
              fontSize: 18,
              letterSpacing: 0.4,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              color: "rgba(15,23,32,0.72)",
              fontWeight: "600",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {smallTag}
          </Text>
        </View>

        {/* Arrow icon */}
        <Ionicons
          name="arrow-forward"
          size={20}
          color="rgba(15,23,32,0.85)"
          style={{ marginLeft: 8 }}
        />
      </AnimatedPressable>

      {/* Subtext + trusted line */}
      <View
        style={{ marginTop: 14, paddingHorizontal: 20, alignItems: "center" }}
      >
        <Text
          style={{
            color: "#D1D5DB",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
            fontWeight: "500",
          }}
        >
          {subtext}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            opacity: 0.7,
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#BBCC13",
              marginHorizontal: 6,
            }}
          />
          <Text style={{ color: "#9CA3AF", fontSize: 12, fontWeight: "400" }}>
            Trusted by thousands of {trustedText}
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#BBCC13",
              marginHorizontal: 6,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default GetStartedCTA;
