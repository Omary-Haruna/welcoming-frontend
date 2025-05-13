// src/components/inventories/AddProduct/LeftSide.tsx
import React, { useState, useRef } from 'react';
import styles from './LeftSide.module.css';
import { Download, Upload, Image } from 'lucide-react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BeatLoader } from 'react-spinners'; // ✨ NEW

interface LeftSideProps {
    fetchProducts: () => void;
}

const CLOUDINARY_UPLOAD_PRESET = 'unsigned_upload';
const CLOUDINARY_CLOUD_NAME = 'duaahnhgf';

export default function LeftSide({ fetchProducts }: LeftSideProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        buyingPrice: '',
        sellingPrice: '',
        quantity: '',
        images: [] as string[],
    });
    const [loading, setLoading] = useState(false); // ✨ NEW

    const triggerImageUpload = () => imageInputRef.current?.click();
    const handleImportClick = () => fileInputRef.current?.click();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const uploadToCloudinary = async (fileOrUrl: File | string) => {
        if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('http')) {
            return fileOrUrl;
        }

        const formData = new FormData();
        formData.append('file', fileOrUrl as File);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
            return res.data.secure_url;
        } catch (error) {
            console.error('Upload to Cloudinary failed:', error);
            return '';
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            id: uuidv4(),
            name: formData.name,
            category: formData.category,
            buyingPrice: formData.buyingPrice,
            sellingPrice: formData.sellingPrice,
            quantity: formData.quantity,
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
                await Swal.fire('Success', `${formData.name} added successfully!`, 'success');
                fetchProducts();
                setFormData({ name: '', category: '', buyingPrice: '', sellingPrice: '', quantity: '', images: [] });
            } else {
                Swal.fire('Error', 'Failed to save product.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Server error.', 'error');
        }
    };

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true); // ✨ Show loading while uploading Excel

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

            const errorLines: number[] = [];

            for (let i = 0; i < jsonData.length; i++) {
                const item = jsonData[i];
                const buyingPrice = parseFloat(item['Buying Price']);
                const sellingPrice = parseFloat(item['Selling Price']);

                if (buyingPrice > sellingPrice) {
                    errorLines.push(i + 2); // +2 to match Excel line number (1 for header, 1 for zero-index)
                    continue; // Skip adding this product
                }

                let imageUrl = '';

                if (item.Image?.startsWith('http')) {
                    imageUrl = item.Image;
                } else if (item.Image) {
                    const pickedFile = await pickLocalFile();
                    if (pickedFile) {
                        imageUrl = await uploadToCloudinary(pickedFile);
                    }
                }

                const newProduct = {
                    id: uuidv4(),
                    name: item['Product Name'] || '',
                    category: item['Category'] || '',
                    buyingPrice: item['Buying Price'] || '',
                    sellingPrice: item['Selling Price'] || '',
                    quantity: item['Quantity'] || '',
                    image: imageUrl,
                    images: [imageUrl],
                };

                await fetch('https://welcoming-backend.onrender.com/api/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct),
                });
            }

            setLoading(false); // ✨ Hide loading

            if (errorLines.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Import Error',
                    html: `Buying price can't be higher than selling price.<br>Error on line(s): <strong>${errorLines.join(', ')}</strong>`,
                });
            } else {
                Swal.fire('Success', 'Products imported successfully!', 'success');
            }

            fetchProducts();
        };

        reader.readAsArrayBuffer(file);
    };


    const pickLocalFile = async (): Promise<File | null> => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.click();

            input.onchange = () => {
                if (input.files && input.files.length > 0) {
                    resolve(input.files[0]);
                } else {
                    resolve(null);
                }
            };
        });
    };

    const downloadTemplate = () => {
        const worksheetData = [
            {
                'Product Name': 'DELL 3190',
                'Category': 'LAPTOP',
                'Buying Price': 240000,
                'Selling Price': 300000,
                'Quantity': 5,
                'Image': 'https://res.cloudinary.com/duaahnhgf/image/upload/v1745934265/51x4Du4I_FL_kjiqi1.jpg',
            },
        ];
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        XLSX.writeFile(workbook, 'Product_Template.xlsx');
    };

    return (
        <div className={styles.container}>
            <div className={styles.topHeader}><h2>Welcome, Admin 👋</h2></div>

            <div className={styles.secondHeader}>
                <div className={styles.buttonRow}>
                    <button className={styles.button} type="button" onClick={downloadTemplate}>
                        <Download size={18} /> Download Template
                    </button>
                    <button className={styles.button} type="button" onClick={handleImportClick}>
                        <Upload size={18} /> Import Excel
                    </button>
                </div>

                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleExcelUpload} />
                <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;

                    const imagesArray: string[] = [];
                    Array.from(files).forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (reader.result) {
                                imagesArray.push(reader.result as string);
                                if (imagesArray.length === files.length) {
                                    setFormData(prev => ({ ...prev, images: [...prev.images, ...imagesArray] }));
                                }
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }} />
            </div>

            <div className={styles.main}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <BeatLoader size={15} color="#36d7b7" />
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleFormSubmit}>
                        <h3>Add New Product</h3>

                        <label>Product Name</label>
                        <input name="name" value={formData.name} onChange={handleFormChange} required />

                        <label>Category</label>
                        <input name="category" value={formData.category} onChange={handleFormChange} required />

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
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                {formData.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`preview-${idx}`}
                                        style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'cover', border: '1px solid #ccc' }}
                                    />
                                ))}
                            </div>
                        )}

                        <button type="submit">Add Product</button>
                    </form>
                )}
            </div>
        </div>
    );
}
