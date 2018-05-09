<template>
    <footer>
        <section class="footer_menu">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="heading">MANAGEMENT OFFICE HOURS</h5>
                    <img src="//codecloud.cdn.speedyrails.net/sites/57f3bee46e6f643959000000/image/png/1463686637000/clock.png" class="hours_clock" alt="hours clock">
                    <div class="hours_footer" id="hours_container">
                        <script id="hours_template" type="x-tmpl-mustache/text">
                            <p>
                                {%raw%}
                                    {{day}} 
                                    <br />
                                    {{hour}}
                                {%endraw%}
                            </p>
                        </script>
                    </div>
                    <div class="clearfix"></div>
                    <hr class="visible_phone mobile_separator" />    
                </div>
                <div class="col-md-4">
                    <h5 class="heading">NEWSLETTER SUBSCRIPTION</h5>
                    <div class="newsletter_div">
                        <form action="//mobilefringe.createsend.com/t/d/s/kkuyhl/" method="post" id="newsletter_form">
                            <input name="cm-kkuyhl-kkuyhl" type="text" placeholder="Susbcribe to Newsletter" class="newsletter_control" required />
                            <button class="newsletter_btn animated_btn">Subscribe</button>
                            <label class="newsletter_label">
                                <input id="newsletter_agree" type="checkbox" />
                                I agree to receive newsletters from The District at Green Valley Ranch.
                            </label>
                            <p class="hidden_now" id="success_subscribe">
                                Thank you for subscribing!
                            </p>
                        </form>
                    </div>
                </div>
                <div class="col-md-4">
                    <a class="pull-right view_more_btn" href="https://www.instagram.com/thedistrictgvr/" target="_blank">view more ></a>
                    <h5 class="heading">INSTAGRAM</h5>
                    <div id="instafeed"></div>    
                </div>
            </div>
        </section>
        <section class="footer_privacy">
            <div class="main_container">
                <p class="footer_desc">&#169; {{copyright_year}} {{property.name}} | {{ $t("footer.powered-by") }} <a href="//mallmaverick.com" target="_blank">Mall Maverick</a> | <a href="/pages/milton-privacy-policy">{{ $t("footer.privacy-policy") }}</a></p>
            </div>
        </section>
    </footer>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue!search-component"], function (Vue, Vuex, moment, tz, VueMoment, SearchComponent) {
        return Vue.component("footer-component", {
            template: template, // the variable template will be injected,
            data: function data() {
                return {
                    suggestionAttribute: 'name',
                    search: '',    
                }
            },
            props:['social_media'],
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'processedStores'
                ]),
                copyright_year() {
                    return moment().year();
                }
            },
            methods: {
                onOptionSelect(option) {
                    console.log('Selected option:', option);
                    this.$nextTick(function() {
                        this.search = ""
                    });
                    this.$router.push("/stores/" + option.slug);
                }
            }
        });
    });
</script>