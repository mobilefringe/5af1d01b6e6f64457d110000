define([], function () {
    return [
        {
            path: '/',
            component: view('home')
        },
        {
            path: '/contact-us',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('contact'),
                    meta: {
                        pageName: 'Contact Us',
                    },
                    name: 'contact'
                }
            ]
        },
        {
            path: '/directions',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('directions'),
                    meta: {
                        pageName: 'Find Us',
                    },
                    name: 'directions'
                }
            ]
        },
        {
            path: '/events',
            component: view('default'),
            children: [
                // {
                //     path: '',
                //     component: view('events'),
                //     meta: {
                //         pageName: 'Events',
                //     },
                //     name: 'events'
                // },
                {
                    path: ':id',
                    component: view('event_details'),
                    meta: {
                        pageName: 'Events',
                    },
                    name: 'eventDetails',
                    props: true
                }
            ]
        },
        {
            path: '/events-and-promotions',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('events-and-promotions'),
                    meta: {
                        pageName: 'Events & Promotions',
                    },
                    name: 'events-and-promotions'
                }
            ]
        },
        // {
        //     path: '/hours',
        //     component: view('default'),
        //     children: [
        //         {
        //             path: '',
        //             component: view('hours'),
        //             meta: {
        //                 pageName: 'Hours',
        //             },
        //             name: 'hours'
        //         }
        //     ]
        // },
        {
            path: '/jobs',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('jobs'),
                    meta: {
                        pageName: 'Careers',
                    },
                    name: 'jobs'
                },
                {
                    path: ':id',
                    component: view('job_details'),
                    meta: {
                        pageName: 'Careers',
                    },
                    name: 'jobDetails',
                    props: true
                }
            ]
        },
        {
            path: '/location',
            component: view('default'),
            children: [
                {   
                    path: '',
                    component: view('location'),
                    meta: {
                        pageName: 'Location',
                    },
                    name: 'location'
                }
            ]
        },
        {
            path: '/map',
            component: view('default'),
            children: [
                {   
                    path: '',
                    component: view('map'),
                    meta: {
                        pageName: 'Centre Map',
                    },
                    name: 'map'
                }
            ]
        },
        {
            path: '/newsletter',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('newsletter'),
                    meta: {
                        pageName: 'Newsletter',
                    },
                    name: 'newsletter'
                }
            ]
        },
        {
            path: '/pages',
            component: view('default'),
            children: [
                {
                    path: ':id',
                    component: view('page_details'),
                    name: 'pageDetails',
                    props: true
                }
            ]
        },
        // {
        //     path: '/photos',
        //     component: view('default'),
        //     children: [
        //         {   
        //             path: '',
        //             component: view('photos'),
        //             meta: {
        //                 pageName: 'Photos',
        //             },
        //             name: 'photos'
        //         }
        //     ]
        // },
        {
            path: '/promotions',
            component: view('default'),
            children: [
                // {
                //     path: '',
                //     component: view('promotions'),
                //     meta: {
                //         pageName: 'Promotions',
                //     },
                //     name: 'promotions'
                // },
                {
                    path: ':id',
                    component: view('promotion_details'),
                    meta: {
                        pageName: 'Promotions',
                    },
                    name: 'promotionDetails',
                    props: true
                }
            ]
        },
        {
            path: '/stores',
            component: view('default'),
            children: [
                {   
                    path: '',
                    component: view('stores'),
                    meta: {
                        pageName: 'Store Directory',
                    },
                    name: 'storeList'
                },
                {
                    path: ':id',
                    component: view('store_details'),
                    meta: {
                        pageName: 'Store Details',
                    },
                    name: 'storeDetails',
                    props: true
                }
            ]
        },
        {
            path: '/404',
            name: '404',
            component: view('notfoundcomponent')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]

    /*
    * Asynchronously load view (lazy-loading)
    * @param {string} name the filename (basename) of the view to load.
    */
    function view(name) {
        return function(resolve) { require(['vue!' + name + '.vue'], resolve); }
    };
});
