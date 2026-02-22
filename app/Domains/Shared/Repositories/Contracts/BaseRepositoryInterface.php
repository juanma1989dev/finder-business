<?php

namespace App\Domains\Shared\Repositories\Contracts;

interface BaseRepositoryInterface 
{
    public function findById($id, ?array $relations = []);

    public function create(array $data);

    public function update($id, array $data);

    public function delete($id);

    public function all(array $columns = ['*'], ?array $relations = []);

    public function findBy(array $conditions, ?array $relations = [], array $columns = ['*']);
}
