import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  MapPin, 
  Check, 
  Share2, 
  Tag, 
  Building2,
  Clock,
  Zap
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, buyNow, toggleWishlist, isInWishlist, pincode, validatePincode, pincodeError, products } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [checkPin, setCheckPin] = useState(pincode);
  const [pinValidMessage, setPinValidMessage] = useState<string | null>(null);

  const isGarment = Boolean(
    product?.category === 'Fashion' || 
    product?.category === 'Shoes' || 
    (product?.availableSizes && product.availableSizes.length > 0)
  );

  const sizesList = product?.availableSizes && product.availableSizes.length > 0 
    ? product.availableSizes 
    : (product?.category === 'Shoes' ? ['6', '7', '8', '9', '10'] : ['S', 'M', 'L', 'XL', 'XXL']);

  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0] || 'M');

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const savings = product.mrp - product.sellingPrice;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePincode(checkPin)) {
      setPinValidMessage('Delivery available! Express dispatch to Pincode 229413.');
    } else {
      setPinValidMessage(null);
    }
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] flex flex-col">
        
        {/* Sticky Close Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1E3A8A] dark:text-amber-400 uppercase tracking-widest">{product.category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">{product.brand}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
              <img 
                src={product.images[selectedImage] || product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-[#F97316] text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-md">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#F97316] scale-105 shadow-sm' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Vendor Details Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#1E3A8A]" />
                  Verified Vendor Hub
                </span>
                <span className="flex items-center gap-1 bg-amber-500/10 text-[#F97316] text-xs font-bold px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-[#F97316]" /> {product.vendorRating} / 5.0
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{product.vendorName}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#F97316] font-extrabold mt-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery Time: {product.estimatedDeliveryTime || '24 Hours Express'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">100% Genuine product directly dispatched from vendor warehouse.</p>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">{product.reviewsCount} Customer Reviews</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-blue-50/50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{product.sellingPrice.toLocaleString()}
                </span>
                {product.mrp > product.sellingPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                )}
                {savings > 0 && (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-md">
                    You Save ₹{savings}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Includes all applicable taxes & vendor shipping charges.</p>
            </div>

            {/* Pincode Availability Checker */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                Check Delivery Availability
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  value={checkPin}
                  onChange={(e) => setCheckPin(e.target.value)}
                  placeholder="Enter Pincode (229413)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
                >
                  Check
                </button>
              </form>

              {pinValidMessage && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {pinValidMessage}
                </p>
              )}
              {pincodeError && (
                <p className="text-xs text-red-500 font-semibold">{pincodeError}</p>
              )}
            </div>

            {/* Key Policies */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <RotateCcw className="w-4 h-4 text-[#F97316]" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">24-Hour Policy</p>
                  <p className="text-[10px] text-slate-500">Return/Exchange active for 24h post delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <Truck className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Delivery Charges</p>
                  <p className="text-[10px] text-slate-500">₹20 fee under ₹1,000 | <strong>FREE on ₹1,000+</strong></p>
                </div>
              </div>
            </div>

            {/* Garments / Apparel Size Selection */}
            {isGarment && (
              <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-amber-400" />
                    Select Size
                  </span>
                  <span className="text-xs font-extrabold text-[#1E3A8A] dark:text-amber-400 bg-blue-100/70 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-lg">
                    Selected: {selectedSize}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {sizesList.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[46px] h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all border ${
                        selectedSize === sz
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md scale-105 ring-2 ring-blue-300 dark:ring-blue-800'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-[#1E3A8A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Standard Indian sizing (S, M, L, XL, XXL). Free replacement within 24 hours.</p>
              </div>
            )}

            {/* Description & Specifications */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Product Description</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>

              {Object.keys(product.specifications).length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">{key}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart & Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity, undefined, isGarment ? selectedSize : undefined);
                  onClose();
                }}
                className="flex-1 min-w-[130px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#005723]" />
                Add To Bag
              </button>

              <button
                onClick={() => {
                  buyNow(product, quantity, isGarment ? selectedSize : undefined);
                  onClose();
                }}
                className="flex-1 min-w-[130px] bg-[#005723] hover:bg-[#00401A] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                Buy Now
              </button>

              <a
                href={`https://wa.me/919161772664?text=${encodeURIComponent(`Hello KF Mart, I have a query about the product: "${product.name}" (ID: ${product.id}, Price: ₹${product.sellingPrice}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                title="Ask Product Query on WhatsApp (+91 91617 72664)"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  inWishlist 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
