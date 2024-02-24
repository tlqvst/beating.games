module.exports = {
  beatinggames: {
    output: {
      clean: true,
      mode: 'tags-split',
      target: 'src/generated/beatinggames.ts',
      schemas: 'src/generated/dto',
      client: 'react-query',
      mock: true,
      override: {
        useDates: true,
        mutator: {
          path: './src/lib/axios/orvalInstance.ts',
          name: 'orvalInstance',
        },
        formData: {
          path: './src/lib/orval/formDataTransformer.ts',
          name: 'formDataTransformer',
        },
      },
    },
    input: {
      target: 'http://localhost:3117/swagger-json',
    },
  },
};
