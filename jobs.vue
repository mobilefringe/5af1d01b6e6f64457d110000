<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <h2>Jobs</h2>
                    </div>
                </div>
                <div class="main_container mobile_padding margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    
                        </div>
                        <div class="details_col_9">
                            <!-- JOB -->
                            <b-card no-body class="mb-1 inside_page_toggle">
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-btn block @click="toggleJobs = !toggleJobs" :aria-expanded="toggleJobs ? 'true' : 'false'" aria-controls="toggleJobs">
                                        Jobs
                                        <i v-if="toggleJobs"  class="fa fa-minus f"></i>
                                        <i v-else  class="fa fa-plus"></i>
                                    </b-btn>
                                </b-card-header>
                                <b-collapse v-if="eventList.length >= 1" v-for="event in eventList" v-model="toggleJobs" role="tabpanel" id="toggleJobs" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <p class="promo_name">{{event.name}}</p>
                                                <p class="promo_store_name">
                                                    <router-link v-if="event.eventable_type == 'Store'" :to="'/stores/'+ event.store.slug">
                                                        {{ event.store.name }}
                                                    </router-link>
                                                    <span v-else>{{ property.name }}</span>
                                                    <span>| </span>
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
                                <b-collapse v-if="eventList.length == 0" v-model="toggleJobs" role="tabpanel" id="toggleJobs" class="accordion_body">
                                    <b-card-body>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <p>Sorry, there are no Events posted at this time. Please check back soon!</p>
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
        </transition>
    </div>
</template>



<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <h2>Events & Promotions</h2>
                    </div>
                </div>
                <div class="main_container mobile_padding margin_30">
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    
                        </div>
                        <div class="details_col_9">
                <div v-if="processedJobs.length == 0">
                    <p>Sorry, there are no job postings at this time. Please check back soon.</p>
                </div>
                <div class="job_container" v-if="processedJobs.length >= 1" v-for="job in processedJobs">
                    <div class="job_image_container">
                        <img v-lazy="job.store.store_front_url_abs" :alt="job.name" />
                    </div>
                    <router-link :to="{ name: 'storeDetails', params: { id: job.store.slug }}">
                        <span class="job_store_name">{{ job.store.name }}</span>
                    </router-link>
                    <h3 class="job_name">{{ job.name }}</h3>
                    <p class="job_type">{{job.job_type}}</p>
                    <router-link :to="{ name: 'jobDetails', params: { id: job.slug }}">
                        <span class="read_more">Read More</span>
                    </router-link>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-meta", "vue-lazy-load"], function (Vue, Vuex, Meta, VueLazyload) {
        Vue.use(Meta);
        Vue.use(VueLazyload);
        return Vue.component("jobs-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    toggleJobs: false,
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    console.log(this.processedJobs)
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'processedJobs'
                ]),
                jobList: function jobs() {
                    var jobs = this.processedEvents;
                    var showJobs = [];
                    _.forEach(jobs, function (value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "http://placehold.it/400x400";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "http://placehold.it/400x400";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 100, 'separator': ' ' });
                            
                            showJobs.push(value);
                        }
                    });
                    var sortedJobs = _.orderBy(showJobs, function (o) { return o.end_date });
                    if (sortedJobs.length > 0) {
                        this.toggleJobs = true;
                    }
                    return sortedJobs
                    
                },
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "jobs")]);
                        return results;
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