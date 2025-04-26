import { v4 as uuidv4 } from 'uuid';

const sampleNames = [
    { name: 'John Doe', gender: 'male' },
    { name: 'Jane Smith', gender: 'female' },
    { name: 'Ali Hassan', gender: 'male' },
    { name: 'Mary Johnson', gender: 'female' },
    { name: 'Daniel Kim', gender: 'male' },
    { name: 'Sarah Williams', gender: 'female' },
    { name: 'Mohammed Said', gender: 'male' },
    { name: 'Lucy Brown', gender: 'female' },
    { name: 'Elijah Mushi', gender: 'male' },
    { name: 'Fatma Salim', gender: 'female' },
    { name: 'Isaac Mlay', gender: 'male' },
    { name: 'Grace Banda', gender: 'female' },
    { name: 'Kelvin Chacha', gender: 'male' },
    { name: 'Halima Ahmed', gender: 'female' },
    { name: 'George Mwakalinga', gender: 'male' },
    { name: 'Esther Nyambura', gender: 'female' },
    { name: 'Abdul Majid', gender: 'male' },
    { name: 'Lilian Peter', gender: 'female' },
    { name: 'Amos Mtey', gender: 'male' },
    { name: 'Neema Mbise', gender: 'female' },
    { name: 'Yohana Gasper', gender: 'male' },
    { name: 'Sophia Mwakyusa', gender: 'female' },
    { name: 'Juma Matata', gender: 'male' },
    { name: 'Leah Komba', gender: 'female' },
    { name: 'Chris Mwenda', gender: 'male' },
    { name: 'Salma Omary', gender: 'female' },
    { name: 'Tundu Mwasu', gender: 'male' },
    { name: 'Agnes Mwakyembe', gender: 'female' },
    { name: 'Baraka Mrema', gender: 'male' },
    { name: 'Zahara Nassor', gender: 'female' },
];

const products = [
    'Dell XPS 13', 'HP 820 G2', 'HP ProBook 450 G7', 'Wireless Keyboard', 'Wireless Mouse',
    'Logitech MX Master 3S', 'Lenovo ThinkPad X1 Carbon', 'iPhone 14 Pro', 'Samsung Galaxy Tab S8',
    'ASUS ROG Zephyrus G14', 'Acer Aspire 5', 'MacBook Pro M2', 'External SSD 1TB', 'Bluetooth Headset',
    'Webcam 1080p', 'HP All-in-One PC', 'Canon Printer LBP2900', 'JBL Bluetooth Speaker',
    'Infinix Note 12', 'Techno Camon 20', 'MSI Modern 15', 'Logitech C920 Webcam',
    'TP-Link Wi-Fi Extender', 'Samsung Curved Monitor', 'iPad Mini 6',
];

const regions = [
    'Dar es Salaam', 'Dar es Salaam', 'Dar es Salaam', 'Dar es Salaam', 'Dar es Salaam',
    'Arusha', 'Mbeya', 'Mwanza', 'Dodoma', 'Tanga', 'Morogoro', 'Mtwara',
    'Kigoma', 'Singida', 'Shinyanga', 'Tabora', 'Songea', 'Iringa', 'Zanzibar',
];

const processes = ['Pending', 'Completed', 'Cancelled', 'In Progress'];
const paymentMethods = ['Cash', 'Bank', 'Mobile'];

const priceRange = {
    min: 150000,
    max: 4000000,
};

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(): number {
    return Math.floor(Math.random() * (priceRange.max - priceRange.min + 1) + priceRange.min);
}

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateCustomers(count = 234) {
    const customers = [];

    for (let i = 0; i < count; i++) {
        const person = getRandomItem(sampleNames);
        const quantity = getRandomInt(1, 10); // 🛒 Number of purchases
        const frequency = getRandomInt(1, 15); // 🔁 Repeat visit frequency

        const customer = {
            id: uuidv4(),
            name: person.name,
            gender: person.gender,
            productBought: getRandomItem(products),
            region: getRandomItem(regions),
            joinedDate: randomDate(new Date(2022, 0, 1), new Date()).toISOString().split('T')[0],
            process: getRandomItem(processes),
            price: getRandomPrice(),
            returning: Math.random() > 0.5,
            paymentMethod: getRandomItem(paymentMethods),
            quantity,
            frequency,
        };

        customers.push(customer);
    }

    return customers;
}
