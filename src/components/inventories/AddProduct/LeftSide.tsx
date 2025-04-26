import React, { useState, useRef } from 'react';
import styles from './LeftSide.module.css';
import { Download, Upload, Image } from 'lucide-react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid'; // ✅ UUID import

interface LeftSideProps {
    setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function LeftSide({ setProducts }: LeftSideProps) {
    const [showDropdown, setShowDropdown] = useState(false);
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

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const handleImportClick = () => fileInputRef.current?.click();
    const triggerImageUpload = () => imageInputRef.current?.click();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            id: uuidv4(), // ✅ Unique ID
            ...formData,
            image: formData.images[0] || '',
            images: formData.images,
        };

        setProducts((prev) => [...prev, newProduct]);

        setFormData({
            name: '',
            category: '',
            buyingPrice: '',
            sellingPrice: '',
            quantity: '',
            images: [],
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const imageMap: { [filename: string]: string } = {};
        let loaded = 0;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    imageMap[file.name] = reader.result as string;
                    loaded++;
                    if (loaded === files.length) {
                        setLocalImages(prev => ({ ...prev, ...imageMap }));
                        console.log('📸 Local images loaded:', imageMap);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

            const enrichedProducts = jsonData.map((item) => {
                let image = '';

                if (item.Image?.startsWith('http')) {
                    image = item.Image;
                } else if (localImages[item.Image]) {
                    image = localImages[item.Image];
                } else if (item.Image) {
                    image = '/' + item.Image;
                }

                return {
                    id: uuidv4(), // ✅ Unique ID
                    name: item['Product Name'] || '',
                    category: item['Category'] || '',
                    buyingPrice: item['Buying Price'] || '',
                    sellingPrice: item['Selling Price'] || '',
                    quantity: item['Quantity'] || '',
                    image: image,
                };
            });

            setProducts(enrichedProducts);
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
                'Image': 'https://i0.wp.com/computer.co.tz/wp-content/uploads/2020/08/spectre.jpg?fit=900%2C900&ssl=1'
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

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleExcelUpload}
                />

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                />
            </div>

            <div className={styles.main}>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <h3>Add New Product</h3>

                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g. HP Laptop 15s"
                        required
                    />

                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        placeholder="e.g. Laptops"
                        required
                    />

                    <label>Buying Price</label>
                    <input
                        type="number"
                        name="buyingPrice"
                        value={formData.buyingPrice}
                        onChange={handleFormChange}
                        placeholder="e.g. 850000"
                        required
                    />

                    <label>Selling Price</label>
                    <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleFormChange}
                        placeholder="e.g. 950000"
                        required
                    />

                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        placeholder="e.g. 10"
                        required
                    />

                    <label>Product Images</label>
                    <button type="button" onClick={triggerImageUpload} className={styles.uploadButton}>
                        <Image size={18} />
                        Choose Images
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={imageInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;

                            const imagesArray: string[] = [];

                            Array.from(files).forEach((file) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    if (reader.result) {
                                        imagesArray.push(reader.result as string);
                                        if (imagesArray.length === files.length) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                images: [...prev.images, ...imagesArray],
                                            }));
                                        }
                                    }
                                };
                                reader.readAsDataURL(file);
                            });
                        }}
                    />

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
