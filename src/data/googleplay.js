import DataLoader from 'dataloader';
import { host } from '../config';
import fetch from '../core/fetch';

const BASE_URL = `http://${host}/googlestore/apps`;

function getApps(page) {
  return fetch(`${BASE_URL}?start=${page * 60}`)
    .then(res => res.json())
    .then(data => data.results);
}

function getApp(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => res.json());
}

const cacheMap = new Map();

const appLoader =
  new DataLoader(keys => Promise.all(keys.map(getApp)), {
    cacheKeyFn: key => `/googlestore/app/${key}/`,
    cacheMap,
  });

const appsLoader =
  new DataLoader(keys => Promise.all(keys.map(getApps)), {
    cacheKeyFn: key => `/googlestore/apps/${key}/`,
    cacheMap,
  });

appLoader.loadAll = appsLoader.load.bind(appsLoader);

const googleplay = {
  app: appLoader,
};

export default googleplay;
