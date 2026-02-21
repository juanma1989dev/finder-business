<?php 

namespace App\Enums;

enum UserTypeEnum: string {
    case CLIENT = 'client';
    case BUSINESS = 'business';
    case DELIVERY = 'delivery';
}