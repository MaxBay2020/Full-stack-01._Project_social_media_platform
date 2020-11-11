define(()=>{
    let app = require('app')
    app.factory('passwordStrengthService', [function() {
        function getStrength(password){
            if(password===undefined || password===''){
                return
            }
            let lv = 0
            if(password.match(/[a-z]/g)){
                lv++
            }
            if(password.match(/[0-9]/g)){
                lv++
            }
            if(password.match(/[A-Z]/g)){
                lv++
            }

            if(password.match(/(.[^a-z0-9A-Z])/g)){
                lv++
            }
            if(password.length<6){
                lv=0
            }
            if(lv>4){
                lv=4
            }
            return lv
        }

        return {
            getStrength:getStrength

        }
    }])

})