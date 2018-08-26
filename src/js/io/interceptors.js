/**
 *
 Created by zhangzhao on 2017/8/14.
 Email: zhangzhao@gomeplus.com
 */
export const requestInter = (fetch)=>{
    fetch.interceptors.request.use(function (config) {
        // console.log("request....", config)
        if(config.url === 'try/activitymore'||config.url === 'try/reportmore'){
            config.baseURL = domain_json['WAP_TRY_DOMAIN']
        }
        if (config.loading) {
            let $loadingBox = document.querySelector('.loading-box');
            $loadingBox && ($loadingBox.style.display = 'flex');
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
}

export const responseInter = (fetch)=> {
    fetch.interceptors.response.use(function (response) {
        // console.log("response....", response)
       /* if (response.data.message === "auth failed") {
            window.location.href = '/';
        }*/
        let $loadingBox = document.querySelector('.loading-box');
        $loadingBox && ($loadingBox.style.display = 'none');
        return response;
    }, function (error) {
        return Promise.reject(error);
    });
}