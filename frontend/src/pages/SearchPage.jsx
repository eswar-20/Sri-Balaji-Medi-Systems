import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { productAPI } from '../services/api';
import { validateProduct } from '../utils/productUtils';

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

  if (loading) return <Loader size="large" text="Searching..." />;

  return (
    <div className="min-h-screen bg-matte-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-beige mb-2">Search Results</h1>
        <p className="text-light-gray mb-8">{products.length} results for &quot;{query}&quot;</p>
        {products.length === 0 ? (
          <EmptyState title="No results" description="Try a different search term" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
