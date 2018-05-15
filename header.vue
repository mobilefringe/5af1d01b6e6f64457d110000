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
                    <nav id="primary_nav" class="hidden_phone">
						<ul>
						    <li class="menu_item" v-for="item in menu_items" :id="item.id">
						        <router-link :to="item.href">{{ item.name }}</router-link>
						        <ul v-if="item.sub_menu">
						            <li v-for="sub_menu in item.sub_menu" class="dropdown_item">
						                <router-link :to="sub_menu.href">{{ sub_menu.name }}</router-link>
						            </li>
								</ul>
						    </li>
						</ul>
					</nav>
					<div class="nav_container visible_phone">
					    <transition name="custom-classes-transition" enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
    					    <nav id="mobile_nav" v-show="showMenu" class="">
    					        <ul>
    					            <li v-for="(item,key) in menu_items" class="menu_item">
    							        <router-link :to="item.href" v-if="item.sub_menu == undefined">{{$t(item.name)}}</router-link>
    							        <div v-else>
    							            <b-card no-body class="mb-1">
                                                <b-card-header header-tag="header" class="p-1" role="tab">
                                                    <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                                                        {{$t(item.name)}}
                                                        <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>
                                                        <i v-else  class="fa fa-plus"></i>
                                                    </b-btn>
                                                </b-card-header>
                                                <b-collapse v-model="item.show_sub_menu" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">
                                                    <b-card-body v-for="sub_menu in item.sub_menu">
                                                        <p class="card-text">
                                                            <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
                                                        </p>
                                                    </b-card-body>
                                                </b-collapse>
                                            </b-card>
    							        </div>
    							    </li>
    					        </ul>
    						    <div class="mobile_nav_content visible_phone">
    							    <div class="social_icons center">
                                        <span v-for="item in social_media">
                                            <a :href="item.url" target="_blank">
                                                <i :class="item.iconClass" aria-hidden="true"></i>
                                            </a>
                                        </span>
                                    </div> 
                                    <div class="mobile_property_address center">
                                        <p>{{ property.name }}<br>
                                            <a href="https://goo.gl/maps/RJ5dV8dxP1y" target="_blank">{{ property.address1 }}<br>{{ property.city }} {{ property.province_state }} {{ property.postal_code }}</a>
                                        </p>
                                        
                                    </div>
    							</div>
    						</nav>
    				    </transition>
    				</div>
                    <!--<transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">-->
                    <!--    <nav id="primary_nav" v-if="show_menu" v-on:keyup.esc="show_menu = false">-->
                    <!--        <div class="todays_hours" v-if="todays_hours">-->
                    <!--            <span v-if="!todays_hours.is_closed">-->
                    <!--                Open Today - {{todays_hours.open_time | moment("h:mma", timezone)}} to {{todays_hours.close_time | moment("h:mma", timezone)}}-->
                    <!--            </span>-->
                    <!--            <span v-if="todays_hours.is_closed">-->
                    <!--                Closed Today-->
                    <!--            </span>-->
                    <!--        </div>-->
                    <!--        <ul>-->
                    <!--            <router-link tag="li" to="/stores" class="menu_item" exact>-->
                    <!--                Directory-->
                    <!--            </router-link>-->
                    <!--            <router-link tag="li" to="/events-and-promotions" class="menu_item" exact>-->
                    <!--                Promotions & Events-->
                    <!--            </router-link>-->
                    <!--            <li id="dropDown1" @click="toggleSubMenu('dropDown1')" class="menu_item">About-->
                    <!--                <ul :class="'submenu' + { show_submenu: showSubMenu1 }">-->
                    <!--                    <router-link tag="li" to="/pages/" class="submenu_item" exact>-->
                    <!--                        <a>Services</a>-->
                    <!--                    </router-link>-->
                    <!--                    <router-link tag="li" to="/newsletter" class="submenu_item" exact>-->
                    <!--                        <a>Newsletter</a>-->
                    <!--                    </router-link>-->
                    <!--                </ul>-->
                    <!--            </li>-->
                    <!--            <li id="dropDown2" @click="toggleSubMenu('dropDown2')" class="menu_item">Contact-->
                    <!--                <ul :class="'submenu' + { show_submenu: showSubMenu2 }">-->
                    <!--                    <router-link tag="li" to="/jobs" class="submenu_item" exact>-->
                    <!--                        <a>Jobs</a>-->
                    <!--                    </router-link>-->
                    <!--                    <router-link tag="li" to="/location" class="submenu_item" exact>-->
                    <!--                        <a>Location</a>-->
                    <!--                    </router-link>-->
                    <!--                    <router-link tag="li" to="/pages/" class="submenu_item" exact>-->
                    <!--                        <a>Management</a>-->
                    <!--                    </router-link>-->
                    <!--                    <router-link tag="li" to="/pages/" class="submenu_item" exact>-->
                    <!--                        <a>Leasing</a>-->
                    <!--                    </router-link>-->
                    <!--                </ul>-->
                    <!--            </li>-->
                    <!--        </ul>-->
                    <!--        <div class="mobile_social_icons">-->
                    <!--            <span v-for="item in social_media">-->
                    <!--                <a :href="item.url" target="_blank">-->
                    <!--                    <p class="accessibility">{{item.name}}</p>-->
                    <!--                    <i :class="item.iconClass" aria-hidden="true"></i>-->
                    <!--                </a>-->
                    <!--            </span>-->
                    <!--        </div>-->
                    <!--    </nav>-->
                    <!--</transition>-->
                </div>
            </div>
        </section>
    </header>
