import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import LogoPortrait from '~/components/lotties/LogoPortrait';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from '~/components/ui/alert-dialog';
import { Box } from '~/components/ui/box';
import { Button, ButtonText } from '~/components/ui/button';
import { HStack } from '~/components/ui/hstack';
import { Input, InputField } from '~/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '~/components/ui/modal';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { useSoundContext } from '~/context/SoundContext';
import { useResetCompletionHistory } from '~/hooks/useTaskCompletionHistory';
import useUser from '~/hooks/useUser';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: resetStats, isPending } = useResetCompletionHistory();
  const { isSoundEnabled, toggleSound } = useSoundContext();

  const { data: user } = useUser();
  const userEmail = user?.email;

  function handleReset() {
    resetStats(undefined, {
      onSuccess: () => setIsDialogOpen(false),
    });
  }
  const handleEmailChange = (text: string) => {
    setNewEmail(text);
  };
  const handleSubmit = () => {
    console.log('New Email:', newEmail);
    setShowModal(false);
    // TODO  send the new email to your backend for verification and update
  };
  return (
    <View className="flex-1 flex-col bg-background-light  p-5 dark:bg-background-dark">
      <Box
        id="theme-toggle"
        className=" bg-background-dark p-0"
        style={{ position: 'absolute', top: -40, right: 1, zIndex: 1 }}>
        <Button size="xs" variant="solid" action="positive" onPress={toggleTheme}>
          {theme === 'light' ? (
            <FontAwesome6 name="moon" size={16} color="#FFFAEB" />
          ) : (
            <FontAwesome6 name="sun" size={16} color="#051824" />
          )}
        </Button>
      </Box>
      <LogoPortrait height={220} width={85} />
      <View className="mb-5 flex-1 flex-col items-center justify-items-start gap-9 p-12 ">
        <Button
          variant="outline"
          size="sm"
          action="positive"
          className="mt-5 "
          onPress={() => router.push('/(tasks)/completed-tasks')}>
          <ButtonText className="text-typography-black dark:text-typography-white">
            Completed
          </ButtonText>
          <Ionicons name="checkmark-done-sharp" size={24} color="black" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          action="positive"
          className="mt-1"
          onPress={() => router.push('/(tasks)/tasks-of-yesterday')}>
          <ButtonText className="text-typography-black dark:text-typography-white">
            Yesterday's
          </ButtonText>
          <FontAwesome5 name="history" size={24} color="black" />
        </Button>
        <HStack className="ml-4 flex-row items-center justify-center gap-2">
          <Text size="sm"> {userEmail}</Text>
          <Button
            variant="link"
            size="sm"
            action="positive"
            className="m-2"
            onPress={() => setShowModal(true)}>
            <FontAwesome6 name="user-pen" size={16} color="black" />
          </Button>
        </HStack>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader className="flex-col items-start gap-0.5">
              <Text className="text-center">Need to use a different email address?</Text>
              <Text size="sm">No worries, we’ll send you reset instructions</Text>
            </ModalHeader>
            <ModalCloseButton onPress={() => setShowModal(false)} />
            <ModalBody className="flex flex-col gap-2">
              <Text size="sm">Set your new mail address</Text>
              <Input className="my-2 w-full">
                <InputField
                  placeholder="New email address"
                  onChangeText={handleEmailChange}
                  value={newEmail}
                  type="text"
                />
              </Input>
            </ModalBody>
            <ModalFooter className="flex-col items-start">
              <Button variant="outline" onPress={handleSubmit}>
                <ButtonText>Submit</ButtonText>
              </Button>
              <Button
                variant="link"
                size="sm"
                onPress={() => {
                  setShowModal(false);
                }}
                className="w-full">
                <FontAwesome6 name="circle-arrow-left" size={24} color="black" />
                <ButtonText>Back to settings</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Button
          size="sm"
          variant="solid"
          action="negative"
          onPress={() => setIsDialogOpen(true)}
          isDisabled={isPending}>
          <ButtonText className="text-typography-white">Reset Statistics</ButtonText>
          <Ionicons name="trash-bin" size={16} color="white" />
        </Button>
      </View>

      <AlertDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Ionicons name="alert-circle" size={24} color="black" />
            <Text className="font-semibold text-typography-950" size="md">
              Are you sure you want to Reset History?
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody className="mb-4 mt-3">
            <Text>
              This will permanently delete all task completion history and reset statistics. This
              action cannot be undone.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDialogOpen(false)} className="mr-3">
              <Text>Cancel</Text>
            </Button>

            <Button variant="solid" action="negative" onPress={handleReset}>
              <Text>Confirm Reset</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Box className="mt-5 flex-row items-center justify-between rounded-lg bg-background-dark p-2 dark:bg-background-light">
        <View className="flex-row items-center">
          {isSoundEnabled ? (
            <FontAwesome6
              name="volume-high"
              size={24}
              color={theme === 'light' ? '#8AC926' : '#ff006e'}
            />
          ) : (
            <FontAwesome6
              name="volume-xmark"
              size={24}
              color={theme === 'light' ? '#8AC926' : '#ff006e'}
            />
          )}

          <Text className="ms-4 text-typography-white dark:text-typography-black">
            {isSoundEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        <Switch
          value={isSoundEnabled}
          onValueChange={toggleSound}
          trackColor={{ true: '#4F10A8', false: '#E5E7EB' }}
          thumbColor="#FFCA3A"
        />
      </Box>
    </View>
  );
}
