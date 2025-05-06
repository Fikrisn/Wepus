import { useState } from "react"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching:", searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-1 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
      >
        Cari
      </button>
    </form>
  )
}

export default Search