import { getTags } from '../composables/get_tags';
import { defineStore } from 'pinia';
import { storeTag } from '../composables/store_tags';

export const useTagStore = defineStore('tags', {
    state: () => ({
        tags: [],
        pagination: {
            total: 0,
            totalPages: 0,
            hasLastPage: true,
            errorApi: false,
            loading: true,
        },
        reponseError: {
            errorData: null,
            errorMessage: null
        }
    }),
    actions: {
        async fetch(params) {
            this.pagination.loading = true
            const { load, data, hasError, totalPages, totalTags, hasLastPage } = getTags(params);
            await load();
            if(hasError.value) {
                this.pagination.errorApi = hasError.value;
                return;
            }
            this.tags = data.value
            this.pagination.totalPages = totalPages.value;
            this.pagination.total = totalTags.value;
            this.pagination.hasLastPage = hasLastPage.value;
            this.pagination.loading = false
        },
        update(tag) {
            this.tags.map(oldTag => {
                if(tag.id == oldTag.id) {
                    for(let key in tag) {
                        oldTag[key] = tag[key]
                    }
                }

                return oldTag
            })
        },
    }
});