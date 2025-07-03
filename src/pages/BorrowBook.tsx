import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { IBorrow } from '../types';
import { useCreateBorrowMutation } from '../api/borrowApi';
import { useGetBookByIdQuery } from '../api/bookApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BorrowFormInputs {
  quantity: number;
  dueDate: string;
}

const BorrowBook: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { data: bookData, isLoading: isBookLoading, isError: isBookError } = useGetBookByIdQuery(bookId!);
  const [createBorrow, { isLoading: isBorrowing }] = useCreateBorrowMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<BorrowFormInputs>();
  const quantityWatch = watch('quantity');
  const dueDateWatch = watch('dueDate');

  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date) {
      setValue('dueDate', format(date, 'yyyy-MM-dd'));
    }
  }, [date, setValue]);


  const onSubmit: SubmitHandler<BorrowFormInputs> = async (data) => {
    if (!bookId) return;

    if (!bookData?.data || data.quantity > bookData.data.copies) {
      toast.error('Requested quantity exceeds available copies.');
      return;
    }

    try {
      const borrowData: IBorrow = {
        book: bookId,
        quantity: data.quantity,
        dueDate: data.dueDate,
      };
      await createBorrow(borrowData).unwrap();
      toast.success('Book borrowed successfully!');
      navigate('/borrow-summary');
    } catch (err: unknown) {
      interface ErrorWithMessage {
        data?: { message?: string };
        message?: string;
      }
      const errorObj = err as ErrorWithMessage;
      const errorMessage =
        typeof err === 'object' && err !== null
          ? errorObj?.data?.message || errorObj?.message || 'Unknown error'
          : 'Unknown error';
      toast.error(`Failed to borrow book: ${errorMessage}`);
      console.error('Failed to borrow book:', err);
    }
  };

  if (isBookLoading) return <div className="text-center py-8 text-gray-700">Loading book details...</div>;
  if (isBookError || !bookData?.data) return <div className="text-center py-8 text-red-600">Error: Book not found or could not be loaded.</div>;

  const book = bookData.data;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Borrow "{book.title}"</h1>
      <p className="text-center text-gray-600 mb-4">Available copies: <span className="font-semibold">{book.copies}</span></p>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' },
                max: { value: book.copies, message: `Quantity cannot exceed available copies (${book.copies})` },
                valueAsNumber: true,
              })}
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span className="text-gray-500">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="hidden"
              id="dueDate"
              {...register('dueDate', { required: 'Due Date is required' })}
            />
            {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isBorrowing || quantityWatch > book.copies || quantityWatch < 1 || !dueDateWatch}
            >
              {isBorrowing ? 'Borrowing...' : 'Borrow Book'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BorrowBook;