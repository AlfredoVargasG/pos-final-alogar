const { supabase } = require('../services/supabaseClient')

class ProductsController {
    async getProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; // Página actual
            const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
            const orderBy = req.query.orderBy || 'product'; // Columna por la que ordenar (por defecto 'product')
            const orderDirection = req.query.orderDirection || 'asc'; // Dirección del orden (por defecto 'asc')

            const skip = (page - 1) * pageSize; // Calcular el valor de OFFSET
            const limit = pageSize; // Límite de productos por página

            // Realizamos la consulta con orden y paginación
            const { data: products, error, count } = await supabase
                .from('products')
                .select('*', { count: 'exact' }) // Obtener el número exacto de productos
                .order(orderBy, { ascending: orderDirection === 'asc' }) // Ordenar por la columna y dirección especificadas
                .range(skip, skip + limit - 1); // Obtener el rango de productos para la página

            if (error) {
                console.error('Error al obtener los productos:', error);
                return res.status(500).json({ message: 'Error al obtener los productos' });
            }

            return res.status(200).json({
                data: products,
                totalCount: count, // Devuelve el total de productos
                page,
                pageSize,
            });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
    }

    async getProductsByCategory(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; // Página actual
            const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
            const orderBy = req.query.orderBy || 'product'; // Columna por la que ordenar (por defecto 'product')
            const orderDirection = req.query.orderDirection || 'asc'; // Dirección del orden (por defecto 'asc')
            const { category } = req.params; // Categoría de los productos

            const skip = (page - 1) * pageSize; // Calcular el valor de OFFSET
            const limit = pageSize; // Límite de productos por página

            // Realizamos la consulta con orden y paginación
            const { data: products, error, count } = await supabase
                .from('products')
                .select('*', { count: 'exact' }) // Obtener el número exacto de productos
                .contains('categories', [category]) // Filtrar por la categoría especificada
                .order(orderBy, { ascending: orderDirection === 'asc' }) // Ordenar por la columna y dirección especificadas
                .range(skip, skip + limit - 1); // Obtener el rango de productos para la página

            if (error) {
                console.error('Error al obtener los productos:', error);
                return res.status(500).json({ message: 'Error al obtener los productos' });
            }

            return res.status(200).json({
                data: products,
                totalCount: count, // Devuelve el total de productos
                page,
                pageSize,
            });
        } catch (error) {
            console.error('Error al obtener los productos por categoría:', error);
            return res.status(500).json({ message: 'Error al obtener los productos por categoría' });
        }
    }

    async getProductByName(req, res) {
        try {
            const { product } = req.params;

            const { data: products, error } = await supabase.from('products').select('*').like('product', `%${product}%`);

            if (error) {
                console.error('Error al obtener los productos por nombre:', error);
                return res.status(500).json({ message: 'Error al obtener los productos por nombre' });
            }

            return res.status(200).json(products);
        } catch (error) {
            console.error('Error al obtener los productos por nombre:', error);
            return res.status(500).json({ message: 'Error al obtener los productos por nombre' });
        }
    }

    async addProduct(req, res) {
        try {
            const { body } = req;

            const { data, error } = await supabase.from('products').insert(body).select('*').eq('product', body.product);

            if (error) {
                console.error('Error al agregar un producto:', error);
                return res.status(500).json({ message: 'Error al agregar un producto' });
            }

            return res.status(201).json(data);
        } catch (error) {
            console.error('Error al agregar un producto:', error);
            return res.status(500).json({ message: 'Error al agregar un producto' });
        }
    }
}

module.exports = { ProductsController };