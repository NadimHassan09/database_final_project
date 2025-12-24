// Modern SearchBar Component
import React, { useState } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";
import '../../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
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
