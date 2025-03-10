import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import LogoPortrait from '~/components/lotties/LogoPortrait';

export default function StartScreen() {
  const router = useRouter();

  return (
    <View className="bg-background-light dark:bg-background-dark flex-1 items-center justify-center px-5">
      <LogoPortrait />

      <View className="w-full space-y-10">
        <Button title="Register" onPress={() => router.push('/register')} />
        <Button title="Login" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}
