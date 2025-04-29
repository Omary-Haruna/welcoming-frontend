import React, { useState, useRef } from 'react';
import styles from './LeftSide.module.css';
import { Download, Upload, Image } from 'lucide-react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

interface LeftSideProps {
    fetchProducts: () => void;
}

export default function LeftSide({ fetchProducts }: LeftSideProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [localImages, setLocalImages] = useState<{ [filename: string]: string }>({});

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        buyingPrice: '',
        sellingPrice: '',
        quantity: '',
        images: [] as string[],
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const triggerImageUpload = () => imageInputRef.current?.click();
    const handleImportClick = () => fileInputRef.current?.click();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            id: uuidv4(),
            ...formData,
            image: formData.images[0] || '',
            images: formData.images,
        };

        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });

            const data = await res.json();
            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Product Added',
                    text: `${formData.name} was successfully added!`,
                });
                fetchProducts(); // ✅ Refresh product list in RightSide
                setFormData({
                    name: '',
                    category: '',
                    buyingPrice: '',
                    sellingPrice: '',
                    quantity: '',
                    images: [],
                });
            } else {
                Swal.fire('Error', 'Failed to save product.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Server error.', 'error');
        }
    };

    const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

            const enrichedProducts = jsonData.map((item) => {
                let image = '';
                if (item.Image?.startsWith('http')) image = item.Image;
                else if (localImages[item.Image]) image = localImages[item.Image];
                else if (item.Image) image = '/' + item.Image;

                return {
                    id: uuidv4(),
                    name: item['Product Name'] || '',
                    category: item['Category'] || '',
                    buyingPrice: item['Buying Price'] || '',
                    sellingPrice: item['Selling Price'] || '',
                    quantity: item['Quantity'] || '',
                    image,
                    images: [image],
                };
            });

            // Save each product to DB
            for (const product of enrichedProducts) {
                await fetch('https://welcoming-backend.onrender.com/api/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product),
                });
            }

            Swal.fire('Imported!', 'Excel products imported successfully!', 'success');
            fetchProducts(); // ✅ Refresh product list
        };

        reader.readAsArrayBuffer(file);
    };

    const downloadTemplate = () => {
        const worksheetData = [
            {
                'Product Name': 'HP Laptop 15s',
                'Category': 'Laptops',
                'Buying Price': 850000,
                'Selling Price': 950000,
                'Quantity': 10,
                'Image': 'https://example.com/image.jpg'
            },
        ];
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        XLSX.writeFile(workbook, 'Product_Template.xlsx');
    };

    return (
        <div className={styles.container}>
            <div className={styles.topHeader}>
                <h2>Welcome, Admin 👋</h2>
            </div>

            <div className={styles.secondHeader}>
                <div className={styles.buttonRow}>
                    <button className={styles.button} onClick={downloadTemplate} type="button">
                        <Download size={18} /> Download Template
                    </button>
                    <button className={styles.button} onClick={handleImportClick} type="button">
                        <Upload size={18} /> Import Excel
                    </button>
                </div>

                <input type="file" accept=".xlsx, .xls" ref={fileInputRef} style={{ display: 'none' }} onChange={handleExcelUpload} />
                <input type="file" accept="image/*" multiple ref={imageInputRef} style={{ display: 'none' }} onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;

                    const imagesArray: string[] = [];
                    Array.from(files).forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (reader.result) {
                                imagesArray.push(reader.result as string);
                                if (imagesArray.length === files.length) {
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...prev.images, ...imagesArray],
                                    }));
                                }
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }} />
            </div>

            <div className={styles.main}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <h3>Add New Product</h3>

                    <label>Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />

                    <label>Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />

                    <label>Buying Price</label>
                    <input type="number" name="buyingPrice" value={formData.buyingPrice} onChange={handleFormChange} required />

                    <label>Selling Price</label>
                    <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleFormChange} required />

                    <label>Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} required />

                    <label>Product Images</label>
                    <button type="button" onClick={triggerImageUpload} className={styles.uploadButton}>
                        <Image size={18} /> Choose Images
                    </button>

                    {formData.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {formData.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`preview-${idx}`}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 6,
                                        objectFit: 'cover',
                                        border: '1px solid #ccc',
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
}
