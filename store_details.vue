<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>{{ currentStore.name }}</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="store_details_image" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
                            <div v-if="currentStore.phone">
                                <p class="inside_page_title">Phone</p>
                                <a class="store_details_phone" :href="'tel:' + currentStore.phone">{{ currentStore.phone }}</a>    
                            </div>
                            <div v-if="currentStore.unit">
                                <p class="inside_page_title">Address</p>
                                <p class="store_details_phone">{{ currentStore.unit }}</p>
                            </div>
                            <a v-if="currentStore.website" class="animated_btn" :href="'http://' + currentStore.website" target="_blank">Visit Website</a>
                        </div>
                        <div class="col-md-9">
                            <div id="map" class="margin_20">
                                <svg-map  ref="svgmapRef"  @updateMap="updateSVGMap"  :svgMapUrl="getSVGurl" ></svg-map>
                            </div>
                            <div class="inside_page_header">Store Hours & Information</div>
                            <div v-if="currentStore.store_hours.length > 0" class="store_details_hours_container">
                                <p v-for="hour in ">
                                    <td class="hours_left">{{day}}</td>   
                                    <td class="hours_right">{{hour_string}}</td>    
                                </p>
                            </div>
                            <ul v-if="storeHours" class="details-hours-list">
                                <li v-for="hour in hours" v-if="!hour.is_closed">
                                    {{hour.day_of_week | moment("dddd", timezone)}}: {{hour.open_time | moment("hA", timezone)}}-{{hour.close_time | moment("hA", timezone)}}
                                </li>
                                <li v-else>
                                    {{hour.day_of_week | moment("dddd", timezone)}}: CLOSED
                                </li>
                            </ul>
                                
                                
                            <div class=" margin_30 store_details_desc" v-html="currentStore.rich_description"></div>
                            
                            <div id="promotions_header" class="inside_page_header accordion_header" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse3" aria-expanded="false" aria-controls="collapse3">
                                Promotions
                                <i class="fa fa-chevron-up pull-right"></i>
                            </div>
                            <div id="collapse3" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading3">
                                <div class="store_desc" id="promos_container"></div>
                            </div>
                            
                            <h5 id="jobs_header" class="inside_page_header accordion_header" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                Jobs
                                <i class="fa fa-chevron-up pull-right"></i>
                            </h5>
                            <div id="collapse2" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading3">
                                <div class="store_desc" id="jobs_container"></div>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "vue-meta", "jquery", "Raphael", "mm_mapsvg", "mousewheel", "vue!svg-map"], function (Vue, Vuex, Meta, $, Raphael, mapSvg, mousewheel,SVGMapComponent) {
        Vue.use(Meta);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function () {
                return {
                    dataLoaded: false,
                    currentStore: null,
                    storeHours: null,
                    map: null
                }
            },
            props:['id'],
            created (){
                window.Raphael = Raphael; // our mapSvg plugin is stupid and outdated. need this hack to tie Raphael to window object (global variable)
                
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.updateCurrentStore(this.id);
                });
            },
            watch: {
                $route: function () {
                    this.updateCurrentStore(this.$route.params.id);
                },
                currentStore: function () {
                    var vm = this;
                    var storeHours = [];
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        storeHours.push(vm.findHourById(value));
                    });
                    this.storeHours = storeHours;
                },
                // map : function (){
                    
                //         var vm = this;
                //         setTimeout(function () {
                //             vm.dropPin();
                //         }, 500);
                   
                // }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'stores',
                    'findStoreBySlug',
                    'findCategoryById'
                ]),
                storeCategory() {
                    var currentStoreCategory = this.currentStore.categories[0];
                    category = this.findCategoryById(currentStoreCategory)
                    return category.name
                },
                getSVGurl () {
                    return "https://www.mallmaverick.com" + this.property.svgmap_url;
                },
                svgMapRef () {
                    return _.filter(this.$children, function(o) { return (o.$el.className == "svg-map") })[0];
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "categories")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore(id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined) {
                        this.$router.replace({ name: 'stores' });
                    }
                    console.log(this.currentStore)
                },
                updateSVGMap (map) {
                    this.map = map;
                    this.dropPin();
                },
                dropPin () {
                    // console.log("this.currentStore.svgmap_region", this.currentStore.svgmap_region);
                    this.svgMapRef.addMarker(this.currentStore,'//codecloud.cdn.speedyrails.net/sites/589e308f6e6f641b9f010000/image/png/1484850466000/show_pin.png');
                    this.svgMapRef.setViewBox(this.currentStore)
                } 
            }
        });
    });
</script>
