import {DataTypes, HasManyAddAssociationsMixin, Model} from "sequelize";
import {dbType} from "./index";
import {sequelize} from "./sequelize";
import OrderItem from "./orderItem";

class Order extends Model{
    public readonly id!:number;

    public readonly orderId!:string;

    public readonly restaurantId!:string;

    public readonly buyerId!:string
    public readonly userName!:string;

    public readonly userTel!:string;

    public readonly userAddress!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;

    public addOrderItems!:HasManyAddAssociationsMixin<OrderItem, string>
}

Order.init({
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    restaurantId:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    buyerId:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    userTel:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    userAddress:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    timestamps:true,
    underscored:true,
    modelName:'Order',
    tableName:'orders',
    paranoid:true,
    charset:'utf8',
    collate:'utf8_general_ci'
})
export const associate = (db:dbType)=>{
    db.Order.hasMany(OrderItem,{foreignKey:'order_pk',sourceKey:'orderId'});
};
export default Order;