<?php

namespace App\Repositories\Contracts;

use Intervention\Image\Collection;

interface ProductCategoryRepositoryInterface
{
    /**
     * Obtener categorías de productos activas
     */
    public function getActives();
}