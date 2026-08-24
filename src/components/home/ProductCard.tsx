import React from 'react';
import { Heart, Star, ShoppingBag, Eye, Truck, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, buyNow, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const inWishlist = isInWishlist(product.id);

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
    >
      {/* Top Image Container */}
      <div 
        className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer p-3 flex items-center justify-center" 
        onClick={() => onOpenDetails(product)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Yellow Top-Left Discount Badge matching screenshot */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-[#EAB308] text-slate-950 font-black text-[11px] px-2 py-0.5 rounded shadow-xs tracking-wider">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-slate-600 hover:text-red-500 border border-slate-200'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#005723] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md"
        >
          <Eye className="w-3 h-3" />
          Quick View
        </button>
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-[#005723] cursor-pointer mb-1.5 leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-[10px] font-extrabold ml-1 text-slate-800">{product.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">({product.reviewsCount})</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm font-black text-slate-900">
              ₹{product.sellingPrice.toLocaleString()}
            </span>
            {product.mrp > product.sellingPrice && (
              <span className="text-[11px] text-slate-400 line-through font-normal">
                ₹{product.mrp.toLocaleString()}
              </span>
            )}
          </div>

          {/* Delivery & Pincode tag */}
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 bg-slate-50 p-1.5 rounded-md mb-2 border border-slate-100">
            <span className="flex items-center gap-1 text-[#005723] font-bold">
              <Truck className="w-3 h-3" />
              ₹20 Delivery
            </span>
            <span className="text-slate-500">{product.estimatedDeliveryTime || '24h Express'}</span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 border border-slate-300 shadow-2xs"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#005723]" />
            <span>Add</span>
          </button>

          <button
            onClick={() => buyNow(product, 1)}
            className="w-full bg-[#005723] hover:bg-[#00401A] text-white text-[11px] font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
            title="Direct Buy"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
