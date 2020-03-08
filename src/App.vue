<template>
  <div id="app" class="app__body">
    <div class="app__header">
          <input class="search__input" type="text"  placeholder="type for searching"
                 :value='searchText'
                 @input='evt=>searchText=evt.target.value' />
          <div v-if="totalPhotosFetched>0" class="app__feedback"><span>found:{{totalPhotosFound}}</span><span>fetch:{{totalPhotosFetched}}</span>
          </div>
    </div>

    <div class="card__results" >
      <img v-for="image in arrayOfImages" :key="image.id" v-bind:src="image.url">
      <div class="break"></div>
      <div v-infinite-scroll="loadMorePhotos" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="infinite__scroll">
            {{textInfiniteScroll}}
      </div>
    </div>

  </div>
</template>

<script>
  import debounce from 'debounce';
  import {interogateFlickr} from './modules/flickr';
  import {getFlickrUrl} from './modules/flickr';

export default {
  name: 'App',
  data: function() {
    return {
      searchText: '',
      busy: false,
      arrayOfImages: [],
      currentPage: 0,
      nrPhotosPerPage:15,
      totalPhotosFound:0,
      totalPhotosFetched:0,
      textInfiniteScroll:''
    }
  },
  methods:{
    searchTextIsChanged:debounce(function(){
      this.currentPage=0;
      this.totalPhotosFound=0;
      this.totalPhotosFetched=0;
      this.arrayOfImages=[];
      this.loadMorePhotos();
      },500),
    populateArrayOfImages(pimages){
      const vueInst=this;
      const photosFlickr=pimages.slice(0,vueInst.nrPhotosPerPage);
      photosFlickr.forEach(item=>{
        vueInst.totalPhotosFetched++;
         vueInst.arrayOfImages.push({url:getFlickrUrl(item),id:vueInst.totalPhotosFetched});
      })
    },
    loadMorePhotos(){
      const vueInst=this;
        vueInst.busy = true;
      if(vueInst.searchText.length==0){
          vueInst.textInfiniteScroll='';
      }else{
          vueInst.textInfiniteScroll='Loading more photos...';
        interogateFlickr({searchText:vueInst.searchText,currentPage:vueInst.currentPage,nrPhotosPerPage:vueInst.nrPhotosPerPage})
                .then(response => response.json())
                .then(flickrResponse => {
                    vueInst.busy = false;
                    vueInst.textInfiniteScroll='';
                  vueInst.currentPage=(flickrResponse.photos.pages>0 ? flickrResponse.photos.page : 0);
                  vueInst.totalPhotosFound=flickrResponse.photos.total;
                  vueInst.populateArrayOfImages(flickrResponse.photos.photo);
                  if(flickrResponse.stat=='ok'){
                    if(flickrResponse.photos.total<=vueInst.arrayOfImages.length){
                        vueInst.busy = true;
                      vueInst.textInfiniteScroll='No more photos';
                    }
                  }
                  else{
                    this.currentPage=0;
                  }
                }).catch(err => {
                    console.log('err=%o',err)
                    vueInst.arrayOfImages=[];
                    vueInst.textInfiniteScroll="Error "+err;
                });
      }
    }
  },
  watch: {
    totalPhotosFound: function (newValTotalPhotosFound) {
      if(newValTotalPhotosFound==0 && this.searchText.length>0){
        this.textInfiniteScroll = "No photos found.";
        this.totalPhotosFetched=0;
      }
    },
      searchText: function(){
          this.searchTextIsChanged();
      }
  }
}
</script>
