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
                await actualizarProducto(productoEditando.id, nuevoProducto);
                setProductoEditando(null);
            } else {
                await crearProducto(nuevoProducto);
            }
            await cargarProductos();
            setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '' });
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

    const handleCancelar = () => {
        setProductoEditando(null);
        setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '' });
    };

    const handleEliminar = async (id) => {
        const confirmar = window.confirm('¿Seguro que deseas eliminar este producto?');
        if (!confirmar) return;
        try {
            await eliminarProducto(id);
            await cargarProductos();
        } catch (error) {
            console.error(error);
        }
    };

    const valorTotal = productos.reduce((a, p) => a + Number(p.precio) * Number(p.stock), 0);
    const unidadesTotales = productos.reduce((a, p) => a + Number(p.stock), 0);
    const precioPromedio = productos.length
        ? productos.reduce((a, p) => a + Number(p.precio), 0) / productos.length
        : 0;

    const stockClass = (stock) => {
        const s = Number(stock);
        if (s === 0) return 'stock-zero';
        if (s <= 5) return 'stock-low';
        return 'stock-ok';
    };

    return (
        <div className="container">

            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Gestión de Productos</h1>
                <p className="page-subtitle">Administra el inventario de tu tienda</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Productos</span>
                    <span className="stat-value">{productos.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Valor del inventario</span>
                    <span className="stat-value">
                        ${valorTotal.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                    </span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Unidades en stock</span>
                    <span className="stat-value">{unidadesTotales}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Precio promedio</span>
                    <span className="stat-value">
                        ${Math.round(precioPromedio).toLocaleString('es-MX')}
                    </span>
                </div>
            </div>

            {/* Formulario */}
            <div className="form-card">
                <p className="form-card-title">
                    {productoEditando ? '✏️ Editar producto' : '+ Nuevo producto'}
                </p>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="ej. Laptop Lenovo"
                            value={nuevoProducto.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            placeholder="ej. Ryzen 7 16GB RAM"
                            value={nuevoProducto.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio ($)</label>
                        <input
                            type="number"
                            name="precio"
                            placeholder="0.00"
                            value={nuevoProducto.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            placeholder="0"
                            value={nuevoProducto.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-guardar">
                            {productoEditando ? 'Actualizar' : 'Guardar'}
                        </button>
                        {productoEditando && (
                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={handleCancelar}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>

                </form>
            </div>

            {/* Tabla */}
            <div className="table-card">
                <div className="table-card-header">
                    <span className="table-card-title">Productos</span>
                    <span className="table-badge">{productos.length}</span>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="td-empty">
                                        Sin productos. Agrega uno arriba.
                                    </td>
                                </tr>
                            ) : (
                                productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td className="td-id">{producto.id}</td>
                                        <td className="td-nombre">{producto.nombre}</td>
                                        <td className="td-desc">{producto.descripcion}</td>
                                        <td className="td-precio">
                                            ${Number(producto.precio).toLocaleString('es-MX', {
                                                minimumFractionDigits: 2
                                            })}
                                        </td>
                                        <td>
                                            <span className={`stock-pill ${stockClass(producto.stock)}`}>
                                                {producto.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="acciones">
                                                <button
                                                    className="btn-editar"
                                                    onClick={() => handleEditar(producto)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-eliminar"
                                                    onClick={() => handleEliminar(producto.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default ProductosPage;
