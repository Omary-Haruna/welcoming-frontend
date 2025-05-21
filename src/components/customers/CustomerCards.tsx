import React from 'react';
import GeneralStatsCard from './GeneralStatsCard';
import PurchaseBehaviorWrapper from './PurchaseBehaviorWrapper';
import TimeBasedStatsCard from './TimeBasedStatsCard';
import DemographicStatsCard from './DemographicStatsCard';
import TopPerformersCard from './TopPerformersCard';
import ProductStatsCard from './ProductStatsCard';
import EngagementCard from './EngagementCard';
import FinancialStatsCard from './FinancialStatsCard';
import AddCustomer from './AddCustomer';

interface CustomerCardsProps {
    visibleCards: string[];
    customers: any[];
    onAddCustomer?: () => void;
}

export default function CustomerCards({ visibleCards = [], customers = [], onAddCustomer }: CustomerCardsProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* ✅ Conditionally show AddCustomer form */}
            {visibleCards.includes('AddCustomerCard') && <AddCustomer onAdd={onAddCustomer} />}

            {/* ✅ Cards Grid */}
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {visibleCards.includes('GeneralStatsCard') && <GeneralStatsCard customers={customers} />}
                {visibleCards.includes('PurchaseBehaviorCard') && <PurchaseBehaviorWrapper />}
                {visibleCards.includes('TimeBasedStatsCard') && <TimeBasedStatsCard customers={customers} />}
                {visibleCards.includes('DemographicStatsCard') && <DemographicStatsCard customers={customers} />}
                {visibleCards.includes('TopPerformersCard') && <TopPerformersCard customers={customers} />}
                {visibleCards.includes('ProductStatsCard') && <ProductStatsCard customers={customers} />}
                {visibleCards.includes('EngagementCard') && <EngagementCard customers={customers} />}
                {visibleCards.includes('FinancialStatsCard') && <FinancialStatsCard customers={customers} />}
            </div>
        </div>
    );
}
