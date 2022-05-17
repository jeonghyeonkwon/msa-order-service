export interface IFoodGroup{
    id:number;
    foodName:string;
    foodPrice:number;
    foodId:string;
    updatedAt:string;
    createdAt:string;
}

export interface IRestaurantGroup{
    id:number;
    restaurantName:string;
    restaurantId:string;
    updatedAt:string;
    createdAt:string;
    owner_pk:string;
}
