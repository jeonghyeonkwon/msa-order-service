import * as express from 'express'
import {createOrder,orderList} from "../controllers/order";

const router = express.Router();

router.post('/:userRandomId/order',createOrder)
router.get('/restaurant/:restaurantId/order',orderList);
export default router;
// router.get('/',)