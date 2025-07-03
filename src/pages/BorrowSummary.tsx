import React from 'react';
import { useGetBorrowedBooksSummaryQuery } from '../api/borrowApi';
import type { IBorrowSummaryItem } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BorrowSummary: React.FC = () => {
  const { data, isLoading, isError, error } = useGetBorrowedBooksSummaryQuery();

  if (isLoading) return <div className="text-center py-8 text-gray-700">Loading borrow summary...</div>;
  if (isError) {
    let errorMessage = 'Something went wrong';
    if (error && typeof error === 'object') {
      type ErrorDataWithMessage = { message?: string };
      if ('status' in error && 'data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
        const errorData = error.data as ErrorDataWithMessage;
        errorMessage = errorData.message || errorMessage;
      } else if ('message' in error) {
        errorMessage = error.message || errorMessage;
      }
    }
    return <div className="text-center py-8 text-red-600">Error: {errorMessage}</div>;
  }

  const summary: IBorrowSummaryItem[] = data?.data || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Borrowed Books Summary</h1>

      {summary.length === 0 ? (
        <p className="text-center text-gray-600">No books have been borrowed yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead className="text-center">Total Quantity Borrowed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.book.title}</TableCell>
                  <TableCell>{item.book.isbn}</TableCell>
                  <TableCell className="text-center">{item.totalQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BorrowSummary;