import React, { createContext, useContext, useState } from 'react';
import { searchProducts, transformOCCProduct } from '../services/api';
import { productsData } from '../data/productsData'; // Fallback local data

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useAPI, setUseAPI] = useState(true); // Toggle between API and local data
  const [error, setError] = useState(null);

  const performSearch = async (query) => {
    setSearchQuery(query);
    setError(null);

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      if (useAPI) {
        // Use SAP Commerce API
        const response = await searchProducts(query, { pageSize: 50 });
        const transformedProducts = response.products.map(transformOCCProduct);
        setSearchResults(transformedProducts);
      } else {
        // Fallback to local data
        const lowerQuery = query.toLowerCase().trim();
        const results = productsData.filter(product => {
          const searchableText = `
            ${product.code}
            ${product.name}
            ${product.categories}
            ${product.description}
          `.toLowerCase();
          return searchableText.includes(lowerQuery);
        });
        setSearchResults(results);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);

      // Fallback to local search on API error
      if (useAPI) {
        console.log('API failed, falling back to local data');
        const lowerQuery = query.toLowerCase().trim();
        const results = productsData.filter(product => {
          const searchableText = `
            ${product.code}
            ${product.name}
            ${product.categories}
            ${product.description}
          `.toLowerCase();
          return searchableText.includes(lowerQuery);
        });
        setSearchResults(results);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  };

  const toggleDataSource = () => {
    setUseAPI(!useAPI);
    clearSearch();
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        error,
        performSearch,
        clearSearch,
        allProducts: productsData, // Local fallback
        useAPI,
        toggleDataSource
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
