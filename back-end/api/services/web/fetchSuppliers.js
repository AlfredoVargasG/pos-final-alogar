const path = require('path');
const { supabase } = require('../supabaseClient');
const { getExcelData } = require('./fetchProducts');
const excelPathSuppliers = path.join(__dirname, '../excel', 'suppliers.xlsx');

async function getSuppliers() {
    try {
        const suppliers = await getExcelData(excelPathSuppliers);
        
        const { data: suppliersInBD } = await supabase.from('suppliers').select('*');

        const newSuppliers = suppliers.filter(supplier => !suppliersInBD.some(s => s.nombre === supplier.nombre));
        if(newSuppliers.length > 0) {
            const { data, error } = await supabase.from('suppliers').insert(newSuppliers).select('*');
            if (error) throw error;
            console.log('Proveedores insertados:', data);
        }else {
            console.log('No hay nuevos proveedores');
        }
    } catch (error) {
        console.error('Error in getSuppliers:', error);
        return { error: error.message };
    }
}

module.exports = { getSuppliers };