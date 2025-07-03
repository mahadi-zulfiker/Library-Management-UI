import React, { useState } from 'react';
import { useGetBooksQuery, useDeleteBookMutation } from '../api/bookApi';
import type { IBook } from '../types';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusCircleIcon } from 'lucide-react';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Books: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, isError, error } = useGetBooksQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteBook] = useDeleteBookMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDeleteClick = (bookId: string) => {
    setBookToDelete(bookId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete).unwrap();
        toast.success('Book deleted successfully!');
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null) {
          const errorObj = err as { data?: { message?: string }; message?: string };
          toast.error(`Failed to delete book: ${errorObj?.data?.message || errorObj?.message || 'Unknown error'}`);
          console.error('Failed to delete book:', err);
        } else {
          toast.error('Failed to delete book: Unknown error');
          console.error('Failed to delete book:', err);
        }
      } finally {
        setShowConfirm(false);
        setBookToDelete(null);
      }
    }
  };

  if (isLoading) return <div className="text-center py-8 text-gray-700">Loading books...</div>;

  if (isError) {
    let errorMessage = 'Something went wrong';
    if (error) {
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if ('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
        // @ts-expect-error: error.data may not have a typed 'message' property
        errorMessage = error.data.message || errorMessage;
      }
    }
    return <div className="text-center py-8 text-red-600">Error: {errorMessage}</div>;
  }

  const books: IBook[] = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
        <Button asChild>
          <Link to="/create-book" className="flex items-center">
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Add New Book
          </Link>
        </Button>
      </div>

      {books.length === 0 && !isLoading ? (
        <p className="text-center text-gray-600">No books found. Add a new book to get started!</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead className="text-center">Copies</TableHead>
                  <TableHead className="text-center">Availability</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell className="font-medium">
                      <Link to={`/books/${book._id}`} className="hover:underline text-blue-600">
                        {book.title}
                      </Link>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell className="text-center">{book.copies}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={book.available ? "default" : "destructive"}>
                        {book.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="icon" asChild title="Edit Book">
                          <Link to={`/edit-book/${book._id}`}>
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(book._id)}
                          title="Delete Book"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Borrow Book"
                          disabled={!book.available || book.copies === 0}
                          onClick={(e) => {
                            if (!book.available || book.copies === 0) {
                              e.preventDefault();
                              toast('This book is currently unavailable or has no copies.', {
                                icon: 'ℹ️',
                              });
                            }
                          }}
                        >
                          <Link to={`/borrow/${book._id}`}>
                            <PlusCircleIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this book? This action cannot be undone."
      />
    </div>
  );
};

export default Books;