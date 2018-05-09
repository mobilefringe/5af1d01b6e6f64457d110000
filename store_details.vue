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
                            <img class="details_image" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
                            <div v-if="currentStore.phone">
                                <p class="colored_link">Phone</p>
                                <a class="side_link" :href="'tel:' + currentStore.phone">{{phone}}</a>    
                            </div>
                            <div v-if="currentStore.address">
                                <p class="colored_link" style="{{address_show}}">Address</p>
                                <p class="side_link"></p>
                            </div>
                            <a v-if="currentStore.website" class="animated_btn" :href="'http://' + currentStore.website" target="_blank">Visit Website</a>
                        </div>
                        <div class="col-md-9">
                            
                        </div>
                    </div>
                    <div v-if="currentStore" class="store_details_container">
                        <div class="row">
                            <div class="col-md-12">
                                <h1 class="store_details_name">{{ currentStore.name }}</h1>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8">
                                <p class="store_details_phone">
                                    <span v-if="currentStore.phone">{{ currentStore.phone}}</span>
                                    <span v-if="currentStore.website"> | <a :href="currentStore.website" target="_blank">Visit Website</a></span>
                                </p>
                            </div>
                            <div class="col-md-4 text-right hidden_phone">
                                <p v-if="currentStore.categories" class="store_details_categories">
                                    Category: <span>{{ storeCategory }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="margin_40"></div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="store_details_logo">
                                    <img :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'"/>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div id="map">
                                    <svg-map  ref="svgmapRef"  @updateMap="updateSVGMap"  :svgMapUrl="getSVGurl" ></svg-map>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 margin_30">
                                <div class="margin_40"></div>
                                <div class="store_details_desc" v-html="currentStore.rich_description"></div>
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
