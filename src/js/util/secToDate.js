/** 秒 转换为 日期 **/
export default function  secToDate(mm){
    var date = new Date(mm * 1000).toLocaleString();
        date = date.split(' ')[0];
        date = date.toString().replace(/\//g,'-');
    return date;
}
