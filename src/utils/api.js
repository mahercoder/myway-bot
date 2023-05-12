const axios = require('axios')
const { config } = require('../utils')

async function getFreeServer(){
    const response = await axios.get("https://olive-clubs-relate.loca.lt")
    const { serverOptions } = response.data
    if(serverOptions){
        const { url } = serverOptions
        return url
    } else {
        return false
    }
}

async function setPhone( serverUrl, initiativeUrl, userId, phone ){
    const response = await axios.post( `${serverUrl}/setPhone`, {
        userId: +userId,
        url: initiativeUrl,
        phone: phone
    })

    const { status, captchaImage } = response.data

    if(status == 200){
        return captchaImage
    } else {
        return false
    }
}

async function setCaptcha( serverUrl, userId, captchaResult){
    const response = await axios.post( `${serverUrl}/setCaptcha`, {
        userId: +userId,
        captchaResult: captchaResult.toString()
    })

    const { status, text } = response.data
    
    // text: { status: false, msg: "Овоз бериш жараёнида бу рақамдан фойдаланилган" }
    
    if(status == 200){
        if(text.status){
            return true
        } else {
            return text.msg
        }
    } else {
        return false
    }
}

async function setSMSCode( serverUrl, userId, smsCode){
    const response = await axios.post( `${serverUrl}/setSMSCode`, {
        userId: +userId,
        captchaResult: smsCode.toString()
    })

    const { status, success, text } = response.data

    if(status == 200){
        if(success){
            return true
        } else {
            return text.msg
        }
    } else {
        return false
    }
}

module.exports = {
    getFreeServer,
    setPhone,
    setCaptcha,
    setSMSCode
}