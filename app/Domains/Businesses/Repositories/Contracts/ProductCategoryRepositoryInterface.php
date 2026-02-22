<?php

namespace App\Domains\Businesses\Repositories\Contracts;

interface ProductCategoryRepositoryInterface
{
    /**
     * Obtener categorías de productos activas
     */
    public function getActives();
}
