// Modern SearchBar Component
import React, { useState, useEffect } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import '../../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Update query when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (onSearch && trimmedQuery) {
      onSearch(trimmedQuery);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="modern-search-form">
      <InputGroup className="modern-search-group">
        <FormControl
          type="text"
          placeholder="Search books, authors, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="modern-search-input"
        />
        <Button type="submit" variant="primary" className="modern-search-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span className="search-button-text">Search</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
