<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>Events & Promotions</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    
                        </div>
                        <div class="col-md-9">
                            <div v-if="eventList.length >= 1">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="toggleEvents = !toggleEvents" :aria-expanded="toggleEvents ? 'true' : 'false'" aria-controls="toggleEvents">
                                            Events
                                            <i v-if="toggleEvents"  class="fa fa-minus f"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="event in eventList" v-model="toggleEvents" role="tabpanel" id="toggleEvents" class="accordion_body">
                                        <b-card-body>
                                            <div class="row">
                                                <div class="col-md-5" v-if="">
                                                    <img :src="event.image_url" :alt="event.name" class="" />
                                                </div>
                                                <div class="col-md-7">
                                                    <p class="promo_name">{{event.name}}</p>
                                                    <p class="promo_store_name">
                                                        <span v-if="event.eventable_type == 'Store'">{{ event.store.name }} | </span>
                                                        <span v-else>{{ property.name }} | </span>
                                                        <span v-if="isMultiDay(event)" class="promo_date">{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span>
                                                        <span v-else class="promo_date">{{ event.start_date | moment("MMMM D", timezone)}}</span>
                                                    </p>
                                                    <div class="promo_desc" v-html="event.description_short"></div>
                                                    <router-link :to="'/events/'+ event.slug" >
							                            <a class="read_more">Event Details</a>
					                                </router-link>
                                                </div>
                                            </div>
                                            <hr class="promo_separator" />
                                        </b-card-body>
                                    </b-collapse>
                                </b-card>
                            </div>
                            <div v-if="promoList.length >= 1">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="togglePromos = !togglePromos" :aria-expanded="togglePromos ? 'true' : 'false'" aria-controls="togglePromotions">
                                            Promotions
                                            <i v-if="togglePromos"  class="fa fa-minus f"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="promo in promoList" v-model="togglePromos" role="tabpanel" id="togglePromotions" class="accordion_body">
                                        <b-card-body>
                                            <div class="row">
                                                <div class="col-md-5" v-if="">
                                                    <img :src="promo.image_url" :alt="promo.name" class="" />
                                                </div>
                                                <div class="col-md-7">
                                                    <p class="promo_name">{{promo.name}}</p>
                                                    <div v-if="promo.promotionable_type == 'Store'">
                                                        
                                                    </div>
                                                    <p class="promo_store_name">
                                                        <router-link v-if="promo.promotionable_type == 'Store'" :to="'/stores/'+ promo.store.slug">{{ promo.store.name }}</router-link>
                                                        <span v-else>{{ property.name }}</span>
                                                        <span>| </span>
                                                        <span v-if="isMultiDay(promo)" class="promo_date">{{ promo.start_date | moment("MMMM D", timezone)}} to {{ promo.end_date | moment("MMMM D", timezone)}}</span>
                                                        <span v-else class="promo_date">{{ promo.start_date | moment("MMMM D", timezone)}}</span>
                                                    </p>
                                                    <div class="promo_desc" v-html="promo.description_short"></div>
                                                    <router-link :to="'/promotions/'+ promo.slug" >
							                            <a class="read_more">Promo Details</a>
					                                </router-link>
                                                </div>
                                            </div>
                                            <hr class="promo_separator" />
                                        </b-card-body>
                                    </b-collapse>
                                </b-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "lightbox", "vue-lazy-load", "bootstrap-vue"], function (Vue, Vuex, moment, tz, VueMoment, Lightbox, VueLazyload, BootstrapVue) {
        Vue.use(BootstrapVue);
        Vue.use(Lightbox);
        Vue.use(VueLazyload);
        return Vue.component("events-and-promotions-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                    toggleEvents: false,
                    togglePromos: false,
                    
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedEvents',
                    'processedPromos',
                ]),
                eventList: function events() {
                    var events = this.processedEvents;
                    var showEvents = [];
                    _.forEach(events, function (value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            console.log(window.width)
                            if(window.width > 768) {
                                value.description = _.truncate(value.description, { 'length': 100, 'separator': ' ' });
                            } else {
                                value.description = _.truncate(value.description, { 'length': 50, 'separator': ' ' });    
                            }
                            showEvents.push(value);
                        }
                    });
                    var sortedEvents = _.orderBy(showEvents, function (o) { return o.end_date })
                    console.log(sortedEvents)
                    return sortedEvents
                },
                promoList: function promos() {
                    var vm = this;
                    var showPromos = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "http://placehold.it/400x400";
                            }
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "http://placehold.it/400x400";
                            }
                            showPromos.push(value);
                        }
                    });
                    var sortedPromos = _.orderBy(showPromos, [function(o) { return o.end_date; }]);
                    console.log(sortedPromos)
                    return sortedPromos;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "events"), this.$store.dispatch("getData","promotions")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                isMultiDay(promo) {
                    var timezone = this.timezone
                    var start_date = moment(promo.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(promo.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        });
    });
</script>
