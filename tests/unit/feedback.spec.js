import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue';
import infiniteScroll from "vue-infinite-scroll";

describe('totalPhotosFetched', () => {
  it('renders app__feedback when photos was fetched', async () => {
    const msg = 'fetch:15';
    const wrapper = shallowMount(App, {directives: {infiniteScroll} });
    wrapper.setData({ totalPhotosFetched: 15 });
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toMatch(msg)
  })
})


describe('imagesRendered', () => {
  it('renders images when photos was fetched', async () => {
    const wrapper = shallowMount(App, {directives: {infiniteScroll} });
    wrapper.setData({ arrayOfImages: [{"url":"https://farm4.staticflickr.com/3218/3141143944_0c209cf7fa.jpg","id":1},{"url":"https://farm3.staticflickr.com/2753/4245188018_bfa04f1f09.jpg","id":2}] });
    await wrapper.vm.$nextTick();
    const images = wrapper.findAll('img');
    expect(images.length).toBe(2);
  })
})
