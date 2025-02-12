const express = require('express');
const router = express.Router();
const {
    get_all_tags,
    get_tag_by_id,
    create_tag,
    update_tag,
    delete_tag,
} = require("../controllers/tags/tags")

router.get('/get_all_tags', get_all_tags);
router.get('/get_tag/:id', get_tag_by_id);
router.post('/create_tag', create_tag);
router.patch('/update_tag/:id', update_tag);
router.delete('/delete_tag/:id', delete_tag);

module.exports = router;
