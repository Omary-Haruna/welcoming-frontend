import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Summary {
    subtotal: number;
    tax: number;
    total: number;
    items: CartItem[];
    soldAt: string; // DateTime string
}

interface SalesContextType {
    summaries: Summary[];
    setSummaries: React.Dispatch<React.SetStateAction<Summary[]>>;
    addSummary: (summary: Summary) => void;
    deleteItemFromSummary: (summaryIndex: number, itemId: string) => void;
    editItemInSummary: (
        summaryIndex: number,
        itemId: string,
        updatedFields: { price?: number; quantity?: number }
    ) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
    const [summaries, setSummaries] = useState<Summary[]>([]);

    const addSummary = (summary: Summary) => {
        setSummaries((prev) => [...prev, summary]);
    };

    const deleteItemFromSummary = (summaryIndex: number, itemId: string) => {
        setSummaries((prev) =>
            prev.map((summary, idx) => {
                if (idx !== summaryIndex) return summary;

                const updatedItems = summary.items.filter((item) => item.id !== itemId);
                const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);

                return {
                    ...summary,
                    items: updatedItems,
                    subtotal: updatedTotal,
                    total: updatedTotal,
                };
            })
        );
    };

    const editItemInSummary = (
        summaryIndex: number,
        itemId: string,
        updatedFields: { price?: number; quantity?: number }
    ) => {
        setSummaries((prev) =>
            prev.map((summary, idx) => {
                if (idx !== summaryIndex) return summary;

                const updatedItems = summary.items.map((item) => {
                    if (item.id !== itemId) return item;

                    const newPrice = updatedFields.price ?? item.price;
                    const newQuantity = updatedFields.quantity ?? item.quantity;

                    return {
                        ...item,
                        price: newPrice,
                        quantity: newQuantity,
                        total: newPrice * newQuantity,
                    };
                });

                const updatedTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);

                return {
                    ...summary,
                    items: updatedItems,
                    subtotal: updatedTotal,
                    total: updatedTotal,
                };
            })
        );
    };

    return (
        <SalesContext.Provider
            value={{
                summaries,
                setSummaries,
                addSummary,
                deleteItemFromSummary,
                editItemInSummary,
            }}
        >
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SalesContext);
    if (!context) throw new Error('useSales must be used within a SalesProvider');
    return context;
};
