export async function interogateFlickr(parmasForFlickrQuery){
    const {searchText,currentPage,nrPhotosPerPage} = parmasForFlickrQuery;
    const nextPage=Number(currentPage)+1;
    const url=`https://api.flickr.com/services/rest/?method=flickr.photos.search&safe_search=1&format=json&nojsoncallback=1&api_key=15b67c2a8b4288ff1fddf5eb56655cfb&content_type=1&is_getty=1&page=${nextPage}&per_page=${nrPhotosPerPage}&text=${searchText}`;
    const resp = await fetch(url);
   return resp;
}

export function getFlickrUrl(flickrItem){
    //const {farm,id,isfamily,isfriend,ispublic,owner,secret,server,title} = flickrItem;
    const {farm,id,secret,server} = flickrItem;
    console.log('farm=%o,id=%o,secret=%o,server=%o',farm,id,secret,server)
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
}
