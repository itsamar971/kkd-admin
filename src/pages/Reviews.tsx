import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

import { Star, Trash2, AlertCircle } from 'lucide-react';

interface Review {
  id: string; // The order ID which holds the review
  rating: number;
  reviewText: string;
  buyerName: string;
  reviewedAt: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Mock Data
      setTimeout(() => {
        setReviews([
          { id: 'ORD-1003-C', rating: 5, reviewText: 'Very fresh produce and fast delivery!', buyerName: 'Rahul Verma', reviewedAt: '2023-10-21T10:00:00Z' },
          { id: 'ORD-1005-E', rating: 1, reviewText: 'The quality was poor and the delivery was late.', buyerName: 'Anil Kumar', reviewedAt: '2023-10-19T14:30:00Z' },
          { id: 'ORD-1006-F', rating: 4, reviewText: '', buyerName: 'Sneha Gupta', reviewedAt: '2023-10-18T09:15:00Z' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeletingId(orderId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Remove from UI
      setReviews(prev => prev.filter(r => r.id !== orderId));
    } catch (error) {
      console.error('Failed to delete review', error);
      alert('Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Review Moderation</h2>
        <p className="text-sm text-slate-500">
          Monitor buyer reviews and remove inappropriate content.
        </p>
      </div>

      <div className="bg-white rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-700">Recent Reviews</h3>
          <p className="text-sm text-slate-400">All product and order reviews left by buyers.</p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center text-slate-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <AlertCircle className="h-10 w-10 text-slate-300 mb-2" />
              <p>No reviews found.</p>
              <p className="text-sm">Make sure the backend endpoint is implemented.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="max-w-md">Review Content</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.buyerName}</TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell className="max-w-md truncate" title={review.reviewText}>
                        {review.reviewText || <span className="italic text-slate-400">No text provided</span>}
                      </TableCell>
                      <TableCell>
                        {review.reviewedAt 
                          ? new Date(review.reviewedAt).toLocaleDateString()
                          : 'Unknown Date'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">
                              Read
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Review Details</DialogTitle>
                              <DialogDescription>
                                Left by {review.buyerName} on {new Date(review.reviewedAt).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="mb-4">
                                {renderStars(review.rating)}
                              </div>
                              <div className="bg-slate-50 p-4 rounded-md border text-slate-800 whitespace-pre-wrap min-h-[100px]">
                                {review.reviewText || <span className="italic text-slate-400">No text provided</span>}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                        >
                          {deletingId === review.id ? '...' : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
