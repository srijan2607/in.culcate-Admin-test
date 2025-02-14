const express = require('express');
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAdmin_or_CC = require("../middleware/isAdmin_or_CC");
const {
    get_all_tags,
    get_tag_by_id,
    create_tag,
    update_tag,
    delete_tag,
} = require("../controllers/tags/tags")

router.get('/get_all_tags', get_all_tags);
router.get('/get_tag/:id', get_tag_by_id);
router.post('/create_tag', isAdmin_or_CC,create_tag);
router.patch('/update_tag/:id', isAdmin_or_CC,update_tag);
router.delete('/delete_tag/:id', isAdmin_or_CC,delete_tag);

module.exports = router;
