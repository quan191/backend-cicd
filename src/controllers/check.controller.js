require("dotenv").config();
const crypto = require('crypto');
const {validationResult} = require("express-validator");
module.exports = {
    getData: async (req, res, next) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                let error = errors.errors;
                return res.status(200).send({status: 500, error});
            }
            let check = 20;
            if (check != 30){
                return res.status(200).send({status: 200, data: "success"});
            } else {
                return res.status(200).send({status: 200, data: "failed"});
            }
        } catch (e) {
            return res.status(200).send({status: 500, msg: `internal server error : ${e}`});
        }
    }
}
