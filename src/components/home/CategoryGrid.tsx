import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { LayoutGrid } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  categoryName: Category;
  image: string;
}

const DISPLAY_CATEGORIES: CategoryItem[] = [
  {
    id: 'c1',
    name: 'Fashion',
    categoryName: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop' // Green T-Shirt
  },
  {
    id: 'c2',
    name: 'Footwear',
    categoryName: 'Shoes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop' // White/black sneakers
  },
  {
    id: 'c3',
    name: 'Beauty & Personal Care',
    categoryName: 'Beauty',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop' // Lipstick & makeup compact
  },
  {
    id: 'c4',
    name: 'Bags & Accessories',
    categoryName: 'Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop' // Green handbag
  },
  {
    id: 'c5',
    name: 'Home Essentials',
    categoryName: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400&auto=format&fit=crop' // Home/Kitchen appliance
  },
  {
    id: 'c6',
    name: 'Electronics',
    categoryName: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop' // Smartphone/Headphones
  },
  {
    id: 'c7',
    name: 'Baby & Kids',
    categoryName: 'Kids',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=400&auto=format&fit=crop' // Baby/Kids
  }
];

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <section className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Shop by Category
        </h2>
        <button 
          onClick={() => setSelectedCategory(null)}
          className="text-xs font-bold text-[#005723] hover:underline"
        >
          View All
        </button>
      </div>

      {/* 8 Cards Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {DISPLAY_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat.categoryName)}
            className="group cursor-pointer bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-[#005723] hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-between min-h-[140px]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 group-hover:scale-105 transition-transform duration-200">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-[#005723] line-clamp-2 leading-tight">
              {cat.name}
            </span>
          </div>
        ))}

        {/* 8th Card: More Categories */}
        <div
          onClick={() => setSelectedCategory(null)}
          className="group cursor-pointer bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-[#005723] hover:shadow-md transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[140px]"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-full bg-emerald-50 text-[#005723] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <div className="grid grid-cols-2 gap-1.5 p-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#005723]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#005723]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#005723]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#005723]" />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-900 group-hover:text-[#005723] leading-tight">
            More Categories
          </span>
        </div>
      </div>
    </section>
  );
};
