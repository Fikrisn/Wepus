import { useEffect, useState } from 'react'
import Search from './Search'

interface Kategori {
    idKategori: number;
    namaKategori: string;
}

interface Penerbit {
    idPenerbit: number;
    namaPenerbit: string;
}

interface Pembuat {
    idPembuat: number;
    namaPembuat: string;
}

const Header = () => {
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
            const res = await fetch('http://localhost:3000/buku/tambah-buku', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Buku berhasil ditambahkan');
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

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">📚 Daftar Buku</h1>
            <div className="flex gap-2 items-center">
                <Search />
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Buku
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Tambah Buku</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input type="text" name="namaBuku" placeholder="Nama Buku" className="input" onChange={handleChange} value={formData.namaBuku} />

                            <select name="idKategori" className="input" onChange={handleChange} value={formData.idKategori}>
                                <option value="">Pilih Kategori</option>
                                {kategoriList.map(k => (
                                    <option key={k.idKategori} value={k.idKategori}>{k.namaKategori}</option>
                                ))}
                            </select>

                            <select name="idPenerbit" className="input" onChange={handleChange} value={formData.idPenerbit}>
                                <option value="">Pilih Penerbit</option>
                                {penerbitList.map(p => (
                                    <option key={p.idPenerbit} value={p.idPenerbit}>{p.namaPenerbit}</option>
                                ))}
                            </select>

                            <select name="idPembuat" className="input" onChange={handleChange} value={formData.idPembuat}>
                                <option value="">Pilih Pembuat</option>
                                {pembuatList.map(p => (
                                    <option key={p.idPembuat} value={p.idPembuat}>{p.namaPembuat}</option>
                                ))}
                            </select>

                            <input type="text" name="isbn" placeholder="ISBN" className="input" onChange={handleChange} value={formData.isbn} />
                            <input type="text" name="issn" placeholder="ISSN" className="input" onChange={handleChange} value={formData.issn} />
                            <input type="number" name="tahunPembuatan" placeholder="Tahun Pembuatan" className="input" onChange={handleChange} value={formData.tahunPembuatan} />
                            <input type="number" name="harga" placeholder="Harga" className="input" onChange={handleChange} value={formData.harga} />

                            <select name="keterangan" className="input" onChange={handleChange} value={formData.keterangan}>
                                <option value="true">Tersedia</option>
                                <option value="false">Kosong</option>
                            </select>

                            <div className="flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                    Batal
                                </button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header