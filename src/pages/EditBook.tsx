import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { IUpdateBook } from '../types';
import { useGetBookByIdQuery, useUpdateBookMutation } from '../api/bookApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Genre = 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
const genres: Genre[] = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bookData, isLoading: isBookLoading, isError: isBookError } = useGetBookByIdQuery(id!);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<IUpdateBook>();

  useEffect(() => {
    if (bookData?.data) {
      const book = bookData.data;
      reset({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        description: book.description,
        copies: book.copies,
      });
      setValue('genre', book.genre);
    }
  }, [bookData, reset, setValue]);

  const onSubmit: SubmitHandler<IUpdateBook> = async (data) => {
    if (!id) return;
    try {
      await updateBook({ id, data }).unwrap();
      toast.success('Book updated successfully!');
      navigate('/');
    } catch (err: unknown) {
      interface ErrorWithData {
        data?: {
          message?: string;
        };
        message?: string;
      }
      let errorMessage = 'Unknown error';
      if (typeof err === 'object' && err !== null) {
        const typedErr = err as ErrorWithData;
        if (
          typedErr.data &&
          typeof typedErr.data === 'object' &&
          typedErr.data !== null &&
          'message' in typedErr.data
        ) {
          errorMessage = typedErr.data.message ?? errorMessage;
        } else if ('message' in typedErr && typedErr.message) {
          errorMessage = typedErr.message;
        }
      }
      toast.error(`Failed to update book: ${errorMessage}`);
      console.error('Failed to update book:', err);
    }
  };

  if (isBookLoading) return <div className="text-center py-8 text-gray-700">Loading book details...</div>;
  if (isBookError || !bookData?.data) return <div className="text-center py-8 text-red-600">Error: Book not found or could not be loaded.</div>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Book</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              {...register('author', { required: 'Author is required' })}
            />
            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select onValueChange={(value: Genre) => setValue('genre', value)} value={bookData.data.genre}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              {...register('isbn', { required: 'ISBN is required' })}
            />
            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="copies">Copies</Label>
            <Input
              type="number"
              id="copies"
              {...register('copies', {
                required: 'Copies is required',
                min: { value: 0, message: 'Copies must be a non-negative number' },
                valueAsNumber: true,
              })}
            />
            {errors.copies && <p className="text-red-500 text-sm">{errors.copies.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Book'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBook;