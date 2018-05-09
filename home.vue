<template>
    <div><!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="home_banner_container" >
                    <slick ref="slick" :options="slickOptions">
                        <div v-if="homeBanners" v-for="banner in homeBanners">
                            <router-link v-if="banner.url" :to="banner.url" class="">
                                <!--<div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>-->
                                <div class="banner_image" v-bind:style="{ backgroundImage: 'url(http://placehold.it/1920x400)' }"></div>
                               
                            </router-link>
                            <!--<div v-else class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>-->
                            <div v-else class="banner_image" v-bind:style="{ backgroundImage: 'url(http://placehold.it/1920x400)' }"></div>
                        </div>
                    </slick>
                </div>
                <div class="main_container">
                    <div v-if="featureItems" class="row">
                        <div v-for="item in featureItems" class="col-md-4">
                            <!--<div  class="feature_item">-->
                                <img :src="item.image_url" alt="item.name" />
                                <!--<img src="//codecloud.cdn.speedyrails.net/sites/5af1d01b6e6f64457d110000/image/png/1518461604000/Stores Directory.png" />-->
                            <!--</div>    -->
                        </div>
                    </div>
                    <!--<div v-if="featureItems" class="feature_item_container">-->
                    <!--    <div v-for="item in featureItems" class="feature_item">-->
                            <!--<img :src="item.image_url" />-->
                    <!--        <img src="//codecloud.cdn.speedyrails.net/sites/5af1d01b6e6f64457d110000/image/png/1518461604000/Stores Directory.png" />-->
                    <!--    </div>-->
                    <!--</div>-->
                    <div class="row home_map_container hidden-lg hidden-md visible-sm-block visible-xs-block">
                        <div class="col-sm-8 col-sm-offset-2">
                            <hr>    
                        </div>
                        <div class="col-sm-12">
                            <h3>Map & Store Directory</h3>
                            <v-select 
                                :options="allStores" 
                                :placeholder="'Select A Store'" 
                                :searchable="false" 
                                :label="'name'" 
                                :on-change="dropPin"
                            ></v-select> 
                            <svg-map ref="svgRef" v-bind:svgMapUrl="getSVGurl" :regions="regions"></svg-map>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", "vue!vue-slick", "vue-select", "jquery", "Raphael", "mm_mapsvg", "mousewheel", "vue!svg-map"], function (Vue, Vuex, moment, tz, VueMoment, Meta, slick, VueSelect, $, Raphael, mapSvg, mousewheel, SVGMapComponent) {
        Vue.use(Meta);
        Vue.component('v-select', VueSelect.VueSelect);
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        cssEase: 'linear',
                        dots: true,
                        fade: false,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1000
                    }
                }
            },
            created(){
                this.loadData().then(response => {
                    window.Raphael = Raphael; // our mapSvg plugin is stupid and outdated. need this hack to tie Raphael to window object (global variable)
                    this.dataLoaded = true;  
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'processedStores'
                ]),
                homeBanners() {
                    var banners = [];
                    _.forEach(this.$store.state.banners, function (value, key) {
                        var today = new Date();
                        var start = new Date (value.start_date);
                        if (start <= today){
                            if (value.end_date){
                                var end = new Date (value.end_date);
                                if (end >= today){
                                    banners.push(value);  
                                }
                            } else {
                                banners.push(value);
                            }
                        }
                    });
                    return banners
                },
                featureItems() {
                    return _.slice(this.$store.state.feature_items, 0, 3);
                },
                allStores() {
                    return this.processedStores;
                },
                getSVGurl () {
                    return "https://www.mallmaverick.com" + this.property.svgmap_url;
                },
                svgMapRef() {
                    return this.$refs.svgRef;
                },
                regions () {
                    var regions = {}
                    _.forEach( this.processedStores , function( val, key ) {
                        if(val.svgmap_region != null && typeof(val.svgmap_region)  != 'undefined'){
                            obj = {};
                            obj["tooltip"] = "<p class='tooltip_name'>" + val.name + "</p>";
                            obj["attr"] = {};
                            obj["attr"]["href"] = "/stores/" + val.slug;
                            regions[val.svgmap_region] = obj;
                        }
                        
                    });
                    return regions;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items")]);
                        return results;
                    } catch(e) {
                        console.log("Error loading data: " + e.message);    
                    }
                },
                dropPin(store) {
                    this.svgMapRef.hideMarkers();
                    this.svgMapRef.addMarker(store, '//codecloud.cdn.speedyrails.net/sites/589e308f6e6f641b9f010000/image/png/1484850466000/show_pin.png');
                    this.svgMapRef.setViewBox(store)
                }
            }
        })
    })
</script>
