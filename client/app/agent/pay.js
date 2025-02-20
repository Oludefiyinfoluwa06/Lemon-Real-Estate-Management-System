import { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { getCountryCurrencyData } from "../../services/currencyConverter";
import { getToken } from "../../services/getToken";
import { config } from "../../config";
import { FLUTTERWAVE_SECRET_KEY } from "@env";

const Payment = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");
  const [isProcessingTrial, setIsProcessingTrial] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [paymentCountdown, setPaymentCountdown] = useState("");

  const params = useLocalSearchParams();

  const convertPriceToNumber = (formattedPrice) => {
    return Number(formattedPrice.replace(/[^0-9.]/g, ""));
  };

  const PAYMENT_ENDPOINT = `${config.API_BASE_URL}/api/payment/initialize`;

  useEffect(() => {
    if (user.isOnTrial) {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(user.trialEndDate);
        const timeDiff = end - now;

        if (timeDiff <= 0) {
          clearInterval(interval);
          setRemainingTime("Trial ended");
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
          setRemainingTime(`${days}d ${hours}h ${minutes}m left`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user.isOnTrial, user.trialEndDate]);

  useEffect(() => {
    if (user.hasPaid) {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(user.paymentEndDate);
        const timeDiff = end - now;

        if (timeDiff <= 0) {
          clearInterval(interval);
          setPaymentCountdown("Payment period ended");
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
          setPaymentCountdown(`${days}d ${hours}h ${minutes}m left`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user.hasPaid, user.paymentEndDate]);

  useEffect(() => {
    const setupPayment = async () => {
      if (!user?.country || !user?.email) {
        setError("User details not available");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const countryData = await getCountryCurrencyData(user.country);

        if (!countryData) {
          throw new Error("Unable to get currency data for your country");
        }

        const tx_ref = `PRE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

        const paymentData = {
          tx_ref,
          amount: convertPriceToNumber(params.amount),
          currency: countryData.code,
          customer: {
            email: user.email,
            name: user.companyName || "Customer",
            phonenumber: user.mobileNumber || "",
          },
          customizations: {
            title: "Premium Subscription",
            description: "6 Months Premium Access",
          },
        };

        setPaymentDetails(paymentData);
      } catch (err) {
        setError("Failed to setup payment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    setupPayment();
  }, [user]);

  const initiatePayment = async () => {
    if (!paymentDetails) return;
    const token = await getToken();

    try {
      setIsLoading(true);

      const response = await fetch(PAYMENT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentDetails),
      });

      const data = await response.json();

      if (data.status === "success" && data.data.link) {
        await Linking.openURL(data.data.link);

        await startVerificationPolling(paymentDetails.tx_ref);
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (err) {
      Alert.alert(
        "Payment Error",
        "Unable to start payment process. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startVerificationPolling = async (txRef) => {
    let attempts = 0;
    const maxAttempts = 10;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const verificationData = await response.json();

        if (
          verificationData.status === "success" &&
          verificationData.data.status === "successful"
        ) {
          await startPayment();
          clearInterval(pollInterval);
          Alert.alert(
            "Payment Successful",
            "Your premium subscription has been activated!",
            [
              {
                text: "OK",
                onPress: () => router.push("/agent/dashboard"),
              },
            ],
          );
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          Alert.alert(
            "Verification Timeout",
            "Please contact support if payment was made.",
            [{ text: "OK" }],
          );
        }

        attempts++;
      } catch (err) {
        clearInterval(pollInterval);
        Alert.alert(
          "Verification Error",
          "An error occurred during verification. Please try again or contact support.",
          [{ text: "OK" }],
        );
      }
    }, 5000);
  };

  const startPayment = async () => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${config.API_BASE_URL}/api/subscription/start-payment`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        Alert.alert(
          "Subscription Activated",
          "Your 6-month subscription period has started!",
          [
            {
              text: "OK",
              onPress: () => router.push("/agent/dashboard"),
            },
          ],
        );
      } else {
        throw new Error(data.message || "Failed to start trial");
      }
    } catch (err) {
      Alert.alert(
        "Subscription Activation Error",
        err.message || "Unable to start subscription period. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  const startTrial = async () => {
    try {
      setIsProcessingTrial(true);
      const token = await getToken();

      const response = await fetch(
        `${config.API_BASE_URL}/api/subscription/start-trial`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        Alert.alert(
          "Trial Activated",
          "Your 6-month trial period has started!",
          [
            {
              text: "OK",
              onPress: () => router.push("/agent/dashboard"),
            },
          ],
        );
      } else {
        throw new Error(data.message || "Failed to start trial");
      }
    } catch (err) {
      Alert.alert(
        "Trial Activation Error",
        "Unable to start trial period. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsProcessingTrial(false);
    }
  };

  const handleTrialRequest = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${config.API_BASE_URL}/api/subscription/check-eligibility`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        if (data.completed) {
          Alert.alert("Trial Completed", "You have completed your trial", [
            { text: "OK" },
          ]);
        } else if (data.ongoing) {
          Alert.alert("Trial is ongoing", "You cannot start a trial", [
            { text: "OK" },
          ]);
        } else {
          Alert.alert(
            "Start Trial",
            "Would you like to start your 6-month trial period?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Start Trial",
                onPress: startTrial,
              },
            ],
          );
        }
      } else {
        Alert.alert(
          "Trial Unavailable",
          "You are not eligible for a trial period. This could be because you've already used a trial or your account type doesn't qualify.",
          [{ text: "OK" }],
        );
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "Unable to verify trial eligibility. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-darkUmber-dark p-4">
      <ScrollView>
        <View className="flex-row items-center justify-start gap-3 mb-4">
          <TouchableOpacity
            className="bg-transparentWhite items-center justify-center w-[50px] h-[50px] rounded-full"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back-outline" size={23} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text className="text-white font-rbold text-2xl">Payment</Text>
        </View>

        <View className="bg-transparentWhite w-full rounded-lg p-4 mb-4">
          <Text className="text-white font-rbold text-xl text-center mb-4">
            Complete Your Payment
          </Text>

          {error ? (
            <Text className="text-red-500 text-sm text-center mb-4">
              {error}
            </Text>
          ) : null}

          {paymentDetails && (
            <View className="space-y-4">
              <View className="border-b border-gray-600 pb-2">
                <Text className="text-white text-lg">Amount:</Text>
                <Text className="text-white font-rbold text-xl">
                  {paymentDetails.currency} {paymentDetails.amount}
                </Text>
              </View>

              <TouchableOpacity
                className={`bg-[#BBCC13] p-4 rounded-lg items-center ${
                  isLoading || user.isOnTrial || user.hasPaid
                    ? "bg-gray-400"
                    : "bg-[#BBCC13]"
                }
                                `}
                onPress={initiatePayment}
                disabled={isLoading || user.isOnTrial || user.hasPaid}
              >
                <Text className="text-white font-rbold text-lg">
                  {isLoading
                    ? "Processing..."
                    : user.hasPaid
                      ? paymentCountdown || "Calculating..."
                      : "Pay Now"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`p-4 rounded-lg items-center ${
                  isProcessingTrial || user.isOnTrial || user.hasPaid
                    ? "bg-gray-400"
                    : "bg-[#BBCC13]"
                }`}
                onPress={handleTrialRequest}
                disabled={isProcessingTrial || user.isOnTrial}
              >
                <Text className="text-white font-rbold text-lg">
                  {isProcessingTrial
                    ? "Processing..."
                    : user.isOnTrial
                      ? remainingTime || "Calculating..."
                      : "Start 6 months trial"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <StatusBar backgroundColor={"#212A2B"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payment;
