import {
  Button,
  Divider,
  Group,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IGameFilters } from './IGameFilters';

export const GameFilters = ({
  filters,
  onFilter,
  onClearFilters,
}: {
  filters?: IGameFilters;
  onFilter: (filters: IGameFilters) => void;
  onClearFilters?: () => void;
}) => {
  const form = useForm<IGameFilters>({
    name: 'gameFiltersForm',
    initialValues: {
      title: filters?.title ?? '',
      system: filters?.system ?? '',
      status: filters?.status ?? '',
      year: filters?.year ?? '',
    },
    transformValues: (values) => ({
      ...values,
      title: Boolean(values.title) ? values.title : undefined,
      system: Boolean(values.system) ? values.system : undefined,
      status: Boolean(values.status) ? values.status : undefined,
      year: Boolean(values.year) ? values.year : undefined,
    }),
  });

  const handleSubmit = form.onSubmit((filters) => onFilter(filters));

  return (
    <form onSubmit={handleSubmit}>
      <Title order={2}>Filters</Title>
      <Divider mb="md" />
      <TextInput
        mb="sm"
        label={'Filter by title'}
        placeholder={'Enter a title'}
        {...form.getInputProps('title')}
      />
      <TextInput
        mb="sm"
        label={'Filter by system'}
        {...form.getInputProps('system')}
      />
      <Select
        mb="sm"
        clearable
        data={['In Progress', 'Beaten', 'Dropped', 'Want To Play', 'Continual']}
        label={'Filter by status'}
        placeholder={'Pick one'}
        {...form.getInputProps('status')}
      />
      <TextInput
        mb="sm"
        label={'Filter by year'}
        {...form.getInputProps('year')}
      />

      <Group grow mt="md">
        <Button type="submit">Filter</Button>

        {onClearFilters && (
          <Button variant="subtle" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </Group>
    </form>
  );
};
