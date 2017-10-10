/**
 * Created by Tony on 14/06/2017.
 */
// import Vue from 'vue'
import axios from 'axios';

const httpUtil =
    {
        fetch: axios,
        cleanArray: function (actual) {
            const newArray = [];
            for (let i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }
            return newArray;
        },
        createRequestOption: function (params) {
            if (!params || params === 'undefined' || params === undefined) return '';
            return this.cleanArray(Object.keys(params).map(key => {
                if (!params[key] || params[key] === undefined || params[key] === 'undefined') return '';
                if (key === 'page') {
                    return encodeURIComponent(key) + '=' +
                        encodeURIComponent(params[key] - 1);
                }
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key]);
            })).join('&');
        },
        createQueryOption: function (params) {
            if (!params) {
                return ''
            }
            let options = '?';

            let {page, size, sortWay} = params;

            if (page && size) {
                page--;
                options = options + 'page=' + parseInt(page, 10) + '&size=' + parseInt(size, 10);
            }

            let sort = null;
            if (sortWay) {
                let {prop, order} = sortWay;

                if (prop) {
                    if (order === 'descending') {
                        order = 'desc';
                    } else {
                        order = 'asc';
                    }
                    sort = prop + ',' + order;
                }
            }
            if (sort) {
                options = options + '&sort=' + sort;
            }
            return options;
        },
        createSearchOption: function (params) {
            let options = '?';

            let {page, size, sortWay} = params;

            if (page && size) {
                page--;
                options = options + 'page=' + parseInt(page, 10) + '&size=' + parseInt(size, 10);
            }

            let sort = null;
            if (sortWay) {
                let {prop, order} = sortWay;

                if (prop) {
                    if (order === 'descending') {
                        order = 'desc';
                    } else {
                        order = 'asc';
                    }
                    sort = prop + ',' + order;
                }
            }
            if (sort) {
                options = options + '&sort=' + sort;
            }
            return options;
        }
    };

export default httpUtil;
