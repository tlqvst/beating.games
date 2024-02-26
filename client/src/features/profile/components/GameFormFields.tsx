import { FIVE_MEGABYTES } from '@/constants/fileSizes';
import { UpsertGameRequestDto } from '@/generated/dto';
import {
  TextInput,
  Select,
  Image,
  Textarea,
  Checkbox,
  Group,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';

export const GameFormFields = ({
  form,
}: {
  form: UseFormReturnType<UpsertGameRequestDto>;
}) => {
  return (
    <>
      <TextInput
        label="Title"
        mb="md"
        required
        withAsterisk
        {...form.getInputProps('title')}
      />
      <Select
        label="Status"
        required
        withAsterisk
        mb="md"
        data={['In Progress', 'Beaten', 'Continual', 'Dropped', 'Want To Play']}
        {...form.getInputProps('status')}
      />
      <TextInput
        label="System"
        mb="md"
        required
        withAsterisk
        {...form.getInputProps('system')}
      />
      <Textarea label="Content" mb="md" {...form.getInputProps('content')} />
      <TextInput
        inputMode="numeric"
        label="Playtime"
        mb="md"
        pattern="[0-9]+"
        description="In hours, numbers only"
        {...form.getInputProps('playtime')}
      />
      <DatePickerInput
        label="Date"
        mb="md"
        description="Date of starting, completing, dropping etc"
        clearable
        {...form.getInputProps('date')}
      />
      <TextInput
        label="Achievements link"
        description="An external link to e.g. your Steam Achievements page, PSN Profiles or other"
        mb="md"
        type="url"
        {...form.getInputProps('achievementsLink')}
      />
      <Checkbox
        label="Do you own the game?"
        mb="md"
        {...form.getInputProps('owned', { type: 'checkbox' })}
      />
      <Checkbox
        label="Did you perfect the game?"
        mb="md"
        {...form.getInputProps('perfectGame', { type: 'checkbox' })}
      />
      {form.values.background && (
        <Image mb="md" src={URL.createObjectURL(form.values.background)} />
      )}
      <Dropzone
        maxSize={FIVE_MEGABYTES}
        onDrop={(files) => form.setFieldValue('background', files[0])}
        mb="md"
        onReject={() =>
          notifications.show({
            color: 'red',
            title: 'Image too large',
            message: 'Max file size is 5 MB',
          })
        }
      >
        <Group justify="center" align="center">
          <IconUpload />
          <Text ta={'center'}>Drop image here or click to pick a file</Text>
        </Group>
      </Dropzone>
    </>
  );
};
