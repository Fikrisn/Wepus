const BookRow = ({ book, index }: { book: any, index: number }) => {
    return (
      <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap"><a href="">{book.id}</a></td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.name}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.category}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.publisher}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.isbn}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.issn}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.author}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.year}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{book.price}</td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium uppercase tracking-wide rounded-full ${book.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {book.available ? 'Tersedia' : 'Kosong'}
          </span>
        </td>
        <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex gap-2">
          <button className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">Edit</button>
          <button className="px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition">Hapus</button>
        </td>
      </tr>
    )
  }
  
  export default BookRow
  