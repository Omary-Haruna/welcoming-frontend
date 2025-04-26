import React from 'react';
import styles from './ProductsCategory.module.css';

interface Category {
    name: string;
    image: string;
}

const categories: Category[] = [
    {
        name: 'All',
        image: 'https://cdn-icons-png.flaticon.com/512/512/512142.png',
    },
    {
        name: 'Computers',
        image: 'https://r2.ecomputertips.com/imgs/article/laptop-vs-desktop/cover.webp',
    },
    {
        name: 'Accessories',
        image: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202110/61QeMC9P8rL._SL1000__1200x768.jpeg?size=690:388',
    },
    {
        name: 'Printers',
        image: 'https://media.zenfs.com/en/pc_mag_263/68afe1a26ea514bc21b76bfb0d08129a',
    },
    {
        name: 'Monitors',
        image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/p-series/p2425/pdp/monitor-p2425-pdp-mod-gallery.psd?fmt=jpg&wid=3000&hei=3000',
    },
];

interface Props {
    onCategorySelect: (category: string) => void;
    selectedCategory: string;
}


const ProductsCategory: React.FC<Props> = ({ onCategorySelect, selectedCategory }) => {

    return (
        <div className={styles.container}>

            <div className={styles.grid}>
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        className={`${styles.card} ${selectedCategory === cat.name ? styles.active : ''}`}
                        onClick={() => onCategorySelect(cat.name)}
                    >
                        <img src={cat.image} alt={cat.name} className={styles.icon} />
                        <span>{cat.name}</span>
                    </button>

                ))}
            </div>
        </div>
    );
};

export default ProductsCategory;