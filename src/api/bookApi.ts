// src/api/bookApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ICreateBook, IBook, IUpdateBook, ApiResponse } from "../types";

const BASE_URL = "https://library-management-drab-xi.vercel.app/api";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    // Modified getBooks to accept pagination parameters
    getBooks: builder.query<ApiResponse<IBook[]>, { page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) {
          queryParams.append('page', params.page.toString());
        }
        if (params && params.limit) {
          queryParams.append('limit', params.limit.toString());
        }
        return `/books?${queryParams.toString()}`;
      },
      // Keep providesTags as is, it handles list invalidation
      providesTags: (result) =>
        result
          ? [...result.data.map(({ _id }) => ({ type: 'Books' as const, id: _id })), { type: 'Books', id: 'LIST' }]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    getBookById: builder.query<ApiResponse<IBook>, string>({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: "Books", id }],
    }),
    createBook: builder.mutation<ApiResponse<IBook>, ICreateBook>({
      query: (newBook) => ({
        url: "/books",
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["Books"], // Invalidate all 'Books' queries, including the list
    }),
    updateBook: builder.mutation<
      ApiResponse<IBook>,
      { id: string; data: IUpdateBook }
    >({
      query: ({ id, data }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Books", id }, { type: "Books", id: "LIST" }], // Invalidate specific book and the list
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bookApi.util.updateQueryData("getBooks", undefined, (draft) => {
            // This optimistic update might need refinement for paginated data
            // For now, it updates the cached 'getBooks' without specific params
            // A more robust solution might involve updating specific pages or invalidating more broadly.
            // For this minimal setup, invalidating 'LIST' is often sufficient.
            const bookIndex = draft.data.findIndex((book) => book._id === id);
            if (bookIndex !== -1) {
              Object.assign(draft.data[bookIndex], data);
              if (data.copies !== undefined) {
                draft.data[bookIndex].available = data.copies > 0;
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteBook: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Books", id }, { type: "Books", id: "LIST" }], // Invalidate specific book and the list
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bookApi.util.updateQueryData("getBooks", undefined, (draft) => {
            // Similar note as above for paginated data
            draft.data = draft.data.filter((book) => book._id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;