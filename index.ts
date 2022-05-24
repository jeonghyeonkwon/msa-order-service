import * as express from 'express';
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as expressSession from 'express-session';
import * as dotenv from 'dotenv'
import * as hpp from 'hpp';
import * as helmet from 'helmet'

import * as cookieParser from "cookie-parser";
import {consumer} from "./config/kafka";
import orderRouter from './routes/order';
const {sequelize} = require('./models');
import {Eureka} from 'eureka-js-client';
import {NextFunction, Request, Response} from "express";
import {createRestaurant,createFood} from "./controllers/order";
const ip = require('ip');
dotenv.config();
const app = express();

const prod: boolean = process.env.NODE_ENV==='production';

if(prod){
    app.use(hpp())
    app.use(helmet());
    app.use(morgan('combined'));

}else{
    app.use(morgan('dev'))
    app.use(cors({
        origin:true,
        credentials:true,
    }))
}
const client = new Eureka({
    instance:{
        app:'order-service',
        instanceId:`${ip.address()}:order-service:${process.env.PORT!}`,
        hostName:`${ip.address()}`,
        ipAddr:`${ip.address()}`,
        statusPageUrl:`http://${ip.address()}:3066/check`,

        port:{
            '$':3066,
            '@enabled':true
        },
        vipAddress: 'order-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka:{
        host:'127.0.0.1',
        port:8761,
        servicePath:'/eureka/apps/'
    }
})

sequelize
    .sync({force: false})
    .then(() => {
        console.log('연결 성공');
    })
    .catch(() => {
        console.log('에러');
    });

app.use('/',express.static('upload'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.set('port',prod?process.env.PORT:3066);

app.use('/',orderRouter);
const initKafka = async ()=>{
    console.log('start kafka');
    await consumer.connect();
    await consumer.subscribe({topics:[
            'restaurant-create-food-event',
            'restaurant-create-restaurant-event'
        ],fromBeginning:false});
    await consumer.run({
        eachMessage: async ({topic,partition,message})=>{
            console.log(`topic11 ${topic}`)

            console.log(JSON.parse(message.value!.toString()));
            switch (topic){
                case 'restaurant-create-food-event':
                    await createFood(JSON.parse(message.value!.toString()));
                    break;
                case 'restaurant-create-restaurant-event':
                    await createRestaurant(JSON.parse(message.value!.toString()));
                    break
                default:
                    console.log(`등록된 토픽이 아닙니다 - ${topic}`);
            }
        }
    })
}


client.start( error => {
    console.log(error || "order service registered")
});
app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    console.log(err);
    return res.status(400).send({msg: err.message});
});

app.listen(app.get('port'),()=>{
    console.log(`server is running on ${app.get('port')}`);
})
initKafka();
