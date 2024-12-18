const { supabase } = require('../services/supabaseClient')

class CategoriesController {
    async getCategories(req, res) {
        try {
            const { data: categories, error } = await supabase.from('categories').select('*');

            if (error) {
                console.error('Error al obtener las categorías:', error);
                return res.status(500).json({ message: 'Error al obtener las categorías' });
            }

            return res.status(200).json(categories);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            return res.status(500).json({ message: 'Error al obtener las categorías' });
        }
    }
}

module.exports = { CategoriesController };