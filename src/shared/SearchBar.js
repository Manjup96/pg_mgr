// src/components/SearchBar.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import '../styles/components/SearchBar.scss'; // Ensure you create and import the corresponding SCSS file for styling

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form className="search" onSubmit={handleSearchSubmit}>
      <input 
        type="text" 
        placeholder="Search everything" 
        value={searchQuery} 
        onChange={handleSearchChange} 
      />
      <button type="submit"><i className="fas fa-search"></i></button>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
