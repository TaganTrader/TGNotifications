var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


router.post('/act', function(req, res, next) {
    let data = req.body;
    if (data.action) {
        if (data.action == 'send_text') {
            global.config.telegram[data.bot].bot.send_text(data.user_id, data.text).then(function () {
                res.send('ok');
            });
        }
    }
});

module.exports = router;
