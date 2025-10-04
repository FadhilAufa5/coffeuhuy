<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product; 
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{

  
    public function run(): void
    {

        DB::table('products')->truncate();

        
        Product::create([
            'name' => 'Almond Brown Sugar Croissant',
            'description' => 'Sweet croissant with topping almonds and brown sugar.',
            'type' => 'Non-Coffee',
            'price' => 250000,
            'image' => '/images/almond-croissant.jpg' 
        ]);
        Product::create([
            'name' => 'Smoke Tenderloin Slice Croissant',
            'description' => 'Plain croissant with smoke tenderloin beef sliced.',
            'type' => 'Heavy Meal',
            'price' => 120000,
            'image' => '/images/smoke-tenderloin-croissant.jpg'
        ]);
        Product::create([
            'name' => 'Berry Whipped Cream Croissant',
            'description' => 'Sweet croissant with blueberries and strawberries inside.',
            'type' => 'Non-Coffee',
            'price' => 32000,
            'image' => '/images/berry-croissant.jpg'
        ]);
        Product::create([
            'name' => 'Classic Belgian Waffle',
            'description' => 'Crispy waffle served with maple syrup and butter.',
            'type' => 'Pastry',
            'price' => 26000,
            'image' => '/images/waffle-classic.jpg'
        ]);
       
    }
}