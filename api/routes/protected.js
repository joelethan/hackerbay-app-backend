const express = require('express');
const router = express.Router();
const  urlExists = require('url-exists');
const fileExists = require('file-exists');

const root = require('app-root-dir').get();
appRootDir = root.split("\\").join("/")

const checkAuth = require('../middleware/check-auth');
var methods = require('../middleware/mothods')


// Document
var myobj = {};


// API
router.get('/patch', checkAuth, (req, res, next) => {

    res.status(200).json({
        message: 'GET requests to /protected/patch',
        patchd: myobj
    });
});

router.post('/patch', (req, res, next) => {
    var operation = {
        patch: req.body.patch
    };
     
    if (!operation || !operation.patch || !myobj){
        res.status(500).json({
            message: 'patch or body or doc not found!!'
        });
    }else if((operation.patch).length==0){
        res.status(500).json({
            message: 'patch can not be empty!!'
        });
    }else{
        methods.data.patchFunc(myobj,operation)
        res.status(200).json({
            message: 'POST requests to /protected/patch',
            patch: myobj
        });
    }

});

router.post('/z', (req, res, next) => {
    const operation = {
        url: req.body.url,
        dest: req.body.dest 
    };
    var message = ''

    urlExists(operation.url, function(err, exists) {
        if(exists){

            methods.data.imageDownload(operation)
            methods.data.thumbnailCreator(operation)
            message = message +' Image Created'
            res.status(200).json({
                message: message
            });

        }else{
            message = message + ' url broken,'
            fileExists(appRootDir+'/api/uploads/'+operation.dest+'.jpg').then(exists => {
                if(exists){
                    methods.data.thumbnailCreator(operation)
                    message = message + ' Thumbnail created,'
                    res.status(200).json({
                        message: message
                    });
                }else{
                    message = message + ' No image found'
                    res.status(200).json({
                        message: message
                    });
                }
            })
            
        }

    });
});


module.exports = router;