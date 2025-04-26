import React from 'react';
import styles from '@/styles/StaffAccomplihment.module.css';
import Header from '@/components/peoples/accomplishment/Header';
import Cards from '@/components/peoples/accomplishment/Cards';
import SearchAndFilter from '@/components/peoples/accomplishment/SearchAndFilter';
import ListOfWorkDone from '@/components/peoples/accomplishment/ListOfWorkDone';
import ManualTask from '@/components/peoples/accomplishment/ManualTask';
import Motivation from '@/components/peoples/accomplishment/Motivation';

const StaffAccomplishment = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Cards />
      <SearchAndFilter />
      <ListOfWorkDone />
      <div className={styles.bottom}>
        <div style={{ gridArea: 'manual' }}>
          <ManualTask />
        </div>
        <div style={{ gridArea: 'motivation' }}>
          <Motivation />
        </div>
      </div>
    </div>
  );
};


export default StaffAccomplishment;
