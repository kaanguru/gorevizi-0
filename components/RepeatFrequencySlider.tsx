import { Box } from './ui/box';
import { Center } from './ui/center';
import { HStack } from './ui/hstack';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from './ui/slider';

import { Text } from '~/components/ui/text';
import { RepeatPeriod } from '~/types';
import { calculateRepeatText } from '~/utils/tasks/calculateRepeatText';

export const RepeatFrequencySlider = ({
  period,
  frequency,
  onChange,
}: Readonly<{
  period: RepeatPeriod;
  frequency: number | null;
  onChange: (value: number) => void;
}>) => (
  <Box className="mt-4">
    <HStack space="xl">
      <Text>Repeat Every</Text>
      <Text className="my-auto">{calculateRepeatText(period, frequency as number)}</Text>
    </HStack>
    <HStack space="xl">
      <Center className="m-auto h-1/6 w-4/6">
        <Slider
          className="mt-8"
          defaultValue={1}
          minValue={1}
          maxValue={period === 'Monthly' ? 6 : 15}
          onChange={onChange}
          size="lg"
          orientation="horizontal"
          isDisabled={false}
          isReversed={false}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Center>
    </HStack>
  </Box>
);
