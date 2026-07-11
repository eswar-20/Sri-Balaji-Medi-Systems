import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { validateProduct } from '../utils/productUtils';
import { productAPI } from '../services/api';
import { SlidersHorizontal, ArrowUpDown, Tag, DollarSign } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-[#142F52]/30 border border-white/[0.06] p-4 rounded-2xl h-[400px] flex flex-col justify-between overflow-hidden relative">
    <div className="aspect-square w-full rounded-xl bg-white/[0.04] shimmer"></div>
    <div className="space-y-3 mt-4 flex-grow">
      <div className="h-3 w-1/4 bg-white/[0.04] rounded shimmer"></div>
      <div className="h-5 w-3/4 bg-white/[0.04] rounded shimmer"></div>
      <div className="h-12 w-full bg-white/[0.04] rounded shimmer"></div>
    </div>
    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/[0.06]">
      <div className="space-y-2 w-1/2">
        <div className="h-3 w-1/2 bg-white/[0.04] rounded shimmer"></div>
        <div className="h-4 w-3/4 bg-white/[0.04] rounded shimmer"></div>
      </div>
      <div className="h-10 w-10 bg-white/[0.04] rounded-xl shimmer"></div>
    </div>
  </div>
);

const SparePartsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayProducts, setDisplayProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || 'featured'
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [resp, cResp] = await Promise.all([
          productAPI.getSparePartsProducts(),
          productAPI.getCategoriesByType('SPARE_PART')
        ]);

        if (mounted) {
          console.log("Axios Response:", resp);
          console.log("Response.data:", resp.data);
          const apiProducts = Array.isArray(resp.data) ? resp.data.map(validateProduct) : [];
          console.log("Products State:", apiProducts);
          const apiCategories = Array.isArray(cResp.data) ? ['All Categories', ...cResp.data] : ['All Categories'];
          setCategories(apiCategories);
          setDisplayProducts(apiProducts);
          
          // Cache to localStorage
          try {
            localStorage.setItem('cached_spare_parts', JSON.stringify(apiProducts));
            localStorage.setItem('cached_spare_categories', JSON.stringify(apiCategories));
          } catch (e) {
            console.warn('Failed to write spare parts cache to localStorage:', e);
          }
        }
      } catch (error) {
        console.error('API spare parts fetch failed, attempting local cache:', error);
        if (mounted) {
          try {
            const cachedProductsStr = localStorage.getItem('cached_spare_parts');
            const cachedCategoriesStr = localStorage.getItem('cached_spare_categories');
            const apiProducts = cachedProductsStr ? JSON.parse(cachedProductsStr) : [];
            const apiCategories = cachedCategoriesStr ? JSON.parse(cachedCategoriesStr) : ['All Categories'];
            
            setDisplayProducts(apiProducts);
            setCategories(apiCategories);
            console.info(`Loaded ${apiProducts.length} spare parts from offline cache.`);
          } catch (e) {
            console.error('Failed to read offline spare parts cache:', e);
            setCategories(['All Categories']);
            setDisplayProducts([]);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All Categories') {
      params.set('category', filters.category);
    }
    if (filters.priceRange) {
      params.set('priceRange', filters.priceRange);
    }
    if (filters.sortBy !== 'featured') {
      params.set('sortBy', filters.sortBy);
    }
    setSearchParams(params);
  }, [filters, setSearchParams]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const priceRangeParam = searchParams.get('priceRange');
    const sortByParam = searchParams.get('sortBy');

    if (categoryParam || priceRangeParam || sortByParam) {
      setFilters({
        category: categoryParam || '',
        priceRange: priceRangeParam || '',
        sortBy: sortByParam || 'featured'
      });
    }
  }, [searchParams]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const filteredAndSortedProducts = displayProducts
    .filter(product => {
      if (filters.category && filters.category !== 'All Categories') {
        return product.category === filters.category;
      }
      return true;
    })
    .filter(product => {
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  console.log("API Response (displayProducts):", displayProducts);
  console.log("Filtered Products (filteredAndSortedProducts):", filteredAndSortedProducts);
  console.log("Categories:", categories);

  return (
    <div className="min-h-screen bg-[#071A2F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Spare Parts</h1>
            <p className="text-[#C8D3E0] text-sm mt-2">
              {loading ? 'Fetching catalogs...' : `${filteredAndSortedProducts.length} certified replacement components in stock`}
            </p>
          </div>
          <div className="w-16 h-1 bg-[#D4AF37] rounded-full hidden md:block"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 shrink-0">
            <div className="bg-[#142F52]/30 border border-white/[0.06] rounded-2xl p-6 sticky top-24 space-y-6 backdrop-blur-lg">
              
              <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-white font-extrabold text-base tracking-wide uppercase">Filter Spare Parts</h2>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#1D9BF0]" /> Part Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field w-full"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Price Budget
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Prices</option>
                  <option value="0-5000">Under ₹5,000</option>
                  <option value="5000-10000">₹5,000 – ₹10,000</option>
                  <option value="10000-25000">₹10,000 – ₹25,000</option>
                  <option value="25000-50000">₹25,000 – ₹50,000</option>
                  <option value="50000-9999999">₹50,000+</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" /> Sort Catalog
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="featured">Featured Status</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  category: '',
                  priceRange: '',
                  sortBy: 'featured'
                })}
                className="w-full btn-secondary text-xs"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4 flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <EmptyState
                title="No spare parts matching filters"
                description="We couldn't find any replacement parts matching your selection. Try resetting filters to browse all spare parts."
                action={
                  <button
                    onClick={() => setFilters({
                      category: '',
                      priceRange: '',
                      sortBy: 'featured'
                    })}
                    className="btn-primary py-2.5 px-6 text-sm"
                  >
                    Clear Filter Selection
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SparePartsPage;
