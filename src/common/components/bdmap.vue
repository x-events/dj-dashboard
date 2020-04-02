<template>
    <div :id="mapId" class="bdmap"></div>
</template>

<script>
import { MP } from "@/plugins/map";

export default {
    props: {
        data:{
            type: Array,
            default:function(){
                return []
            }
        },
        pointtype:{
            type: Number,
            default:function(){
                return 1
            }
        },
        showtype: {
            type: String,
            default:function(){
                return '1'
            }
        },
        centerPoint:{
            type: Array,
            default:function(){
                return [116.508479,39.929238]
            }
        },
        zoom:{
            type: Number,
            default:function(){
                return 15
            }
        },
        type:{
            type: Number,
            default:function(){
                return 1
            }
        },
        control:{
            type: Boolean,
            default:function(){
                return true
            }
        },
        getPoint:{
            type: Boolean,
            default:function(){
                return false
            }
        }
    },
    data() {
        return {
            mapId:'mapall' + Math.random()*1000000,
            ak:'KRGn2GpEQXYKduXHZpeVGK0FeMU3ZvGZ',
            map:null,
            BMap:null,
            markerClusterer:null,
            markers:[],
            mapStyle:[{
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#ccd6d7ff"
                    }
                }, {
                    "featureType": "green",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#dee5e5ff"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#d1dbdbff"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#aab6b6ff"
                    }
                }, {
                    "featureType": "subwaystation",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "color": "#888fa0ff"
                    }
                }, {
                    "featureType": "education",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#e1e7e7ff"
                    }
                }, {
                    "featureType": "medical",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#d1dbdbff"
                    }
                }, {
                    "featureType": "scenicspots",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#d1dbdbff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "weight": 4
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "weight": 2
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#fbfffeff"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "weight": 1
                    }
                }, {
                    "featureType": "local",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#fbfffeff"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "railway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "weight": 1
                    }
                }, {
                    "featureType": "railway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#9494941a"
                    }
                }, {
                    "featureType": "railway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff1a"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "weight": 1
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#c3bed433"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff33"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#979c9aff"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#333333ff"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#454d50ff"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#454d50ff"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#fbfffeff"
                    }
                }, {
                    "featureType": "poilabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "districtlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "poilabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "districtlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#888fa0ff"
                    }
                }, {
                    "featureType": "transportation",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#d1dbdbff"
                    }
                }, {
                    "featureType": "companylabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "restaurantlabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "lifeservicelabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "carservicelabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "financelabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "otherlabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "village",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "district",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "land",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#edf3f3ff"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, 
                {
                    "featureType": "cityhighway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#cacfcfff"
                    }
                }, {
                    "featureType": "subwaylabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "subwaylabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "tertiarywaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "tertiarywaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "provincialwaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "provincialwaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "nationalwaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, 
                {
                    "featureType": "nationalwaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "highwaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "highwaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#fbfffeff"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#999999ff"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, 
                {
                    "featureType": "highway",
                    "stylers": {
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "6"
                    }
                }, {
                    "featureType": "highway",
                    "stylers": {
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "7"
                    }
                }, {
                    "featureType": "highway",
                    "stylers": {
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "8"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "6"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "7"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "8"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "6"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "7"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "8"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "6"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6,8",
                        "level": "7"
                    }
                }]
        };
    },
    watch:{
        data(){
            this.mapInit();
        },
        getPoint(val) {
            if(val) {
                this.getPointSet()
            }
        }
    },
    methods: {
        showPoints(BMap,data){

            let point = new BMap.Point(data.lng,data.lat);

            let icon_url = "/img/mp"+this.pointtype+".png"
            var myIcon = new BMap.Icon(icon_url, new BMap.Size(30,50));

            let marker = new BMap.Marker(point,{icon:myIcon});

            if(this.data.length > 20){
                this.markers.push(marker);
            }else{
                this.map.addOverlay(marker);
            }
            
            const showtype = this.showtype;
            let info_html = "";
            if(showtype==2){

                if(data.remark){
                    info_html +=`<div class="_func">
                        <div class="_item">简介</div>
                        <div class="text">${data.remark}</div>
                    `
                }
                
                if(data.funcs && Array.isArray(data.funcs.value)){
                    info_html += `<div class="_func">
                        <div class="_item">主要功能</div>
                        <ul class="_list">
                    `
                    data.funcs.value.map(fun => {
                        info_html += `<li><img src="${fun.url}" /><span>${fun.name}</span></li>`
                    })
                    info_html += `</ul>
                    </div>`
                }
                
            }
            if(data.info){
                for (let i = 0; i < data.info.length; i++) {
                    const e = data.info[i];
                    info_html += '<div class="_item el" title='+e.name+'：'+e.value+'>'+e.name+'：'+e.value+'</div>'
                }
            }
            if(data.img && Array.isArray(data.img.value)){
                info_html += `<div class="_img _imgs fix">`
                data.img.value.map(src => {
                    info_html += `<img src="${src}" />`
                })
                info_html += `</div>`
            }
            if(!data.title){
                return false;
            }
            
            let sContent = `<div class="mapbox" id="`+data.id+`">
                        <div class="hd fix">
                            <div class="title el" title="`+data.title+`">`+data.title+`</div>
                        </div>
                        <div class="bd fix">
                            <div class="fix info${showtype==2 ? ' typeInfo1' : ''}">`+info_html+`</div>
                        </div>
                    </div>`;

            let infoWindow = new BMap.InfoWindow(sContent);

            marker.addEventListener("mouseover", function(){
                this.openInfoWindow(infoWindow);
            })
        },
        getPointSet() {
            this.map.addEventListener("click",(e)=>{
                //console.log(e.point.lng,e.point.lat);
                let bpoint = [e.point.lng,e.point.lat]
                this.$emit('callPoint',bpoint)

                this.map.clearOverlays();
                let point = new BMap.Point(e.point.lng,e.point.lat);
                var myIcon = new BMap.Icon('/img/mp1.png', new BMap.Size(30,50));
                let marker = new BMap.Marker(point,{icon:myIcon});
                this.map.addOverlay(marker);
            })
        },
        mapInit(){
            MP(this.ak).then(BMap => {
                this.BMap = BMap;
                this.map = new BMap.Map(this.mapId,{enableMapClick:false,maxZoom:18}); // 创建Map实例
                this.map.setMapStyle({styleJson:this.mapStyle})
                var point = new BMap.Point(this.centerPoint[0],this.centerPoint[1]); // 创建点坐标
                this.map.centerAndZoom(point, this.zoom);
                this.map.enableScrollWheelZoom();

                var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
                var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
                if(this.control){
                    this.map.addControl(top_left_control);
                    this.map.addControl(top_left_navigation);
                }

                this.map.clearOverlays();

                //遍历添加点

                for (let i = 0; i < this.data.length; i++) {
                    const e = this.data[i];
                    this.showPoints(BMap,e)
                }
                
                if(this.data.length > 20){
                    this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
                        markers:this.markers,
                        styles:[
                            {
                                url: '/img/m0.png',
                                size: new BMap.Size(53, 52),
                                textColor: '#ffffff',
                                textSize:14
                            },
                            {
                                url: '/img/m1.png',
                                size: new BMap.Size(56, 55),
                                textColor: '#ffffff',
                                textSize:14
                            },
                            {
                                url: '/img/m2.png',
                                size: new BMap.Size(66, 65),
                                textColor: '#ffffff',
                                textSize:14
                            },
                            {
                                url: '/img/m3.png',
                                size: new BMap.Size(78, 77),
                                textColor: '#ffffff',
                                textSize:14
                            },
                            {
                                url: '/img/m4.png',
                                size: new BMap.Size(90, 89),
                                textColor: '#ffffff',
                                textSize:14
                            }
                        ]
                    });
                    this.markerClusterer.setMaxZoom(17)
                    //console.log(this.markerClusterer.getMap(),'getMap');
                    // this.markerClusterer.addEventListener("mouseover", function(){
                    //     let clusterArr = this.markerClusterer.getMarkers() || [];
                    //     for (let i = 0; i < clusterArr.length; i++) {
                    //         const e = clusterArr[i];
                    //         if(e.isInCluster){
                    //             console.log(e.point);
                    //         }
                    //     }
                    // })
                    
                }

                if(this.getPoint == true){
                    this.getPointSet()
                }
            })
        }
    },
    created() {
        this.mapInit();
    }
};
</script>

