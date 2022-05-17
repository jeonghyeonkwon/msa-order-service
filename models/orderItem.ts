import {Model, DataTypes, BelongsToSetAssociationMixin} from "sequelize";
import {sequelize} from './sequelize';
import {dbType} from "./index";

import Order from "./order";

class OrderItem extends Model{
    public readonly id!:number;
    public itemCount!:number;

    public foodId!:string;

    public foodName!:string;

    public foodPrice!:number;

    public readonly createdAt!:Date;
    public readonly updateAt!:Date;


}

OrderItem.init({
    itemCount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    foodId:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    foodName:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    foodPrice:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{
    sequelize,
    modelName:'OrderItem',
    tableName:'order_items',
    charset:'utf8',
    collate:'utf8_general_ci'
});

export const associate = (db:dbType)=>{

    db.OrderItem.belongsTo(Order,{foreignKey:'order_pk',targetKey:'orderId'});
}
export default OrderItem;