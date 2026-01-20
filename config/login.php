<?php

use App\Enums\UserTypeEnum;

return [
    UserTypeEnum::CLIENT->value => [
        'type' => UserTypeEnum::CLIENT->value,
        'label' => 'Cliente',
        'banner' => '/images/banner_cliente.webp',
        'title' => 'Bienvenido',
        'subTitle' => 'Inicia sesión para encontrar negocios cercanos'
    ],
    UserTypeEnum::BUSINESS->value => [
        'type' =>  UserTypeEnum::BUSINESS->value,
        'label' => 'Negocio',
        'banner' => '/images/banner_negocio.webp',
        'title' => 'Bienvenido',
        'subTitle' => 'Inicia sesión para poder gestionar tu negocio'
    ],
    UserTypeEnum::DELIVERY->value => [
        'type' => UserTypeEnum::DELIVERY->value,
        'label' => 'Repartidor',
        'banner' => '/images/banner_repartitdor.webp',
        'title' => 'Bienvenido',
        'subTitle' => 'Inicia sesión para comenzar a relizar entregas.'
    ]
];
 