// regionOptions.ts  ✅ 31 regions (mainland + Zanzibar)
export const regionOptions = [
    // Mainland
    'Arusha',
    'Dar es Salaam',
    'Dodoma',
    'Geita',
    'Iringa',
    'Kagera',
    'Katavi',
    'Kigoma',
    'Kilimanjaro',
    'Lindi',
    'Manyara',
    'Mara',
    'Mbeya',
    'Morogoro',
    'Mtwara',
    'Mwanza',
    'Njombe',
    'Pwani',          // Coast Region
    'Rukwa',
    'Ruvuma',
    'Shinyanga',
    'Simiyu',
    'Singida',
    'Songwe',
    'Tabora',
    'Tanga',

    // Zanzibar (Unguja + Pemba)
    'Zanzibar Urban/West',  // Mjini Magharibi
    'Zanzibar North',       // Kaskazini Unguja
    'Zanzibar South',       // Kusini Unguja
    'Pemba North',          // Kaskazini Pemba
    'Pemba South'           // Kusini Pemba
].map(region => ({ value: region, label: region }));
