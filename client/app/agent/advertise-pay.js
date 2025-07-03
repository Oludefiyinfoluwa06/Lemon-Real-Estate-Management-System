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
import { useProperty } from "../../contexts/PropertyContext";

const Payment = () => {
  const { user } = useAuth();
  const { getProperty, property } = useProperty();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");
  const [paymentCountdown, setPaymentCountdown] = useState("");

  const params = useLocalSearchParams();
  const INITIALIZE_ENDPOINT = `${config.API_BASE_URL}/api/payment/initialize`;
  const VERIFY_ENDPOINT = `${config.API_BASE_URL}/api/payment/verify`;

  useEffect(() => { getProperty(params.propertyId); }, []);

  useEffect(() => {
    if (property.isOnAdvertisement) {
      const iv = setInterval(() => {
        const now = new Date(), end = new Date(property.advertisementEndDate);
        const diff = end - now;
        if (diff <= 0) { clearInterval(iv); setPaymentCountdown("Ended"); }
        else {
          const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000);
          setPaymentCountdown(`${d}d ${h}h ${m}m left`);
        }
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [property.isOnAdvertisement, property.advertisementEndDate]);

  useEffect(() => {
    const setup = async () => {
      if (!user?.country || !user?.email) { setError("User details missing"); return; }
      setIsLoading(true);
      try {
        const countryData = await getCountryCurrencyData(user.country);
        const reference = `PSK_AD_${Date.now()}`;
        setPaymentDetails({ reference, amount: Number(params.amount)*100, email: user.email, currency: countryData.code });
      } catch {
        setError("Setup failed");
      } finally { setIsLoading(false); }
    };
    setup();
  }, [user]);

  const initiatePayment = async () => {
    if (!paymentDetails) return;
    setIsLoading(true);
    try {
      const token = await getToken();
      const resp = await fetch(INITIALIZE_ENDPOINT, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(paymentDetails) });
      const { status, data } = await resp.json();
      if (status==='success') { await Linking.openURL(data.authorization_url); await pollVerify(paymentDetails.reference); }
      else throw new Error();
    } catch {
      Alert.alert('Error','Cannot initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  const pollVerify = async (reference) => {
    let attempts=0; const max=10;
    const iv = setInterval(async()=>{
      attempts++;
      try {
        const token = await getToken();
        const res = await fetch(`${VERIFY_ENDPOINT}?reference=${reference}`, { headers:{ Authorization:`Bearer ${token}` } });
        const { status, data } = await res.json();
        if (status==='success' && data.status==='success') {
          clearInterval(iv);
          Alert.alert('Success','Advertisement is live',[{ onPress:()=>router.push('/agent/dashboard'), text:'OK' }]);
        } else if (attempts>=max) { clearInterval(iv); Alert.alert('Timeout','Contact support'); }
      } catch { clearInterval(iv); Alert.alert('Error','Verification error'); }
    },5000);
  };

  const startPayment = async () => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${config.API_BASE_URL}/api/advertise/start-payment/${params.propertyId}`,
        { duration: params.duration },
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
          "Advertisement sponsorship activated",
          "Your advertisement sponsorship period has started!",
          [
            {
              text: "OK",
              onPress: () => router.push("/agent/dashboard"),
            },
          ],
        );
      } else {
        throw new Error(
          data.message || "Failed to start advertisement sponsorship",
        );
      }
    } catch (err) {
      Alert.alert(
        "Advertisement sponsorship activation Error",
        err.message ||
          "Unable to start advertisement sponsorship. Please try again.",
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
                  isLoading || property.isOnAdvertisement
                    ? "bg-gray-400"
                    : "bg-[#BBCC13]"
                }
                                `}
                onPress={initiatePayment}
                disabled={isLoading || property.isOnAdvertisement}
              >
                <Text className="text-white font-rbold text-lg">
                  {isLoading
                    ? "Processing..."
                    : property.isOnAdvertisement
                      ? paymentCountdown || "Calculating..."
                      : "Pay Now"}
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
