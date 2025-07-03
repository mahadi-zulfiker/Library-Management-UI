import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { ICreateBook } from '../types';
import { useCreateBookMutation } from '../api/bookApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Genre = 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY';
const genres: Genre[] = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];

const CreateBook: React.FC = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ICreateBook>();
  const [createBook, { isLoading }] = useCreateBookMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ICreateBook> = async (data) => {
    try {
      await createBook(data).unwrap();
      toast.success('Book created successfully!');
      navigate('/');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(`Failed to create book: ${error?.data?.message || error?.message || 'Unknown error'}`);
      console.error('Failed to create book:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add New Book</h1>
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
            <Select onValueChange={(value: Genre) => setValue('genre', value)} {...register('genre', { required: 'Genre is required' })}>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Book'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBook;