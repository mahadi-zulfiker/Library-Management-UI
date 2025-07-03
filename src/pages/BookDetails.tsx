// src/pages/BookDetails.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetBookByIdQuery } from '../api/bookApi';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bookData, isLoading, isError, error } = useGetBookByIdQuery(id!);

  interface BookApiError {
    data?: { message?: string };
    message?: string;
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading book details...
      </div>
    );
  }
  if (isError || !bookData?.data) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error ? (error as BookApiError).data?.message || (error as BookApiError).message : 'Book not found or could not be loaded.'}
        <div className="mt-4">
          <Button asChild>
            <Link to="/">Back to All Books</Link>
          </Button>
        </div>
      </div>
    );
  }

  const book = bookData.data;

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">{book.title}</CardTitle>
          <CardDescription className="text-gray-600">by {book.author}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">ISBN:</span>
            <p className="text-gray-900">{book.isbn}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">Genre:</span>
            <Badge variant="secondary">{book.genre.replace(/_/g, ' ')}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">Copies Available:</span>
            <p className="text-gray-900">{book.copies}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">Availability:</span>
            <Badge variant={book.available ? "default" : "destructive"}>
              {book.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          {book.description && (
            <div>
              <span className="font-semibold text-gray-700 block mb-1">Description:</span>
              <p className="text-gray-800 leading-relaxed">{book.description}</p>
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2">
            <p>Created: {new Date(book.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(book.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link to="/">Back to All Books</Link>
          </Button>
          <Button asChild>
            <Link to={`/edit-book/${book._id}`}>Edit Book</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookDetails;