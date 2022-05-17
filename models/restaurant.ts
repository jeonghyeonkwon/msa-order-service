import {
    BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyGetAssociationsMixin,
    Model
} from "sequelize";

import {sequelize} from './sequelize'
import {dbType} from "./index";


class Restaurant extends Model {

    public readonly id!: number;
    public restaurantName! : string;

    public restaurantId! : string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;

}
Restaurant.init({
    restaurantName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    restaurantId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }

},{
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
})

export const associate = (db:dbType)=>{


}
export default Restaurant;