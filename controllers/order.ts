import {Request,Response,NextFunction} from 'express'


import Restaurant from "../models/restaurant";
import {IRestaurantGroup, IFoodGroup} from "../interfaces/KafkaGroup"
import{IOrderRequest} from "../interfaces/RequestGroup";
import Food from "../models/food";
import Order from "../models/order";
import {v4} from "uuid";
import OrderItem from "../models/orderItem";




// /:userRandomId/order'
export const createOrder = async (req:Request ,res:Response ,next:NextFunction) => {
    try {
        const userId = req.params.userRandomId;
        console.log(userId)
        const body:IOrderRequest = req.body;
        console.log(body);
        const createOrder = await Order.create({
            orderId:v4(),
            restaurantId:body.restaurantId,
            buyerId:body.buyerInfo.buyerId,
            userName:body.buyerInfo.userName,
            userTel:body.buyerInfo.userTel,
            userAddress:body.buyerInfo.userAddress
        });
        const foodIdList = body.itemList.map(item=>item.foodId);
        const foodList = await Food.findAll({
            where:{
                foodId:foodIdList
            },
            attributes:['foodName','foodPrice','foodId']
        });
        let foodMap = new Map();
        foodList.forEach(food=>foodMap.set(food.foodId,food));
        const orderItemPromises:Promise<OrderItem>[] = body.itemList.map((food)=> OrderItem.create({
            itemCount:food.itemCount,
            foodId:food.foodId,
            foodName:foodMap.get(food.foodId).foodName,
            foodPrice:foodMap.get(food.foodId).foodPrice
        }))
        const orderItems = await Promise.all(orderItemPromises);
        createOrder.addOrderItems(orderItems);
        console.log(JSON.stringify(foodList,null,2));
    }catch (err){
        next(err);
    }
};


export const createRestaurant = async (restaurant:IRestaurantGroup)=>{
    try{
        const {  restaurantName, restaurantId } = restaurant;
        const isExistRestaurant = await Restaurant.findOne({
            where:{
                restaurantId : restaurantId
            }
        });
        if(isExistRestaurant){
            console.error(`이미 존재하는 음식점 : ${restaurantId}`);
        }else{
            await Restaurant.create({
                restaurantId:restaurantId,
                restaurantName:restaurantName
            });
        }
    }catch (err){
        console.error(err)
    }
}

export const createFood = async (food:IFoodGroup)=>{
    try{
        const {foodName,foodId,foodPrice} = food;

        const isExistFood = await Food.findOne({where:{foodId}});
        if(isExistFood){
            console.error(`이미 존재하는 음식 : ${foodId}`)
        }else {
            await Food.create({
                foodName,
                foodPrice,
                foodId,
            })
        }
    }catch (err){
        console.error(err);
    }
}
