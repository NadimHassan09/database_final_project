// SearchBar.jsx
import React, { useState } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا احنا بنرسل الـ query للـ parent component عشان يعمل البحث
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <FormControl
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
