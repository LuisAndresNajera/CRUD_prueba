<?php

namespace App\Repositories;

use App\Models\Producto;

class ProductoRepository
{
    public function obtenerTodos()
    {
        return Producto::all();
    }

    public function crear(array $datos)
    {
        return Producto::create($datos);
    }

    public function actualizar(Producto $producto, array $datos)
    {
        $producto->update($datos);

        return $producto->fresh();
    }

    public function eliminar(Producto $producto)
    {
        return $producto->delete();
    }
}