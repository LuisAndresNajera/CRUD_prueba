import { useEffect, useState } from 'react';
import {
    obtenerProductos,
    crearProducto,
    eliminarProducto,
    actualizarProducto
} from '../services/productoService';

function ProductosPage() {

    const [productos, setProductos] = useState([]);

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: ''
    });

    const [productoEditando, setProductoEditando] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const data = await obtenerProductos();
            setProductos(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const handleChange = (e) => {
        setNuevoProducto({
            ...nuevoProducto,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (productoEditando) {

                await actualizarProducto(
                    productoEditando.id,
                    nuevoProducto
                );

            } else {

                await crearProducto(nuevoProducto);

            }

            await cargarProductos();

            setNuevoProducto({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: ''
            });

            setProductoEditando(null);

        } catch (error) {
            console.error(error);
        }
    };

    const handleEditar = (producto) => {
        setNuevoProducto({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock
        });

        setProductoEditando(producto);
    };

    const handleEliminar = async (id) => {
        try {
            await eliminarProducto(id);
            await cargarProductos();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Productos</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={nuevoProducto.descripcion}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    value={nuevoProducto.precio}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={nuevoProducto.stock}
                    onChange={handleChange}
                />

                <button type="submit">
                    {
                        productoEditando
                            ? 'Actualizar Producto'
                            : 'Crear Producto'
                    }
                </button>

                {
                    productoEditando && (
                        <button
                            type="button"
                            onClick={() => {
                                setProductoEditando(null);

                                setNuevoProducto({
                                    nombre: '',
                                    descripcion: '',
                                    precio: '',
                                    stock: ''
                                });
                            }}
                        >
                            Cancelar
                        </button>
                    )
                }

            </form>

            <br />

            <table border="1">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {
                        productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.stock}</td>

                                <td>

                                    <button
                                        onClick={() => handleEditar(producto)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleEliminar(producto.id)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>

            </table>

        </div>
    );
}

export default ProductosPage;