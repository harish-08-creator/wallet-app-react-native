import { Stack } from "expo-router/stack";
import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return; //this is for a better user experience
  if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
