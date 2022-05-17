import * as express from 'express'
import {createOrder} from "../controllers/order";

const router = express.Router();
router.post('/:userRandomId/order',createOrder)
export default router;
// router.get('/',)