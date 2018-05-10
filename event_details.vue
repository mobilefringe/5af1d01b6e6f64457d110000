<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>Events</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="details_row">
                        <div class="details_col_3">
                            <img class="img_max" src="http://placehold.it/440x1200" alt="" />    
                        </div>
                        <div class="details_col_9" v-if="currentEvent">
                            <router-link to="/events-and-promotions">
                                <div class="inside_page_header"><i class="fa fa-caret-left"></i> Back to List</div>
                            </router-link>
                            <a :href="currentEvent.image_url" :data-lightbox="currentEvent.name">
                                <img v-lazy="currentEvent.image_url" :alt="currentEvent.name"/>
                            </a>
                            <p class="inside_page_title">{{ currentEvent.name }}</p>
                            <p class="dates" v-if="isMultiDayEvent(currentEvent)">
                                {{ currentEvent.start_date | moment("MMM D", timezone)}} to {{ currentEvent.end_date | moment("MMM D", timezone)}}
                            </p>
                            <p class="dates" v-else>{{ currentEvent.start_date | moment("MMM D", timezone)}}</p>
                            
                            <p class="promo_store_name">
                                <router-link v-if="currentEvent.eventable_type == 'Store'" :to="'/stores/'+ currentEvent.store.slug">
                                    {{ currentEvent.store.name }}
                                </router-link>
                                <span v-else>{{ property.name }}</span>
                                <span>| </span>
                                <span v-if="isMultiDay(currentEvent)" class="promo_date">{{ currentEvent.start_date | moment("MMMM D", timezone)}} to {{ currentEvent.end_date | moment("MMMM D", timezone)}}</span>
                                <span v-else class="promo_date">{{ currentEvent.start_date | moment("MMMM D", timezone)}}</span>
                            </p>
                            <div class="event_desc" v-html="currentEvent.rich_description"></div>
                            <div class="row"> 
                                <div class="col-md-12">
                                    <social-sharing v-if="currentEvent" :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.body" :quote="truncate(currentEvent.body)" twitter-user="MiltonMall" :media="currentEvent.image_url" inline-template>
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
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
	define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", "lightbox", "vue-lazy-load",  "vue-social-sharing"], function(Vue, Vuex, moment, tz, VueMoment, Meta, Lightbox, VueLazyload, SocialSharing) {
        Vue.use(Meta);
        Vue.use(Lightbox);
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
		return Vue.component("event-details-component", {
			template: template, // the variable template will be injected,
			props: ['id'],
			data: function() {
				return {
					dataLoaded: false,
					currentEvent: null,
					store_hours: [],
				}
			},
			created() {
				this.$store.dispatch("getData", "events").then(response => {
					this.currentEvent = this.findEventBySlug(this.id);
					if (this.currentEvent === null || this.currentEvent === undefined) {
						this.$router.replace({ name: '404' });
					}
					this.dataLoaded = true;
				}, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
			},
			watch: {
				currentEvent: function() {
					if (this.currentEvent.eventable_type == "Store") {
						var vm = this;
						var storeHours = [];
						_.forEach(this.currentEvent.store.store_hours, function(value, key) {
							storeHours.push(vm.findHourById(value));
						});
						this.store_hours = storeHours;
					}
				}
			},
			computed: {
				...Vuex.mapGetters([
					'property',
					'timezone',
					'processedEvents',
					'findEventBySlug',
				])
			},
			methods: {
				isMultiDayEvent(currentEvent) {
					var timezone = this.timezone
					var start_date = moment(currentEvent.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentEvent.end_date).tz(timezone).format("MM-DD-YYYY")
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
                    var share_url = "https://www.miltonmall.com/events/" + slug
                    return share_url
                }
			}
		});
	});
</script>