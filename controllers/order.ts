import {Request,Response,NextFunction} from 'express'


import Restaurant from "../models/restaurant";
import {IRestaurantGroup, IFoodGroup} from "../interfaces/KafkaGroup"
import{IOrderRequest} from "../interfaces/RequestGroup";
import Food from "../models/food";
import Order from "../models/order";
import {v4} from "uuid";
import OrderItem from "../models/orderItem";
import {PageDto} from "../common/PageDto";


// /restaurant/:restaurantId/order
export const orderList = async (req:Request,res:Response,next:NextFunction)=>{
    let restaurantId = req.params.restaurantId;
    let page:number = Number(req.query.page) | 1 ;
    let limit:number = 10;
    let offset:number = Number(0 + ( page - 1 ) * limit);
    const orderList = await Order.findAndCountAll({
        offset:offset,
        limit:limit,
        where:{
            restaurantId:restaurantId
        },
        attributes:['orderId','restaurantId','buyerId','userName','userTel','userAddress'],
        include:[{
            model:OrderItem,

            attributes:['itemCount','foodName','foodPrice']
        }]
    });
    console.log(orderList)

    const {count,rows} = orderList

    const pageDto = new PageDto(count,limit,page,rows)
    return res.status(200).send({
        restaurantId:restaurantId,
        data:pageDto
    });
}

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
        res.status(201).send({
            statusCode:201,
            message:{
                orderId:createOrder.orderId
            }
        })
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
        const {foodName,foodId,foodPrice,restaurantId} = food;

        const isExistFood = await Food.findOne({where:{foodId}});
        if(isExistFood){
            console.error(`이미 존재하는 음식 : ${foodId}`)
        }else {
            await Food.create({
                foodName,
                foodPrice,
                foodId,
                restaurantId
            })

        }
    }catch (err){
        console.error(err);
    }
}
