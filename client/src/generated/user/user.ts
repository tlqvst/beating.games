/**
 * Generated by orval v6.24.0 🍺
 * Do not edit manually.
 * beating.games
 * Swagger documentation
 * OpenAPI spec version: 1.0
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query'
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query'
import type {
  GetLoggedInUserStatusDto,
  PublicUserResponseDto,
  SignupUserDto,
  UpdateUserSettingsDto
} from '.././dto'
import { orvalInstance } from '../../lib/axios/orvalInstance';
import { formDataTransformer } from '../../lib/orval/formDataTransformer';


type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];


/**
 * @summary Gets a users public profile
 */
export const getProfile = (
    username: string,
 options?: SecondParameter<typeof orvalInstance>,signal?: AbortSignal
) => {
      
      
      return orvalInstance<PublicUserResponseDto>(
      {url: `/api/user/${username}`, method: 'GET', signal
    },
      options);
    }
  

export const getGetProfileQueryKey = (username: string,) => {
    return [`/api/user/${username}`] as const;
    }

    
export const getGetProfileQueryOptions = <TData = Awaited<ReturnType<typeof getProfile>>, TError = unknown>(username: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>>, request?: SecondParameter<typeof orvalInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetProfileQueryKey(username);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getProfile>>> = ({ signal }) => getProfile(username, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(username), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData> & { queryKey: QueryKey }
}

export type GetProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getProfile>>>
export type GetProfileQueryError = unknown

/**
 * @summary Gets a users public profile
 */
export const useGetProfile = <TData = Awaited<ReturnType<typeof getProfile>>, TError = unknown>(
 username: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>>, request?: SecondParameter<typeof orvalInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetProfileQueryOptions(username,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * @summary Registers a new user
 */
export const signupUser = (
    signupUserDto: SignupUserDto,
 options?: SecondParameter<typeof orvalInstance>,) => {
      
      
      return orvalInstance<void>(
      {url: `/api/user`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: signupUserDto
    },
      options);
    }
  


export const getSignupUserMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof signupUser>>, TError,{data: SignupUserDto}, TContext>, request?: SecondParameter<typeof orvalInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof signupUser>>, TError,{data: SignupUserDto}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof signupUser>>, {data: SignupUserDto}> = (props) => {
          const {data} = props ?? {};

          return  signupUser(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type SignupUserMutationResult = NonNullable<Awaited<ReturnType<typeof signupUser>>>
    export type SignupUserMutationBody = SignupUserDto
    export type SignupUserMutationError = unknown

    /**
 * @summary Registers a new user
 */
export const useSignupUser = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof signupUser>>, TError,{data: SignupUserDto}, TContext>, request?: SecondParameter<typeof orvalInstance>}
) => {

      const mutationOptions = getSignupUserMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Updates currently logged in users settings
 */
export const updateUserSettings = (
    updateUserSettingsDto: UpdateUserSettingsDto,
 options?: SecondParameter<typeof orvalInstance>,) => {
      
      const formData = formDataTransformer(updateUserSettingsDto)
      return orvalInstance<void>(
      {url: `/api/user`, method: 'PUT',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData
    },
      options);
    }
  


export const getUpdateUserSettingsMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUserSettings>>, TError,{data: UpdateUserSettingsDto}, TContext>, request?: SecondParameter<typeof orvalInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateUserSettings>>, TError,{data: UpdateUserSettingsDto}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUserSettings>>, {data: UpdateUserSettingsDto}> = (props) => {
          const {data} = props ?? {};

          return  updateUserSettings(data,requestOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type UpdateUserSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateUserSettings>>>
    export type UpdateUserSettingsMutationBody = UpdateUserSettingsDto
    export type UpdateUserSettingsMutationError = unknown

    /**
 * @summary Updates currently logged in users settings
 */
export const useUpdateUserSettings = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUserSettings>>, TError,{data: UpdateUserSettingsDto}, TContext>, request?: SecondParameter<typeof orvalInstance>}
) => {

      const mutationOptions = getUpdateUserSettingsMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Gets information about logged in user
 */
export const getLoginStatus = (
    
 options?: SecondParameter<typeof orvalInstance>,signal?: AbortSignal
) => {
      
      
      return orvalInstance<GetLoggedInUserStatusDto>(
      {url: `/api/user`, method: 'GET', signal
    },
      options);
    }
  

export const getGetLoginStatusQueryKey = () => {
    return [`/api/user`] as const;
    }

    
export const getGetLoginStatusQueryOptions = <TData = Awaited<ReturnType<typeof getLoginStatus>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLoginStatus>>, TError, TData>>, request?: SecondParameter<typeof orvalInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetLoginStatusQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getLoginStatus>>> = ({ signal }) => getLoginStatus(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getLoginStatus>>, TError, TData> & { queryKey: QueryKey }
}

export type GetLoginStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getLoginStatus>>>
export type GetLoginStatusQueryError = unknown

/**
 * @summary Gets information about logged in user
 */
export const useGetLoginStatus = <TData = Awaited<ReturnType<typeof getLoginStatus>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLoginStatus>>, TError, TData>>, request?: SecondParameter<typeof orvalInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetLoginStatusQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}


