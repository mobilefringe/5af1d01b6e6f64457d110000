<template>
    <div> <!-- Without an outer container div this component template will not render -->
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
                        <div class="details_col_9" v-if="currentJob">
                            <router-link to="/jobs">
                                <div class="inside_page_header"><i class="fa fa-caret-left"></i> Back to List</div>
                            </router-link>
                            <a :href="currentJob.image_url" :data-lightbox="currentJob.name">
                                <img v-lazy="currentJob.image_url" :alt="currentJob.name" class="margin_20 img_max"/>
                            </a>
                            <p class="promo_name">{{ currentJob.name }}</p>
                            <p class="promo_store_name">
                                <router-link v-if="currentJob.jobable_type == 'Store'" :to="'/stores/'+ currentJob.store.slug">
                                    {{ currentJob.store.name }}
                                </router-link>
                                <span v-else>{{ property.name }}</span>
                                <span>| </span>
                                <span v-if="isMultiDay(currentJob)" class="promo_date">{{ currentJob.start_date | moment("MMMM D", timezone)}} to {{ currentJob.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else class="promo_date">{{ currentJob.start_date | moment("MMMM D", timezone)}}</span>
                            </p>
                            <div class="promo_desc" v-html="currentJob.rich_description"></div>
                            <social-sharing v-if="currentJob" :url="shareURL(currentJob.slug)" :title="currentJob.title" :description="currentJob.body" :quote="truncate(currentJob.body)" twitter-user="MiltonMall" :media="currentJob.image_url" inline-template>
                                <div class="social_share">
                                    <h5>Share</h5>
                                    <network network="facebook">
                                        <i class="fa fa-facebook-square"></i>
                                    </network>
                                    <network network="twitter">
                                        <i class="fa fa-twitter-square"></i>
                                    </network>
                                </div>
                            </social-sharing>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<!--<template>-->
    <div> <!-- without an outer container div this component template will not render -->
<!--        <loading-spinner v-if="!dataLoaded"></loading-spinner>-->
<!--        <transition name="fade">-->
<!--            <inside-header-component></inside-header-component>-->
<!--        </transition>-->
<!--        <transition name="fade">-->
<!--            <div v-if="dataLoaded" v-cloak class="main_container margin_30">-->
<!--                <div v-if="currentJob" class="job_details_container">-->
<!--                    <div class="row">-->
<!--                        <div class="col-md-6">-->
<!--                            <img v-lazy="currentJob.store.store_front_url_abs" :alt="currentJob.store.name" class="jobs_logo center-block"/>-->
<!--                        </div>-->
<!--                        <div class="col-md-6">-->
<!--                            <router-link :to="{ name: 'storeDetails', params: { id: currentJob.store.slug }}">-->
<!--                                <span class="job_store_name hidden_phone">{{ currentJob.store.name }}</span>-->
<!--                            </router-link>-->
<!--                            <h2 class="job_name">{{ currentJob.name }}</h2>-->
<!--                            <p class="job_date" v-if="isMultiDayEvent(currentJob)">-->
<!--                                {{ currentJob.start_date | moment("MMM D", timezone)}} to {{ currentJob.end_date | moment("MMM D", timezone)}}-->
<!--                            </p>-->
<!--                            <p class="job_date" v-else>{{ currentJob.start_date | moment("MMM D", timezone)}}</p>-->
<!--                            <div class="margin_20"></div>-->
<!--                            <p v-if="currentJob.contact_name" class="job_date">Contact Name: {{ currentJob.contact_name }}</p>-->
<!--                            <p v-if="currentJob.contact_phone" class="job_date">Telephone: {{ currentJob.contact_phone }}</p>-->
<!--                            <p v-if="currentJob.contact_email" class="job_date">Email: <a :href="'mailto:' + currentJob.contact_email">{{ currentJob.contact_email }}</a></p>-->
<!--                            <p v-if="currentJob.contact_website" class="job_date">Website: <a :href="currentJob.contact_website">{{ currentJob.contact_website }} </a></p>-->
<!--                            <p v-if="currentJob.message" class="job_date">Message: {{ currentJob.message }}</p>-->
<!--                            <div class="margin_20"></div>-->
<!--                            <div class="job_desc" v-html="currentJob.rich_description"></div>-->
<!--                            <div class="row"> -->
<!--                                <div class="col-md-12">-->
<!--                                    <social-sharing v-if="currentJob" :url="shareURL(currentJob.slug)" :title="currentJob.title" :description="currentJob.body" :quote="truncate(currentJob.body)" twitter-user="PickeringTC" :media="currentJob.image_url" inline-template>-->
<!--                                        <div class="social_share">-->
<!--                                            <h5>Share</h5>-->
<!--                                            <network network="facebook">-->
<!--                                                <i class="fa fa-facebook-square"></i>-->
<!--                                            </network>-->
<!--                                            <network network="twitter">-->
<!--                                                <i class="fa fa-twitter-square"></i>-->
<!--                                            </network>-->
<!--                                        </div>-->
<!--                                    </social-sharing>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </transition>-->
<!--    </div>-->
<!--</template>-->

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", "vue-lazy-load", "vue-social-sharing"], function(Vue, Vuex, moment, tz, VueMoment, Meta, VueLazyload, SocialSharing) {
        Vue.use(Meta);
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function() {
                return {
                    dataLoaded: false,
                    currentJob: null
                }
            },
            created() {
				this.$store.dispatch("getData", "jobs").then(response => {
					this.currentJob = this.findJobBySlug(this.id);
					if (this.currentJob === null || this.currentJob === undefined) {
						this.$router.replace({ path: '/jobs' });
					}
					this.dataLoaded = true;
				}, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
				
			},
			watch: {
                currentJob : function (){
                    if(this.currentJob != null) {
                        if (this.currentJob.store != null && this.currentJob.store != undefined && _.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                            this.currentJob.store.store_front_url_abs = "http://placehold.it/400x400";
                        } else if (this.currentJob.store == null || this.currentJob.store == undefined) {
                            this.currentJob.store = {};
                            this.currentJob.store.store_front_url_abs =  "http://placehold.it/400x400";
                        }
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findJobBySlug'
                ])
            },
            methods: {
				isMultiDayEvent(currentJob) {
					var timezone = this.timezone
					var start_date = moment(currentJob.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentJob.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				},
				truncate(val_body) {
                    var truncate = _.truncate(val_body, { 'length': 99, 'separator': ' ' });
                    return truncate;
                },
				shareURL(slug) {
                    var share_url = "https://www.pickeringtowncentre.com/events/" + slug
                    return share_url
                }
			}
        });
    });
</script>
