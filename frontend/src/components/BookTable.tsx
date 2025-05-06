import { useEffect, useState } from "react"

interface Buku {
    buku: {
        idBuku: number
        namaBuku: string
        isbn: string
        issn: string
        tahunPembuatan: number
        harga: number
        keterangan: boolean
        idKategori: number
        idPenerbit: number
        idPembuat: number
    }
    kategori: { namaKategori: string } | null
    penerbit: { namaPenerbit: string } | null
    pembuat: { namaPembuat: string } | null
}
interface Kategori {
    idKategori: number;
    namaKategori: string;
    namaBuku: string;
    idPenerbit: number;
    idPembuat: number;
    isbn: string;
    issn: string;
    harga: number;
    keterangan: boolean;
    tahunPembuatan: number;
}

interface Penerbit {
    idPenerbit: number;
    namaPenerbit: string;
}

interface Pembuat {
    idPembuat: number;
    namaPembuat: string;
}

const BookTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        namaBuku: '',
        idKategori: '',
        idPenerbit: '',
        idPembuat: '',
        isbn: '',
        issn: '',
        tahunPembuatan: '',
        harga: '',
        keterangan: 'true',
    })
    const [kategoriList, setKategoriList] = useState<Kategori[]>([])
    const [penerbitList, setPenerbitList] = useState<Penerbit[]>([])
    const [pembuatList, setPembuatList] = useState<Pembuat[]>([])
    const [editBookData, setEditBookData] = useState<Buku | null>(null);
    const [data, setData] = useState<Buku[]>([])
    const [loading, setLoading] = useState(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            idKategori: parseInt(formData.idKategori),
            idPenerbit: parseInt(formData.idPenerbit),
            idPembuat: parseInt(formData.idPembuat),
            tahunPembuatan: formData.tahunPembuatan.toString(),
            harga: parseFloat(formData.harga),
            keterangan: formData.keterangan === "true"
        };

        try {
            const res = await fetch(`http://localhost:3000/buku/update-buku/${editBookData?.buku.idBuku}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData),
            });


            const data = await res.json();

            if (res.ok) {
                alert('Buku berhasil diupdate');
                setIsModalOpen(false);
                setFormData({
                    namaBuku: '',
                    idKategori: '',
                    idPenerbit: '',
                    idPembuat: '',
                    isbn: '',
                    issn: '',
                    tahunPembuatan: '',
                    harga: '',
                    keterangan: 'true',
                });
                window.location.reload();
            } else {
                alert(`Gagal menambahkan buku: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat mengirim data');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;

        try {
            const res = await fetch(`http://localhost:3000/buku/hapus-buku/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                alert('Buku berhasil dihapus');
                setData(prev => prev.filter(item => item.buku.idBuku !== id)); // update state
            } else {
                alert(`Gagal menghapus buku: ${data.message}`);
            }
        } catch (err) {
            console.error('Error saat menghapus buku:', err);
            alert('Terjadi kesalahan saat menghapus buku');
        }
    };
    
    useEffect(() => {
        if (isModalOpen) {
            const fetchData = async () => {
                try {
                    const [kategoriRes, penerbitRes, pembuatRes] = await Promise.all([
                        fetch('http://localhost:3000/kategori/get'),
                        fetch('http://localhost:3000/penerbit/get'),
                        fetch('http://localhost:3000/pembuat/get'),
                    ]);

                    const [kategoriData, penerbitData, pembuatData] = await Promise.all([
                        kategoriRes.json(),
                        penerbitRes.json(),
                        pembuatRes.json(),
                    ]);

                    setKategoriList(kategoriData);
                    setPenerbitList(penerbitData);
                    setPembuatList(pembuatData);
                } catch (error) {
                    console.error('Error fetching dropdown data:', error);
                }
            };

            fetchData();
        }
    }, [isModalOpen]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/buku/get")
                const json = await res.json()
                setData(json)
            } catch (e) {
                console.error("Gagal fetch data buku:", e)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <p className="p-5">Memuat data buku...</p>

    return (
        <div className="overflow-auto rounded-lg shadow bg-white">
            <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="p-3 text-sm">Id</th>
                        <th className="p-3 text-sm">Nama Buku</th>
                        <th className="p-3 text-sm">Kategori</th>
                        <th className="p-3 text-sm">Penerbit</th>
                        <th className="p-3 text-sm">ISBN</th>
                        <th className="p-3 text-sm">ISSN</th>
                        <th className="p-3 text-sm">Pembuat</th>
                        <th className="p-3 text-sm">Tahun</th>
                        <th className="p-3 text-sm">Harga</th>
                        <th className="p-3 text-sm">Keterangan</th>
                        <th className="p-3 text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row, i) => (
                        <tr key={row.buku.idBuku} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="p-3 text-sm">{row.buku.idBuku}</td>
                            <td className="p-3 text-sm">{row.buku.namaBuku}</td>
                            <td className="p-3 text-sm">{row.kategori?.namaKategori ?? "-"}</td>
                            <td className="p-3 text-sm">{row.penerbit?.namaPenerbit ?? "-"}</td>
                            <td className="p-3 text-sm">{row.buku.isbn}</td>
                            <td className="p-3 text-sm">{row.buku.issn}</td>
                            <td className="p-3 text-sm">{row.pembuat?.namaPembuat ?? "-"}</td>
                            <td className="p-3 text-sm">{row.buku.tahunPembuatan}</td>
                            <td className="p-3 text-sm">{row.buku.harga}</td>
                            <td className="p-3 text-sm">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${row.buku.keterangan
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                        }`}
                                >
                                    {row.buku.keterangan ? 'Tersedia' : 'Kosong'}
                                </span>
                            </td>

                            <td className="p-3 text-sm flex gap-2">
                                <button
                                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                    onClick={() => {
                                        setEditBookData(row);
                                        setFormData({
                                            namaBuku: row.buku.namaBuku,
                                            idKategori: row.buku.idKategori?.toString() || '',
                                            idPenerbit: row.buku.idPenerbit?.toString() || '',
                                            idPembuat: row.buku.idPembuat?.toString() || '',
                                            isbn: row.buku.isbn,
                                            issn: row.buku.issn,
                                            tahunPembuatan: row.buku.tahunPembuatan.toString(),
                                            harga: row.buku.harga.toString(),
                                            keterangan: row.buku.keterangan ? 'true' : 'false',
                                        });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600"
                                    onClick={() => handleDelete(row.buku.idBuku)}
                                >
                                    Hapus
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mb-4">
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                            <h2 className="text-lg font-semibold mb-4">Edit Buku</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="namaBuku"
                                    placeholder="Nama Buku"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handleChange}
                                    value={formData.namaBuku}
                                />

                                <select name="idKategori" className="w-full border rounded px-3 py-2" onChange={handleChange} value={formData.idKategori}>
                                    <option value="">Pilih Kategori</option>
                                    {kategoriList.map((kategori) => (
                                        <option key={kategori.idKategori} value={kategori.idKategori}>
                                            {kategori.namaKategori}
                                        </option>
                                    ))}
                                </select>

                                <select name="idPenerbit" className="w-full border rounded px-3 py-2" onChange={handleChange} value={formData.idPenerbit}>
                                    <option value="">Pilih Penerbit</option>
                                    {penerbitList.map((penerbit) => (
                                        <option key={penerbit.idPenerbit} value={penerbit.idPenerbit}>
                                            {penerbit.namaPenerbit}
                                        </option>
                                    ))}
                                </select>

                                <select name="idPembuat" className="w-full border rounded px-3 py-2" onChange={handleChange} value={formData.idPembuat}>
                                    <option value="">Pilih Pembuat</option>
                                    {pembuatList.map((pembuat) => (
                                        <option key={pembuat.idPembuat} value={pembuat.idPembuat}>
                                            {pembuat.namaPembuat}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    name="isbn"
                                    placeholder="ISBN"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handleChange}
                                    value={formData.isbn}
                                />
                                <input
                                    type="text"
                                    name="issn"
                                    placeholder="ISSN"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handleChange}
                                    value={formData.issn}
                                />
                                <input
                                    type="number"
                                    name="tahunPembuatan"
                                    placeholder="Tahun Pembuatan"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handleChange}
                                    value={formData.tahunPembuatan}
                                />
                                <input
                                    type="number"
                                    name="harga"
                                    placeholder="Harga"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handleChange}
                                    value={formData.harga}
                                />

                                <select name="keterangan" className="w-full border rounded px-3 py-2" onChange={handleChange} value={formData.keterangan}>
                                    <option value="true">Tersedia</option>
                                    <option value="false">Kosong</option>
                                </select>

                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                        Batal
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                        Simpan
                                    </button>
                                </div>
                            </form>

                            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookTable
