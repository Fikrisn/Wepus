const BookRow = ({ book, index }: { book: any; index: number }) => {
  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition'}>
      <td className="p-4 text-sm text-gray-800 font-medium">{book.id}</td>
      <td className="p-4 text-sm text-gray-700">{book.name}</td>
      <td className="p-4 text-sm text-gray-700">{book.category}</td>
      <td className="p-4 text-sm text-gray-700">{book.publisher}</td>
      <td className="p-4 text-sm text-gray-700">{book.isbn || '-'}</td>
      <td className="p-4 text-sm text-gray-700">{book.issn || '-'}</td>
      <td className="p-4 text-sm text-gray-700">{book.author}</td>
      <td className="p-4 text-sm text-gray-700">{book.year}</td>
      <td className="p-4 text-sm text-gray-700">Rp {Number(book.price).toLocaleString('id-ID')}</td>
      <td className="p-4">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full 
            ${book.available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {book.available ? 'Tersedia' : 'Kosong'}
        </span>
      </td>
      <td className="p-4 text-sm text-gray-700">
        <div className="flex gap-2">
          <button
            title="Edit Buku"
            className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
          >
            ✏️ Edit
          </button>
          <button
            title="Hapus Buku"
            className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition"
          >
            🗑️ Hapus
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookRow;