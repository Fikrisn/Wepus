import { useState } from 'react'

interface Buku {
  idBuku: number
  namaBuku: string
  tahunPembuatan: string
}

interface SearchProps {
  onSearch: (results: Buku[]) => void
}

const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setIsSearching(true)
      const response = await fetch(`http://localhost:3000/buku/search?nama=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (response.ok) {
        onSearch(data)
      } else {
        console.error('Gagal mencari:', data.message)
        onSearch([])
      }
    } catch (error) {
      console.error('Error saat pencarian:', error)
      onSearch([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Cari buku..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        {isSearching ? 'Mencari...' : 'Cari'}
      </button>
    </form>
  )
}

export default Search
