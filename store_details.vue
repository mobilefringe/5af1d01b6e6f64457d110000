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
                            <ul v-if="storeHours" class="store_details_hours_list">
                                <li v-for="hour in storeHours" v-if="!hour.is_closed">
                                    <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}}</span> 
                                    <span>{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}</span>
                                </li>
                                <li v-else>
                                    {{hour.day_of_week | moment("dddd", timezone)}}: CLOSED
                                </li>
                            </ul>
                            <div class=" margin_30 store_details_desc" v-html="currentStore.rich_description"></div>
                            <div v-if="storePromotions">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="togglePromos = !togglePromos"   :aria-expanded="togglePromos ? 'true' : 'false'"> <!-- :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" -->
                                            Promotions
                                            <i v-if="togglePromos"  class="fa fa-minus"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="promo in storePromotions" v-model="togglePromos" role="tabpanel" class="accordion_body"> <!-- :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(promo.name)" -->
                                        <b-card-body> <!--  v-for="sub_menu in item.sub_menu" -->
                                            <div class="row">
                                                <div class="col-md-5" v-if="">
                                                    <img :src="promo.image_url" :alt="promo.name" class="" />
                                                </div>
                                                <div class="col-md-7">
                                                    <p class="colored_link">{{promo.name}}</p>
                                                    <!--<h3 class="publish_date">{{dates}}</h3>-->
                                                    <div class="details_desc" v-html="promo.description_short"></div>
                                                    <!--<a :href="'/promotions/promo.slug" class="read_more">Promo Details</a>-->
                                                </div>
                                            </div>
                                            <hr class="promo_separator" />
                                        </b-card-body>
                                    </b-collapse>
                                </b-card>
                            </div>
                                            
                            <div v-if="currentStore.total_published_jobs > 0" id="jobs_header" class="inside_page_header accordion_header" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                Jobs
                                <i class="fa fa-chevron-up pull-right"></i>
                            </div>
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
    define(["Vue", "vuex", "vue-meta", "jquery", "Raphael", "mm_mapsvg", "mousewheel", "vue!svg-map", "bootstrap-vue"], function (Vue, Vuex, Meta, $, Raphael, mapSvg, mousewheel,SVGMapComponent, BootstrapVue) {
        Vue.use(BootstrapVue);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function () {
                return {
                    dataLoaded: false,
                    currentStore: null,
                    storeHours: null,
                    storePromotions: null,
                    togglePromos: false,
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
                    
                    var vm = this;
                    var temp_promo = [];
                    console.log(this.currentStore.promotions)
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        
                        if (_.includes(current_promo.image_url, 'missing')) {
                            current_promo.image_url = "http://placehold.it/1560x800/757575";
                        }
                        current_promo.description_short = _.truncate(current_promo.description, { 'length': 150, 'separator': ' ' });
                        // current_promo.name_short_2 = _.truncate(current_promo.name_2, { 'length': 30, 'separator': ' ' });

                        // if (_.includes(current_promo.image_url, 'missing')) {
                        //     current_promo.image_url = "http://placehold.it/1560x800/757575";
                        // }
                        // if (_.includes(current_promo.promo_image2_url_abs, 'missing')) {
                        //     current_promo.promo_image2_url_abs = "http://placehold.it/1560x800/757575";
                        // }

                        temp_promo.push(current_promo);
                        console.log(current_promo)
                    }); 
                    this.storePromotions = temp_promo;
                    console.log(this.storePromotions)
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
                    'timezone',
                    'stores',
                    'findStoreBySlug',
                    'findCategoryById',
                    'findHourById',
                    'findPromoById',
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
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData","promotions")]);
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
