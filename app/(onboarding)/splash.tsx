import { Text } from '@rneui/themed';
import { Href, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import LogoPortrait from '~/components/lotties/LogoPortrait';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/tutorial' as Href);
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="bg-background-0 flex-1 items-center justify-center">
      <Pressable onPress={() => router.replace('/(onboarding)/tutorial' as Href)}>
        <LogoPortrait />
      </Pressable>
      <Text className="font-delaGothicOne m-3 p-3 text-5xl">GorevIzi</Text>
    </View>
  );
}
