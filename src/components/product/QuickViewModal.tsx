import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, Heart, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, buyNow, toggleWishlist, isInWishlist } = useStore();

  const isShoe = Boolean(
    quickViewProduct?.category === 'Shoes' || 
    quickViewProduct?.name.toLowerCase().includes('shoe') ||
    quickViewProduct?.name.toLowerCase().includes('sneaker') ||
    quickViewProduct?.name.toLowerCase().includes('footwear') ||
    quickViewProduct?.name.toLowerCase().includes('sandal') ||
    quickViewProduct?.name.toLowerCase().includes('chappal') ||
    quickViewProduct?.name.toLowerCase().includes('slippers') ||
    quickViewProduct?.name.toLowerCase().includes('boot')
  );

  const isGarment = Boolean(
    quickViewProduct?.category === 'Fashion' || 
    quickViewProduct?.category === 'Shoes' || 
    quickViewProduct?.category === 'Men' || 
    quickViewProduct?.category === 'Women' || 
    quickViewProduct?.category === 'Kids' || 
    isShoe ||
    (quickViewProduct?.availableSizes && quickViewProduct.availableSizes.length > 0)
  );

  const defaultShoeSizes = ['6 UK', '7 UK', '8 UK', '9 UK', '10 UK', '11 UK'];
  const defaultApparelSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const sizesList = quickViewProduct?.availableSizes && quickViewProduct.availableSizes.length > 0 
    ? quickViewProduct.availableSizes 
    : (isShoe ? defaultShoeSizes : defaultApparelSizes);

  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0] || (isShoe ? '7 UK' : 'M'));

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src={quickViewProduct.images[0]} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1E3A8A] dark:text-amber-400">
                {quickViewProduct.brand}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-2 line-clamp-2">
                {quickViewProduct.name}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {quickViewProduct.rating}
                </span>
                <span className="text-[11px] text-slate-400">({quickViewProduct.reviewsCount} reviews)</span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{quickViewProduct.sellingPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{quickViewProduct.mrp.toLocaleString()}
                </span>
              </div>

              {/* Garment / Shoe Size Picker */}
              {isGarment && (
                <div className="mb-3 space-y-1.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#1E3A8A]" /> {isShoe ? 'Shoe Size (UK):' : 'Size:'}
                    </span>
                    <span className="font-extrabold text-[#1E3A8A] dark:text-amber-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      {selectedSize}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sizesList.map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[36px] h-7 px-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {quickViewProduct.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, 1, undefined, isGarment ? selectedSize : undefined);
                    setQuickViewProduct(null);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#005723]" />
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    buyNow(quickViewProduct, 1, isGarment ? selectedSize : undefined);
                    setQuickViewProduct(null);
                  }}
                  className="bg-[#005723] hover:bg-[#00401A] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Buy Now
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border ${
                  inWishlist 
                    ? 'bg-red-50 text-red-600 border-red-200' 
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
