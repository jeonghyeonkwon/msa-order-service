interface IBuyerInfo{
    buyerId:string;
    userName:string;
    userTel:string;
    userAddress:string;
}
interface IItemList{
    foodId:string;
    itemCount:number;
}
export interface IOrderRequest{
    restaurantId:string;
    buyerInfo:IBuyerInfo;
    itemList:IItemList[];
}