<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    protected Model $model;

    public function findById($id, ?array $relations = [])
    {
        return $this->model->with($relations)->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $entity = $this->findById($id);
        $entity->update($data);
        
        return $entity;  
    }

    public function delete($id)
    {
        $entity = $this->findById($id);
        return $entity->delete();
    }

    public function all(array $columns = ['*'], ?array $relations = [])
    {
        return $this->model->with($relations)->get($columns);
    }

    public function findBy(array $conditions, ?array $relations = [], array $columns = ['*'])
    {
        $query = $this->model->with($relations);

        foreach ($conditions as $field => $value) {
            $query->where($field, $value);
        }

        return $query->get($columns);
    }
}