</template>

<script>
    define(["Vue", "vuex", "vue_router", "routes", "vue!today_hours.vue", "bootstrap-vue"], function (Vue, Vuex, VueRouter, appRoutes, TodayHoursComponent, BootstrapVue) {
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
                    
                    showMenu: false,
                    showMobileMenu: false,
                    noScroll: false,
                    windowWidth: 0
                }
            },
            props:['menu_items', 'social_media'],
            // watch: {
            //     $route: function() {
            //         if (this.windowWidth <= 768) {
            //             this.show_menu = false;
            //         }  
            //     },
            //     windowWidth: function() {
            //         if (this.windowWidth <= 768) {
            //             this.show_menu = false;
            //         } else {
            //             this.show_menu = true;
            //             document.body.classList.remove("no-scroll");
            //         }
            //     },
            //     show_menu: function() {
            //         if(this.show_menu == true){
            //             document.body.classList.add("no-scroll");
            //         } else if (this.show_menu == false) {
            //             document.body.classList.remove("no-scroll");
            //         }
            //     }
            // },
            watch: {
                $route: function() {
                    if (this.windowWidth <= 768) {
                        this.showMenu = false;
                    }  
                    _.forEach(this.menu_items, function(value, key) {
                        value.show_sub_menu = false;
                    });
                },
                showMenu: function() {
                    if(this.showMenu == true){
                        document.body.classList.add("no_scroll");
                    } else if (this.showMenu == false) {
                        document.body.classList.remove("no_scroll");
                    }
                }
            },
            created() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    this.getWindowWidth();
                });
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
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.search = ""
                    });
                    this.$router.push("/stores/" + option.slug);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
    
            // methods: {
            //     changeLocale: function(val) {
            //         // this will update the data store, which in turn will trigger the watcher to update the locale in the system
            //         this.locale = val; 
            //     },
            //     getWindowWidth(event) {
            //         this.windowWidth = window.innerWidth;
            //     },
            //     toggleSubMenu(id) {
            //         this.showSubMenu1 = false;
            //         this.showSubMenu2 = false;
            //         this.showSubMenu3 = false;
                    
            //         if(id == "dropDown1"){
            //             this.showSubMenu1 = true   
            //         } else if (id == "dropDown2"){
            //             this.showSubMenu2 = true 
            //         } else if (id == "dropDown3"){
            //             this.showSubMenu3 = true 
            //         }
                    
            //     }
            // },
        });
    });
</script>