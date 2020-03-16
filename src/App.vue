<template>
    <div id="app" class="app__body">

        <div class="app__header">
            <PopOver v-bind:propsIsVisible="isVisibleSettingsDialog">
                <BtnRound  slot="reference"  :icon="'ion-ios-heart'" :color="'red'" @click.native="isVisibleSettingsDialog=true"></BtnRound>
                <template v-slot:header>
                    <h3>Settings</h3>
                </template>
                <template v-slot:content>
                    <div class="simple__flex--row">
                        <div class="simple__flex--column">
                            <i class="ion-ios-square" style="font-size:5em;" @click="setPhotosDisplayStyle('simpleMode')"></i>
                            <p>fewer photos on screen</p>
                        </div>
                        <div class="simple__flex--column">
                            <i class="ion-ios-grid" style="font-size:5em;" @click="setPhotosDisplayStyle('condensedMode')"></i>
                            <p>more photos on screen</p>
                        </div>
                    </div>
                </template>
            </PopOver>
            <input class="search__input" type="text" placeholder="type for searching"
                   :value='searchText'
                   @input='evt=>searchText=evt.target.value'/>
            <div v-if="totalPhotosFetched>0" class="app__feedback"><span>found:{{totalPhotosFound}}</span><span>fetch:{{totalPhotosFetched}}</span>
            </div>
        </div>
        <div class="card__results">
                <v-lazy-image
                        v-for="image in arrayOfImages" :key="image.id"
                        v-bind:src="image.url"
                        src-placeholder="https://cdn-images-1.medium.com/max/80/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
                />
            <div class="break"></div>
            <div v-infinite-scroll="loadMorePhotos" infinite-scroll-disabled="busy" infinite-scroll-distance="10"
                 class="infinite__scroll">
                {{textInfiniteScroll}}
            </div>
        </div>
    </div>
</template>

<script>
    import BtnRound from './components/BtnRound.vue';
    import PopOver from './components/PopOver.vue';
    import debounce from 'debounce';
    import {interogateFlickr} from './modules/flickr';
    import {getFlickrUrl} from './modules/flickr';
    import {getBrowserWindowDims} from './modules/flickr';

    export default {
        name: 'App',
        components:{
            BtnRound, PopOver
        },
        data: function () {
            return {
                searchText: '',
                busy: false,
                isVisibleSettingsDialog:false,
                sizeSuffixe:'n',//n for small, z for medium
                arrayOfImages: [],
                currentPage: 0,
                nrPhotosPerPage: 20,
                totalPhotosFound: 0,
                totalPhotosFetched: 0,
                textInfiniteScroll: '',
            }
        },
        methods: {
            searchTextIsChanged: debounce(function () {
                this.currentPage = 0;
                this.totalPhotosFound = 0;
                this.totalPhotosFetched = 0;
                this.arrayOfImages = [];
                this.loadMorePhotos();
            }, 500),
            setPhotosDisplayStyle(simpleMode_or_condensedMode){
                switch (simpleMode_or_condensedMode) {
                    case 'simpleMode':
                        if(this.nrPhotosPerPage<=20){
                            document.documentElement.style.setProperty('--width-result-img', '90%');
                            document.documentElement.style.setProperty('--height-result-img', 'auto');
                        }else{
                            document.documentElement.style.setProperty('--width-result-img', 'auto');
                            document.documentElement.style.setProperty('--height-result-img', '30vh');
                        }
                        this.isVisibleSettingsDialog=false;
                        break;
                    case 'condensedMode':
                        if(this.nrPhotosPerPage<=20){
                            document.documentElement.style.setProperty('--width-result-img', 'auto');
                            document.documentElement.style.setProperty('--height-result-img', '25vh');
                        }else{
                            document.documentElement.style.setProperty('--width-result-img', 'auto');
                            document.documentElement.style.setProperty('--height-result-img', '20vh');
                        }
                        this.isVisibleSettingsDialog=false;
                        break;
                }
            },
            populateArrayAppWithImages(pimages) {
                const vueInst = this;
                const photosFlickr = pimages.slice(0, vueInst.nrPhotosPerPage);
                photosFlickr.forEach(item => {
                    /** Example of one item
                     id: "49658325618"
                     owner: "28232089@N04"
                     secret: "2349ba00a6"
                     server: "65535"
                     farm: 66
                     title: "Baker-Polito Administration launches COVID-19 Response Command Center"
                     ispublic: 1
                     isfriend: 0
                     isfamily: 0
                     */
                    vueInst.totalPhotosFetched++;
                    vueInst.arrayOfImages.push({url: getFlickrUrl(item, vueInst.sizeSuffixe), id: vueInst.totalPhotosFetched,title:item.title});
                })
            },
            loadMorePhotos() {
                const vueInst = this;
                vueInst.busy = true;
                if (vueInst.searchText.length == 0) {
                    //don't do anything if no input provided
                    vueInst.textInfiniteScroll = '';
                } else {
                    vueInst.textInfiniteScroll = 'Searching for more photos...';
                    interogateFlickr({
                        searchText: vueInst.searchText,
                        currentPage: vueInst.currentPage,
                        nrPhotosPerPage: vueInst.nrPhotosPerPage
                    })
                        .then(response => response.json())
                        .then(flickrResponse => {
                            vueInst.busy = false;
                            vueInst.textInfiniteScroll = '';
                            vueInst.currentPage = (flickrResponse.photos.pages > 0 ? flickrResponse.photos.page : 0);
                            vueInst.totalPhotosFound = flickrResponse.photos.total;
                            vueInst.populateArrayAppWithImages(flickrResponse.photos.photo);
                            if (flickrResponse.stat == 'ok') {
                                if (flickrResponse.photos.total <= vueInst.arrayOfImages.length) {
                                    vueInst.busy = true;
                                    vueInst.textInfiniteScroll = 'No more photos';
                                }
                            } else {
                                this.currentPage = 0;
                            }
                        }).catch(err => {
                        vueInst.arrayOfImages = [];
                        vueInst.textInfiniteScroll = "Error " + err;
                    });
                }
            }
        },
        watch: {
            totalPhotosFound: function (newValTotalPhotosFound) {
                if (newValTotalPhotosFound == 0 && this.searchText.length > 0 && !this.busy) {
                    this.textInfiniteScroll = "No photos found.";
                    this.totalPhotosFetched = 0;
                }
            },
            searchText: function () {
                this.searchTextIsChanged();
            }
        }
        ,created() {
            const {widthBrowserWindow, heightBrowserWindow} =getBrowserWindowDims();
            if(widthBrowserWindow*heightBrowserWindow < 500000){
                this.nrPhotosPerPage=20;
                this.sizeSuffixe='n';
            }else{
                this.nrPhotosPerPage=35;
                this.sizeSuffixe='z';
            }
        }
    }
</script>

<style scoped>
    .v-lazy-image {
        filter: blur(10px);
        transition: filter 0.7s;
    }
    .v-lazy-image-loaded {
        filter: blur(0);
    }
</style>
