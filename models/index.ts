import Restaurant ,{ associate as associateRestaurant } from "./restaurant";
import Food,{associate as associateFood} from "./food";
import Order,{associate as associateOrder} from './order'
import OrderItem ,{associate as associateOrderItem} from './orderItem'
export * from './sequelize'

const db = {
    Restaurant,
    Food,
    Order,
    OrderItem
};

export type dbType = typeof db;

associateRestaurant(db);
associateFood(db);
associateOrder(db);
associateOrderItem(db);

