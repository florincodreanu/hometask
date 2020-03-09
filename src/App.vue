<template>
    <div id="app" class="app__body">
        <div class="app__header">
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
    import debounce from 'debounce';
    import {interogateFlickr} from './modules/flickr';
    import {getFlickrUrl} from './modules/flickr';
    import {getBrowserWindowDims} from './modules/flickr';

    export default {
        name: 'App',
        data: function () {
            return {
                searchText: '',
                busy: false,
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
            populateArrayAppWithImages(pimages) {
                const vueInst = this;
                const photosFlickr = pimages.slice(0, vueInst.nrPhotosPerPage);
                photosFlickr.forEach(item => {
                    vueInst.totalPhotosFetched++;
                    vueInst.arrayOfImages.push({url: getFlickrUrl(item, vueInst.sizeSuffixe), id: vueInst.totalPhotosFetched});
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
