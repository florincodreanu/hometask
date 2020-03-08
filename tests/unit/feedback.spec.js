import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue';
import infiniteScroll from "vue-infinite-scroll";

describe('totalPhotosFetched', () => {
  it('renders app__feedback when photos was fetched', async () => {
    const msg = 'fetched:15';
    const wrapper = shallowMount(App, {directives: {infiniteScroll} });
    wrapper.setData({ totalPhotosFetched: 15 });
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toMatch(msg)
  })
})
