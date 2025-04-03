import { Image, View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";

import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { account, getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
const SignIn = () => {
  const { setUser, setIsLoggedIn, isLoggedIn, user } = useGlobalContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    // List all active sessions
    let sessions = { sessions: [] };
    try {
      sessions = await account.listSessions();
      if (sessions.sessions.length > 0) {
        console.log("Existing session detected. Deleting current session...");
        await account.deleteSession("current"); // Delete the active session
      }
    } catch (error) {
      console.log("Failed to list sessions:", error);
    }

    if (form.password === "" || form.email === "") {
      Alert.alert("Error", "Please fill in all the fields");
    }
    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      // const result = await getCurrentUser();
      setUser(await getCurrentUser()); //set to global state....
      console.log(`Signin status: ${user} and ${isLoggedIn}`);
      setIsLoggedIn(true); //set to global state....
      console.log(`Signin status after: ${user} and ${isLoggedIn}`);
      Alert.alert("Success", "User signed in Successfully");

      //set to global state....

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shortcut = async () => {
    // List all active sessions
    let sessions = { sessions: [] };
    try {
      sessions = await account.listSessions();
      if (sessions.sessions.length > 0) {
        console.log("Existing session detected. Deleting current session...");
        await account.deleteSession("current"); // Delete the active session
      }
    } catch (error) {
      console.log("Failed to list sessions:", error);
    }

    setIsSubmitting(true);
    try {
      const userData = await signIn("joshua3@gmail.com", "12341234");
      setUser(userData.user);
      setToken(userData.token);
      // const result = await getCurrentUser();
      setUser(await getCurrentUser()); //set to global state....

      console.log(`Signin status: ${user} and ${isLoggedIn}`);
      setIsLoggedIn(true); //set to global state....
      console.log(`Signin status after: ${user} and ${isLoggedIn}`);
      // Alert.alert("Success", "User signed in Successfully");

      //set to global state....
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6 ">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Aura
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="name@email.com"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="Password Here"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Joshua Shortcut"
            handlePress={shortcut}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
