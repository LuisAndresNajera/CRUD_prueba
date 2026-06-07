<?php

namespace App\Services;

use App\Models\Producto;
use App\Repositories\ProductoRepository;

class ProductoService
{
    protected ProductoRepository $productoRepository;

    public function __construct(ProductoRepository $productoRepository)
    {
        $this->productoRepository = $productoRepository;
    }

    public function obtenerTodos()
    {
        return $this->productoRepository->obtenerTodos();
    }

    public function obtenerPorId(Producto $producto)
    {
        return $producto;
    }

    public function crear(array $datos)
    {
        return $this->productoRepository->crear($datos);
    }

    public function actualizar(Producto $producto, array $datos)
    {
        return $this->productoRepository->actualizar(
            $producto,
            $datos
        );
    }

    public function eliminar(Producto $producto)
    {
        return $this->productoRepository->eliminar($producto);
    }
}