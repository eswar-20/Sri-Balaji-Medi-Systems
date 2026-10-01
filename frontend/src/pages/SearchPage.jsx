import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { productAPI } from '../services/api';
import { validateProduct } from '../utils/productUtils';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const search = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const resp = await productAPI.searchProducts(query);
        if (mounted) setProducts(Array.isArray(resp.data) ? resp.data.map(validateProduct) : []);
      } catch {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    setLoading(true);
    search();
    return () => { mounted = false; };
  }, [query]);

  if (loading) return <Loader size="large" text="Searching equipment catalog..." />;

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#252525] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#252525] mb-1">
            <Search className="w-4 h-4" />
            <span className="text-xs uppercase font-extrabold tracking-wider">Catalog Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Search Results {query && <span>for &ldquo;{query}&rdquo;</span>}
          </h1>
          <p className="text-[#77736E] text-sm mt-1">{products.length} matching medical products found</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E1DA] shadow-sm p-8">
            <EmptyState 
              title="No products matched your search" 
              description={`We couldn't find any medical devices or spare parts matching "${query}". Try searching for categories like "ECG", "X-Ray", "Ultrasound", or "Sensor".`} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
