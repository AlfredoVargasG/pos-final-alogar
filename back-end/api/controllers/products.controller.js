const { supabase } = require('../services/supabaseClient');

class ProductsController {
    async getProducts(req, res) {
        try {
            const { page, pageSize, orderBy, orderDirection } = req.query;

            // Obtiene las categorías y sus productos asociados
            let { data: categories } = await supabase
                .from('categories')
                .select('id, category, products(id, product, price, image, url)');

            // Actualiza las categorías que no tienen productos asociados
            const fetchProductsForEmptyCategories = async (category) => {
                if (category.products.length === 0) {
                    const { data } = await supabase
                        .from('products')
                        .select('id, product, price, image, url')
                        .contains('categories_id', [category.id]);
                    category.products = data || [];
                }
                return category;
            };

            categories = await Promise.all(categories.map(fetchProductsForEmptyCategories));

            // Ordena los productos si se especifican `orderBy` y `orderDirection`
            if (orderBy && orderDirection) {
                const sortProducts = (a, b) => 
                    orderDirection === 'asc'
                        ? typeof(a[orderBy]) === 'string' ? a[orderBy].localeCompare(b[orderBy]) : a[orderBy] - b[orderBy]
                        : b[orderBy] - a[orderBy];

                categories = categories.map(category => ({
                    ...category,
                    products: [...category.products].sort(sortProducts),
                    totalProducts: category.products.length
                }));
            }

            // Pagina los productos si se especifican `page` y `pageSize`
            if (page && pageSize) {
                const start = (page - 1) * pageSize;
                const end = start + Number(pageSize);

                categories = categories.map(category => ({
                    ...category,
                    products: category.products.slice(start, end),
                }));
            }

            return res.status(200).json({ products: categories, totalProducts: categories.totalProducts });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
    }

    async addProduct(req, res) {
        try {
            const { product, price, image, url, categories_id, principal_category_id } = req.body;

            let { data } = await supabase.from('products').insert({
                product,
                price,
                image,
                url,
                categories_id,
                principal_category_id,
            });

            return res.status(201).send(data);
        } catch (error) {
            console.error('Error al agregar un producto:', error);
            return res.status(500).json({ message: 'Error al agregar un producto' });
        }
    }
}

module.exports = { ProductsController };