import { useEffect, useState } from 'react'
import Search from './search'

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
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Daftar Buku</h1>
            <div className="flex gap-2 items-center">
                <Search />
                <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>Tambah Buku</span>
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h2 className="text-lg font-semibold mb-4">Tambah Buku</h2>

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
    )
}

export default Header