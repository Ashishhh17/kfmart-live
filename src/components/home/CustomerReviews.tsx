import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../../data/initialData';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Customer Reviews & Ratings</h2>
        <p className="text-xs text-slate-500">Over 50,000+ happy buyers delivered in Pincode 229413</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CUSTOMER_REVIEWS.map(rev => (
          <div key={rev.id} className="p-5 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 relative">
            <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
            
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "{rev.comment}"
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{rev.userName}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