<style>
.bdmap { width:100%; height:100%; position:absolute; left:0; top:0; border-radius: 6px;}
.bdmap img { max-width:none;}
.mapbox { width: 500px; min-height:130px;}
.mapbox img { max-width:100%;}
.mapbox .hd { border-bottom:#e5e5e5 1px solid; height:40px; line-height:40px;}
.mapbox .hd .title {padding-left: 34px; font-size:16px;background:url(../assets/img/map/mark-1.png) 6px center no-repeat;}
.mapbox .bd { line-height:1.5;}
.mapbox .info { padding:8px 0px; font-size:12px; line-height:1.8;}
.mapbox .info span { display:inline-block; margin-right:10px;}
.anchorBL { display:none;}
.mapbox .info2 { background-color:#f2f2f2; padding:10px;}
/* 另一种弹窗样式 */
.mapbox .typeInfo1 ._item{position: relative;padding-left: 8px;float: left;width:50%;margin-bottom:6px;box-sizing: border-box;}
.mapbox .typeInfo1 ._item::before{content: "";position:absolute;left: 0;top:50%;width:4px;height:12px;margin-top:-6px;border-radius: 2px;background: #ff1844;}
.mapbox .typeInfo1 ._img{overflow: hidden;}
.mapbox .typeInfo1 ._list{overflow: hidden;clear: left;margin-bottom: 6px;}
.mapbox .typeInfo1 ._list li{float: left;width: 80px; height: 24px; margin:0 6px 6px;overflow: hidden;}
.mapbox .typeInfo1 ._list li img{width:20px; margin-right:5px; vertical-align:-6px;}
.mapbox .typeInfo1 ._list li span{color:#666; margin:0;}
.mapbox ._imgs { margin-top:5px;clear: both;}
.mapbox ._imgs img { max-width:31%; margin-right:2%; height:70px; margin-bottom:5px;}
.BMap_bubble_content,.BMap_bubble_content .mapbox { height:calc(100%)!important;}
.BMap_bubble_content .mapbox .bd { height:calc(100% - 41px); overflow-x:hidden; overflow-y:auto;}

.typeInfo1 .text { clear:both; overflow:hidden; line-height:1.5; margin-bottom:10px;}
</style>
