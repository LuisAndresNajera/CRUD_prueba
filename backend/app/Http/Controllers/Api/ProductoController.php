<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Services\ProductoService;

class ProductoController extends Controller
{
    protected ProductoService $productoService;

    public function __construct(ProductoService $productoService)
    {
        $this->productoService = $productoService;
    }

    /**
     * Mostrar todos los productos.
     */
    public function index()
    {
        return response()->json(
            $this->productoService->obtenerTodos(),
            200
        );
    }

    /**
     * Crear un producto.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $producto = $this->productoService->crear($datos);

        return response()->json($producto, 201);
    }

    /**
     * Mostrar un producto específico.
     */
    public function show(Producto $producto)
    {
        return response()->json(
            $this->productoService->obtenerPorId($producto),
            200
        );
    }

    /**
     * Actualizar un producto.
     */
    public function update(Request $request, Producto $producto)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $productoActualizado = $this->productoService->actualizar(
            $producto,
            $datos
        );

        return response()->json($productoActualizado, 200);
    }

    /**
     * Eliminar un producto.
     */
    public function destroy(Producto $producto)
    {
        $this->productoService->eliminar($producto);

        return response()->json([
            'mensaje' => 'Producto eliminado correctamente'
        ], 200);
    }
}