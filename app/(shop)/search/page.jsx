'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { searchProducts, getAllProducts } from '../../../lib/catalog.js';
import ProductCard from '../../../components/ProductCard.jsx';
import { SearchIcon } from '../../../components/Icons.jsx';

const POPULAR_SEARCHES = ['Kurta', 'Shirt', 'Jeans', 'Sneakers', 'Lipstick', 'Bedsheet', 'Watch', 'Tops'];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const allProducts = getAllProducts();
  const searchResults = query.trim().length > 0 ? searchProducts(query) : allProducts.slice(0, 12);

  return (
    <div style={{ paddingBottom: '24px', backgroundColor: '#f5f5f6', minHeight: '100%' }}>
      {/* Search Header Row */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '12px 14px',
        borderBottom: '1px solid #eaeaec',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f5f5f6',
          border: '1px solid #eaeaec',
          borderRadius: '20px',
          padding: '8px 14px',
          gap: '8px'
        }}>
          <SearchIcon size={16} color="#535766" />
          <input 
            type="text" 
            placeholder="Search for products, brands and more..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              width: '100%',
              outline: 'none',
              fontSize: '13px',
              color: '#282c3f',
              fontFamily: 'Roboto, sans-serif'
            }}
            autoFocus
          />
          {query.length > 0 && (
            <button 
              onClick={() => setQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#94969f',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '0 4px'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Popular Searches Chip Rail */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#94969f', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
            Popular Searches
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {POPULAR_SEARCHES.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(chip)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: query.toLowerCase() === chip.toLowerCase() ? '#ff3f6c' : '#ffffff',
                  color: query.toLowerCase() === chip.toLowerCase() ? '#ffffff' : '#282c3f',
                  border: '1px solid #eaeaec',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ padding: '12px 14px 4px 14px', fontSize: '12px', fontWeight: '700', color: '#535766' }}>
        {query.trim().length > 0 
          ? `Results for "${query}" (${searchResults.length} items)`
          : `Trending Products (${searchResults.length} items)`}
      </div>

      {/* Results Product Grid */}
      <div style={{ padding: '8px 12px' }}>
        {searchResults.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '32px 16px', textAlign: 'center', borderRadius: '8px', margin: '12px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#282c3f' }}>No matching products found</div>
            <div style={{ fontSize: '12px', color: '#535766', marginTop: '4px' }}>Try searching for "Kurta", "Jeans", "Shirt", or "Lipstick"</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
