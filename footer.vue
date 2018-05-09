<template>
    <footer>
        <section class="footer_menu">
            <div class="row">
                <div class="col-md-4">
                    
                </div>
                <div class="col-md-4">
                    
                </div>
                <div class="col-md-4">
                    
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