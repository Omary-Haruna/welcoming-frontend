import React from 'react';
import GeneralStatsCard from './GeneralStatsCard';
import PurchaseBehaviorCard from './PurchaseBehaviorCard';
import TimeBasedStatsCard from './TimeBasedStatsCard';
import DemographicStatsCard from './DemographicStatsCard';
import TopPerformersCard from './TopPerformersCard';
import ProductStatsCard from './ProductStatsCard';
import EngagementCard from './EngagementCard';
import FinancialStatsCard from './FinancialStatsCard';

export default function CustomerCards({ visibleCards = [], customers = [] }) {
    return (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {visibleCards.includes('GeneralStatsCard') && <GeneralStatsCard customers={customers} />}
            {visibleCards.includes('PurchaseBehaviorCard') && <PurchaseBehaviorCard customers={customers} />}
            {visibleCards.includes('TimeBasedStatsCard') && <TimeBasedStatsCard customers={customers} />}
            {visibleCards.includes('DemographicStatsCard') && <DemographicStatsCard customers={customers} />}
            {visibleCards.includes('TopPerformersCard') && <TopPerformersCard customers={customers} />}
            {visibleCards.includes('ProductStatsCard') && <ProductStatsCard customers={customers} />}
            {visibleCards.includes('EngagementCard') && <EngagementCard customers={customers} />}
            {visibleCards.includes('FinancialStatsCard') && <FinancialStatsCard customers={customers} />}
        </div>
    );
}
