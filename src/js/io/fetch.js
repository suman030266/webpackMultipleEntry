/**
 *
 Created by zhangzhao on 2017/7/19.
 Email: zhangzhao@gomeplus.com
 */
import axios from 'axios';
import qs from 'qs';
import {requestInter, responseInter} from './interceptors';
// import httpConfig from './http.config.js';
// console.log(httpConfig[process.env.NODE_ENV])
// domain_json['WAP_IP'] php输出到页面
let fetch = axios.create({
    timeout: 30000,
    baseURL: domain_json['WAP_IP'],
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    transformRequest: [function (data) {
        data = qs.stringify(data);
        return data;
    }],
});

requestInter(fetch);
responseInter(fetch);

export default fetch;