<template>
    <header>
        <section id="header" class="header main_container">
            <div class="row logo_container">
                <div class="col-md-3">
                    <div class="site_logo center-block">
                        <a href="/">
                            <img alt="Property Logo" src="//codecloud.cdn.speedyrails.net/sites/5af1d01b6e6f64457d110000/image/png/1518446490000/Logo@2x.png">
                        </a>
                    </div>
                    <div @click="show_menu = !show_menu" :class="{ open: show_menu }" id="menu-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="header_social_container hidden-sm hidden-xs">
                        <div class="header_social">
                            <span class="social_icon" v-for="item in social_media">
                                <a :href="item.url" target="_blank">
                                    <div>
                                        <p class="accessibility">{{item.name}}</p>
                                        <i :class="item.iconClass" aria-hidden="true"></i>
                                    </div>
                                </a>
                            </span>
                        </div>
                    </div>
                    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
                        <nav id="primary_nav" v-if="show_menu" v-on:keyup.esc="show_menu = false">
                            <div class="todays_hours" v-if="todays_hours">
                                <span v-if="!todays_hours.is_closed">
                                    Open Today - {{todays_hours.open_time | moment("h:mma", timezone)}} to {{todays_hours.close_time | moment("h:mma", timezone)}}
                                </span>
                                <span v-if="todays_hours.is_closed">
                                    Closed Today
                                </span>
                            </div>
                            <ul>
                                <router-link tag="li" to="/stores" class="menu_item" exact>
                                    Directory
                                </router-link>
                                <router-link tag="li" to="/events" class="menu_item" exact>
                                    Events & Promotions
                                </router-link>
                                <router-link tag="li" to="/promotions" class="menu_item" exact>
                                    Dine
                                </router-link>
                                <router-link tag="li" to="/promotions" class="menu_item" exact>
                                    Location
                                </router-link>
                                <li id="dropDown3" @click="toggleSubMenu('dropDown3')" class="menu_item">Contact Us
                                    <ul :class="'submenu' + { show_submenu: showSubMenu3 }">
                                        <router-link tag="li" to="/contact-us" class="submenu_item" exact>
                                            <a>{{ $t("menu.contact") }}</a>
                                        </router-link>
                                        <router-link tag="li" to="/directions" class="submenu_item" exact>
                                            <a>{{ $t("menu.find") }}</a>
                                        </router-link>
                                        <router-link tag="li" to="/" class="submenu_item" exact>
                                            <a>{{ $t("menu.about") }}</a>
                                        </router-link>
                                        <router-link tag="li" to="/jobs" class="submenu_item" exact>
                                            <a>{{ $t("menu.jobs") }}</a>
                                        </router-link>
                                        <router-link tag="li" to="/hours" class="submenu_item" exact>
                                            <a>{{ $t("menu.hours") }}</a>
                                        </router-link>
                                        <router-link tag="li" to="/" class="submenu_item" exact>
                                            <a>{{ $t("menu.community") }}</a>
                                        </router-link>
                                    </ul>
                                </li>
                            </ul>
                            <div class="mobile_social_icons">
                                <span v-for="item in social_media">
                                    <a :href="item.url" target="_blank">
                                        <p class="accessibility">{{item.name}}</p>
                                        <i :class="item.iconClass" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </div>
                        </nav>
                    </transition>
                </div>
            </div>
        </section>
    </header>
</template>

<script>
    define(["Vue", "vuex", "vue_router", "routes", "vue!today_hours.vue"], function (Vue, Vuex, VueRouter, appRoutes, TodayHoursComponent) {
        return Vue.component("header-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    active: false, 
                    newsletter_email: "",
                    isOpen: false,
                    windowWidth: 0,
                    show_menu: true,
                    showSubMenu1: false,
                    showSubMenu2: false,
                    showSubMenu3: false
                }
            },
            props:['social_media'],
            watch: {
                $route: function() {
                    if (this.windowWidth <= 768) {
                        this.show_menu = false;
                    }  
                },
                windowWidth: function() {
                    if (this.windowWidth <= 768) {
                        this.show_menu = false;
                    } else {
                        this.show_menu = true;
                        document.body.classList.remove("no-scroll");
                    }
                },
                show_menu: function() {
                    if(this.show_menu == true){
                        document.body.classList.add("no-scroll");
                    } else if (this.show_menu == false) {
                        document.body.classList.remove("no-scroll");
                    }
                }
            },
            mounted() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'hours',
                    'getTodayHours',
                ]),
                locale: {
                    get () {
                        return this.$store.state.locale
                    },
                    set (value) {
                        this.$store.commit('SET_LOCALE', { lang: value })
                    }
                },
                todays_hours() {
                    return this.getTodayHours;
                }
            },
            methods: {
                changeLocale: function(val) {
                    // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                    this.locale = val; 
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                toggleSubMenu(id) {
                    this.showSubMenu1 = false;
                    this.showSubMenu2 = false;
                    this.showSubMenu3 = false;
                    
                    if(id == "dropDown1"){
                        this.showSubMenu1 = true   
                    } else if (id == "dropDown2"){
                        this.showSubMenu2 = true 
                    } else if (id == "dropDown3"){
                        this.showSubMenu3 = true 
                    }
                    
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>