import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IBook, ICreateBook, IUpdateBook, IBorrow, IBorrowSummaryItem, ApiResponse } from '../types';

const BASE_URL = 'https://library-management-drab-xi.vercel.app/api';

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Books', 'Borrows'],
  endpoints: (builder) => ({
    getBooks: builder.query<ApiResponse<IBook[]>, { page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.limit) queryParams.append('limit', params.limit.toString());
        return `/books?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ _id }) => ({ type: 'Books' as const, id: _id })), { type: 'Books', id: 'LIST' }]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    getBookById: builder.query<ApiResponse<IBook>, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_, __, id) => [{ type: 'Books', id }],
    }),
    createBook: builder.mutation<ApiResponse<IBook>, ICreateBook>({
      query: (newBook) => ({
        url: '/books',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: [{ type: 'Books', id: 'LIST' }, { type: 'Borrows', id: 'LIST' }],
    }),
    updateBook: builder.mutation<ApiResponse<IBook>, { id: string; data: IUpdateBook }>({
      query: ({ id, data }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Books', id }, { type: 'Books', id: 'LIST' }],
    }),
    deleteBook: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Books', id }, { type: 'Books', id: 'LIST' }],
    }),
    createBorrow: builder.mutation<ApiResponse<{ borrow: IBorrow, updatedBook: IBook }>, Omit<IBorrow, '_id' | 'borrower' | 'createdAt' | 'updatedAt' | 'returnedQuantity' | 'isReturned'>>({
      query: (borrowData) => ({
        url: '/borrow',
        method: 'POST',
        body: borrowData,
      }),
      invalidatesTags: [{ type: 'Books', id: 'LIST' }, { type: 'Borrows', id: 'LIST' }],
    }),
    getBorrowedBooksSummary: builder.query<ApiResponse<IBorrowSummaryItem[]>, void>({
      query: () => '/borrow',
      providesTags: (result) =>
        result
          ? [...result.data.map(({ book }) => ({ type: 'Borrows' as const, id: book._id })), { type: 'Borrows', id: 'LIST' }]
          : [{ type: 'Borrows', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useCreateBorrowMutation,
  useGetBorrowedBooksSummaryQuery,
} = bookApi;