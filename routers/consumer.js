// routers/consumer.js

const express = require('express');
const router = express.Router();
const {
    get_all_consumers,
    get_consumer_by_id,
    create_consumer,
    update_consumer,
    delete_consumer,
} = require("../controllers/users/consumer")

router.get('/consumer', get_all_consumers);
router.get('/consumer/:id', get_consumer_by_id);
router.patch('/consumer_update/:id', update_consumer);
router.delete('/consumer_delete/:id', delete_consumer);
router.post('/consumer_create', create_consumer);

module.exports = router;
