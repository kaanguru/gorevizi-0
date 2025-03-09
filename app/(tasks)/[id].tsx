import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge, Alert } from '@rneui/themed';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';

import Header from '~/components/Header';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';
import { Box } from '~/components/ui/box';
import { Button, ButtonText } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from '~/components/ui/checkbox';
import { Divider } from '~/components/ui/divider';
import { HStack } from '~/components/ui/hstack';
import { Pressable } from '~/components/ui/pressable';
import { VStack } from '~/components/ui/vstack';
import useChecklistItemMutations from '~/hooks/useCheckListMutations';
import useChecklistItemsQuery from '~/hooks/useCheckListQueries';
import { useDeleteTask, useToggleComplete } from '~/hooks/useTasksMutations';
import { useTaskById } from '~/hooks/useTasksQueries';
import getRepeatPeriodLabel from '~/utils/getRepeatPeriodLabel';

import { useDeleteTask, useToggleComplete } from '~/hooks/useTasksMutations';
import { useTaskById } from '~/hooks/useTasksQueries';

export default function TaskDetailPage() {
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { data: checklistItems, isLoading: isChecklistItemsLoading } =
    useChecklistItemsQuery(taskID);
  const { updateChecklistItemCompletion } = useChecklistItemMutations(taskID);
  const {
    mutate: toggleComplete,
    isError: isToggleCompleteError,
    error: toggleCompleteError,
    isPending: toggleCompleteIsPending,
  } = useToggleComplete();

  const { data: task, isLoading, isError, error, refetch } = useTaskById(taskID);
  const { mutate: deleteTask } = useDeleteTask();
  const { theme } = useTheme();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleToggleComplete = () => {
    task ? toggleComplete({ taskID: +taskID, isComplete: !task.is_complete }) : null;
    refetch();
  };

  if (!task || isChecklistItemsLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Error: {error.message}</Text>
      </Box>
    );
  }

  // Added null check for task
  if (!task) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Task not found.</Text>
      </Box>
    );
  }
  const handleDeleteTask = (taskID: string): void => {
    setShowAlertDialog(false);
    deleteTask(taskID);
    router.push('/(drawer)');
  };
  return (
    <ScrollView className=" bg-background-light dark:bg-background-dark flex-1">
      <VStack space="sm" className="flex-1 ">
        <Header headerTitle="" />
        <HStack className="-mt-12 me-5 justify-end">
          <Pressable className="px-5" onPress={() => router.push(`/(tasks)/edit/${taskID}`)}>
            <FontAwesome6
              name="pencil"
              size={22}
              color={theme === 'dark' ? '#FFFAEB' : '#051824'}
            />
          </Pressable>
          <Pressable className="me-1" onPress={() => setShowAlertDialog(true)}>
            <Ionicons name="trash-bin" size={24} color={theme === 'dark' ? '#FF006E' : '#BE004E'} />
          </Pressable>
          <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className="w-full max-w-[415px] items-center gap-4">
              <Box className="bg-background-error h-[52px] w-[52px] items-center justify-center rounded-full">
                <Ionicons
                  name="trash-bin"
                  size={24}
                  color={theme === 'dark' ? '#FFFAEB' : '#051824'}
                />
              </Box>
              <AlertDialogHeader className="mb-2">
                <Text>Delete Task?</Text>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text className="text-center text-sm">
                  The Task will be deleted from the database. This cannot be undone.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter className="mt-5">
                <Button
                  size="sm"
                  action="negative"
                  onPress={() => handleDeleteTask(taskID)}
                  className="px-[30px]">
                  <ButtonText className="text-error-100">Delete</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  size="sm"
                  className="px-[30px]">
                  <ButtonText>Cancel</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HStack>
        <Card className="bg-background-dark text-typography-white dark:bg-background-light dark:text-typography-black mx-5 mt-4">
          <Text className=" text-typography-white dark:text-typography-black justify-self-center p-4 text-center text-2xl">
            {task.title}
          </Text>
          {task.notes && (
            <Box className="bg-background-light rounded-sm p-3">
              <Markdown>{task.notes}</Markdown>
            </Box>
          )}
          <Divider className="my-3" />

          {/* Task Status */}
          <VStack className="mx-auto my-5 w-full items-center justify-center px-4" space="xl">
            {toggleCompleteIsPending ? (
              <ActivityIndicator size="small" color="#8AC926" />
            ) : (
              <Checkbox
                size="lg"
                isChecked={task.is_complete}
                onChange={handleToggleComplete}
                className="bg-background-light dark:bg-background-dark mx-auto rounded-md p-2"
                value="is_complete">
                <CheckboxLabel>{task.is_complete ? 'Completed' : 'Not Completed'}</CheckboxLabel>
                <CheckboxIndicator>
                  {task.is_complete ? (
                    <FontAwesome6 name="check" size={16} color="#8AC926" />
                  ) : null}
                </CheckboxIndicator>
              </Checkbox>
            )}
          </VStack>
          {!task.repeat_period && (
            <Text className="text-typography-white dark:text-typography-black text-center">
              It is not a repeating task
            </Text>
          )}
          {task.repeat_period && (
            <VStack className="bg-gray.50 rounded-lg p-4">
              <VStack className="items-center justify-center">
                <MaterialCommunityIcons name="calendar-sync" size={24} color="#CC9900" />
                <Text className="text-typography-white  dark:text-typography-black">
                  Every {task.repeat_frequency} {getRepeatPeriodLabel(task.repeat_period)}{' '}
                </Text>
              </VStack>
              {task.repeat_on_wk && task.repeat_on_wk.length > 0 && (
                <HStack space="sm" className="flex-wrap justify-center">
                  {task.repeat_on_wk.map((day) => (
                    <Badge key={day} variant="outline" className="my-3 p-1">
                      <Text className="text-gray.700 p-3">{day}</Text>
                    </Badge>
                  ))}
                </HStack>
              )}
            </VStack>
          )}
        </Card>
        <HStack className="m-2  justify-between px-1" space="lg">
          <VStack className="items-start px-2">
            <Text className="text-xs">start</Text>
            <Text>{new Date(task.created_at!).toLocaleDateString()}</Text>
            <Divider />
          </VStack>
          {task.updated_at && (
            <VStack className="items-end px-2">
              <Text className="text-xs">update</Text>
              <Text>{new Date(task.updated_at!).toLocaleDateString()}</Text>
              <Divider />
            </VStack>
          )}
        </HStack>

        {checklistItems && checklistItems.length > 0 ? (
          <VStack className="m-3 flex-col p-4" space="xl">
            <HStack>
              <Text className="text-typography-black dark:text-typography-white pb-2 text-lg">
                Routine Steps
              </Text>
            </HStack>
            {checklistItems.map((item) => (
              <Box key={item.id} className="my-2 flex-row items-center py-2">
                <Checkbox
                  value={item.id.toString()}
                  isChecked={item.is_complete}
                  onChange={() =>
                    updateChecklistItemCompletion({
                      id: item.id,
                      is_complete: !item.is_complete,
                    })
                  }>
                  <CheckboxIndicator size="lg" className="h-8 w-8" />
                  <CheckboxLabel className="ms-3">{item.content}</CheckboxLabel>
                </Checkbox>
              </Box>
            ))}
            <Divider />
          </VStack>
        ) : (
          <Text className="text-muted dark:text-typography-white p-4 text-center">
            No Routines found. Edit Task to add some
          </Text>
        )}
      </VStack>
    </ScrollView>
  );
}
