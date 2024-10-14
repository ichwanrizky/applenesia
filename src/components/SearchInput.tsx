import React, { useEffect } from "react";
import { useRef } from "react";

const SearchInput = React.memo(({ search, setSearch }: any) => {
  const inputRef: any = useRef(null);

  // Retain focus on the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [search]);

  return (
    <input
      ref={inputRef}
      className="form-control form-control-sm"
      placeholder="Search"
      type="text"
      style={{ width: 180 }}
      onChange={(e) => setSearch(e.target.value)}
      value={search}
    />
  );
});

export default SearchInput;
