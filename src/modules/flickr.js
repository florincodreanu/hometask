export async function interogateFlickr(parmasForFlickrQuery){
    const { searchText, currentPage, nrPhotosPerPage } = parmasForFlickrQuery;
    const nextPage=Number(currentPage)+1;
    const url=`https://api.flickr.com/services/rest/?method=flickr.photos.search&safe_search=1&format=json&nojsoncallback=1&api_key=15b67c2a8b4288ff1fddf5eb56655cfb&content_type=1&is_getty=1&page=${nextPage}&per_page=${nrPhotosPerPage}&text=${searchText}`;
    const resp = await fetch(url);
   return resp;
}

export function getFlickrUrl( flickrItem, sizeSuffixe){
    const {farm,id,secret,server} = flickrItem;
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${sizeSuffixe}.jpg`;
}

export function getBrowserWindowDims() {
    var doc = document, w = window;
    var docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat')?
        doc.documentElement: doc.body;

    var width = docEl.clientWidth;
    var height = docEl.clientHeight;

    // mobile zoomed in?
    if ( w.innerWidth && width > w.innerWidth ) {
        width = w.innerWidth;
        height = w.innerHeight;
    }

    return {widthBrowserWindow: width, heightBrowserWindow: height};
}
