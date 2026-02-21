<?php

use App\Enums\UserTypeEnum;

return [
    UserTypeEnum::CLIENT->value => [
        'type'          => UserTypeEnum::CLIENT->value,
        'title'         => 'Quiero comprar',
        'label'         => 'Cuenta de cliente',
        'image'         => '/images/banner_cliente.webp',
        'description'   => 'Explora negocios cercanos, realiza pedidos y sigue tus entregas.',
        'route.start'   => 'public.home'
    ],
    UserTypeEnum::BUSINESS->value => [
        'type'          =>  UserTypeEnum::BUSINESS->value,
        'title'         => 'Quiero vender',
        'label'         => 'Cuenta de negocio',
        'image'         => '/images/banner_negocio.webp',
        'description'   => 'Publica tu negocio, recibe pedidos y administra tus ventas.',
        'route.start'   => 'dashboard.business.index'
    ],
    UserTypeEnum::DELIVERY->value => [
        'type'          => UserTypeEnum::DELIVERY->value,
        'title'         => 'Quiero repartir',
        'label'         => 'Cuenta de repartidor',
        'image'         => '/images/banner_repartitdor.webp',
        'description'   => 'Acepta pedidos disponibles y genera ingresos realizando entregas.',
        'route.start'   => 'delivery.home'
    ]
];
 