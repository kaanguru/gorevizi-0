import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import { useSessionContext } from '~/context/AuthenticationContext';
import { resetFirstVisit } from '~/utils/isFirstVisit';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
  const { signIn, authError } = useSessionContext();

  const handleLogin = async function () {
    if (email.length < 5 || !email.includes('@')) {
    } else if (password.length < 8) {
    } else {
      await signIn(email, password);
      setTimeout(() => {
        if (authError) {
          router.replace('/login');
        } else {
          router.replace('/');
        }
      }, 200);
    }
  };

  return (
    <View className="bg-background-light dark:bg-background-dark px-5 pt-12">
      <LogoPortrait height={300} width={110} />

      <Text className=" dark:text-typography-white font-delaGothicOne mb-8 mt-2 text-2xl font-bold text-pink-600">
        Welcome Back
      </Text>
      {loading && <ActivityIndicator />}

      <View className="space-y-4">
        <Input
          className="py-3"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View className="space-y-4">
        <Input placeholder="Enter your password" value={password} onChangeText={setPassword} />

        <Button
          disabled={loading}
          className={styles.registerButton}
          onPress={handleLogin}
          title="Login"
        />

        <Button
          className={styles.registerButton}
          onPress={() => router.push('/register')}
          title="Don't have an account? Register"
        />
        <Button
          className={styles.registerButton}
          onPress={resetFirstVisit}
          title="RESET-FIRST-VISIT"
          R-F-W
        />
      </View>
    </View>
  );
}

const styles = {
  registerButton: 'mt-8 bg-background-dark dark:bg-background-light rounded ',
  buttonText: ' text-center text-typography-white dark:text-typography-black',
};
