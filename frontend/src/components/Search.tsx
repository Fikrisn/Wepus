import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching:", searchTerm);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-blue-500"
    >
      <SearchIcon className="text-gray-500 w-4 h-4" />
      <input
        type="text"
        placeholder="Cari buku..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
      />
      <button
        type="submit"
        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition font-medium"
      >
        Cari
      </button>
    </form>
  );
};

export default Search;
