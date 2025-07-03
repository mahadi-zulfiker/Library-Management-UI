import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IBorrow, IBorrowSummaryItem, ApiResponse } from '../types';

const BASE_URL = 'https://library-management-drab-xi.vercel.app/api';

export const borrowApi = createApi({
  reducerPath: 'borrowApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Borrows', 'Books'],
  endpoints: (builder) => ({
    createBorrow: builder.mutation<ApiResponse<IBorrow>, IBorrow>({
      query: (newBorrow) => ({
        url: '/borrow',
        method: 'POST',
        body: newBorrow,
      }),
      invalidatesTags: ['Borrows', 'Books'],
    }),
    getBorrowedBooksSummary: builder.query<ApiResponse<IBorrowSummaryItem[]>, void>({
      query: () => '/borrow',
      providesTags: ['Borrows'],
    }),
  }),
});

export const { useCreateBorrowMutation, useGetBorrowedBooksSummaryQuery } = borrowApi;