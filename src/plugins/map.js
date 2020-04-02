export function MP(ak) {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve(BMap)
        }
        let bd_script = document.createElement("script");
        bd_script.type = "text/javascript";
        bd_script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
        bd_script.onerror = reject;
        document.head.appendChild(bd_script);
    })
}