<?php

namespace App\Repositories\Contracts;

interface ProductCategoryRepositoryInterface
{
    /**
     * Obtener categorías de productos activas
     */
    public function getActives();
}