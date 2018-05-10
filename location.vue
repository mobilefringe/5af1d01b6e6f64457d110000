<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
       <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>Contact Us</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="row">
                        <div class="col-md-3">
                            <p class="colored_link" style="">Office Phone Number</p>
                            <a class="side_link" href="tel:(702) 564-8595">(702) 564-8595</a>
                            <p class="colored_link" style="">Address</p>
                            <p class="side_link">
                                2275 Village Walk Drive Henderson, Nevada 89052
                            </p>
                            <a class="main_btn block animated_btn" href="https://maps.google.com/maps?ll=36.022438,-115.08492&z=16&t=m&hl=en-US&gl=CA&mapclient=embed&daddr=2225%20Village%20Walk%20Dr%20%23171%20Henderson%2C%20NV%2089052%20USA@36.022438,-115.0849203" target="_blank" >Driving Direction</a>   
                        </div>
                        <div class="hidden-lg hidden-md visible-sm-block visible-xs-block">
                            <div class="col-md-12">
                                <hr>    
                            </div>
                        </div>
                        <div class="col-sm-9">
                            <iframe title="Map" width="100%" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"  :src="'http://maps.google.nl/maps?q=' + getPropertyAddress + '&amp;hl=en&amp;ie=UTF8&amp;t=v&amp;hnear=' + getPropertyAddress + '&amp;z=16&amp;output=embed'"></iframe>
                            <div class="row">
                                <div class="col-md-12">
                                    <!--<div class="page_content" v-if="currentPage" v-html="currentPage.body"></div>-->
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
	define(["Vue", "vuex", "vue-meta"], function(Vue, Vuex, Meta) {
        Vue.use(Meta);
		return Vue.component("location-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    currentPage: null
                }
            },
            created() {
                this.loadData().then(response => {
                    // this.currentPage = response[0].data;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property'
                ]),
                getPropertyAddress() {
                    return this.property.name + ' ' + this.property.address1 + ' ' + this.property.city + ' ' + this.property.country + ' ' +this.property.province_state + ' ' + this.property.province_state
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/milton-directions.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
	});
</script>