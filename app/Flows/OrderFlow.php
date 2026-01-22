<?php 

namespace App\Flows;

use App\Enums\OrderStatusEnum;
use App\Enums\UserTypeEnum;

class OrderFlow 
{
    public static function flow(): array
    {
        return  [
            UserTypeEnum::CLIENT->value => [
                OrderStatusEnum::PENDING->value => [
                    OrderStatusEnum::CANCELLED->value,
                ],
            ],
            UserTypeEnum::DELIVERY->value => [
                OrderStatusEnum::READY_FOR_PICKUP->value => [
                    OrderStatusEnum::PICKED_UP->value,
                ],
                OrderStatusEnum::PICKED_UP->value => [
                    OrderStatusEnum::ON_THE_WAY->value,
                ],
                OrderStatusEnum::ON_THE_WAY->value => [
                    OrderStatusEnum::DELIVERED->value,
                ],
            ],
            UserTypeEnum::BUSINESS->value => [
                OrderStatusEnum::PENDING->value => [
                    OrderStatusEnum::REJECTED->value,
                    OrderStatusEnum::CONFIRMED->value,
                ],
                OrderStatusEnum::CONFIRMED->value => [
                    OrderStatusEnum::READY_FOR_PICKUP->value,
                ],
            ]
        ];
    }

    public static function labels(): array
    {
        return OrderStatusEnum::labels();
    }
}