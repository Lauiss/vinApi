"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VintedFetcher = void 0;
const fetch = require('node-fetch');
const UserAgent = require('user-agents');
const cookie = require('cookie');
const { HttpsProxyAgent } = require('https-proxy-agent');
class VintedFetcher {
    constructor() {
        this.cookies = new Map();
    }
    fetchVintedCookie(proxy) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            let agent, data;
            if (proxy) {
                agent = new HttpsProxyAgent(`https://${proxy.address}:${proxy.port}`);
                console.log(` using : http://${proxy.address}:${proxy.port}`);
                data = {
                    signal: controller.signal,
                    agent,
                    headers: {
                        'user-agent': new UserAgent().toString()
                    }
                };
            }
            else {
                data = { signal: controller.signal,
                    headers: {
                        'user-agent': new UserAgent().toString()
                    }
                };
            }
            fetch(`https://vinted.fr`, data).then((res) => {
                const sessionCookie = res.headers.get('set-cookie');
                controller.abort();
                const c = cookie.parse(sessionCookie)['secure, _vinted_fr_session'];
                if (c) {
                    console.log(c);
                    this.cookies.set('fr', c);
                }
                resolve({ status: 'success', cookie: c });
            }).catch((e) => {
                controller.abort();
                reject({ status: 'failed', error: e });
            });
        });
    }
    parseVintedUrl(url, customParams = {}) {
        try {
            const decodedURL = decodeURI(url);
            const matchedParams = decodedURL.match(/^https:\/\/www\.vinted\.([a-z]+)/);
            if (!matchedParams)
                return {
                    validURL: false
                };
            const missingIDsParams = ['catalog', 'status'];
            const params = decodedURL.match(/(?:([a-z_]+)(\[\])?=([a-zA-Z 0-9._À-ú+%]*)&?)/g);
            if (typeof matchedParams[Symbol.iterator] !== 'function')
                return {
                    validURL: false
                };
            const mappedParams = new Map();
            for (let param of params) {
                let [_, paramName, isArray, paramValue] = param.match(/(?:([a-z_]+)(\[\])?=([a-zA-Z 0-9._À-ú+%]*)&?)/);
                if (paramValue === null || paramValue === void 0 ? void 0 : paramValue.includes(' '))
                    paramValue = paramValue.replace(/ /g, '+');
                if (isArray) {
                    if (missingIDsParams.includes(paramName))
                        paramName = `${paramName}_id`;
                    if (mappedParams.has(`${paramName}s`)) {
                        mappedParams.set(`${paramName}s`, [...mappedParams.get(`${paramName}s`), paramValue]);
                    }
                    else {
                        mappedParams.set(`${paramName}s`, [paramValue]);
                    }
                }
                else {
                    mappedParams.set(paramName, paramValue);
                }
            }
            for (let key of Object.keys(customParams)) {
                mappedParams.set(key, customParams[key]);
            }
            const finalParams = [];
            for (let [key, value] of mappedParams.entries()) {
                finalParams.push(typeof value === 'string' ? `${key}=${value}` : `${key}=${value.join(',')}`);
            }
            return {
                validURL: true,
                domain: matchedParams[1],
                querystring: finalParams.join('&')
            };
        }
        catch (e) {
            return {
                validURL: false
            };
        }
    }
    search(url, customParams = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { validURL, domain, querystring } = this.parseVintedUrl(url, customParams);
            if (!validURL) {
                console.log(`[!] ${url} is not valid in search!`);
                return resolve([]);
            }
            var c = (_a = this.cookies.get(domain)) !== null && _a !== void 0 ? _a : process.env[`VINTED_API_${domain.toUpperCase()}_COOKIE`];
            // if (c) console.log(`[*] Using cached cookie for ${domain}`);
            if (!c) {
                // console.log(`[*] Fetching cookie for ${domain}`);
                yield this.fetchVintedCookie().catch(() => { });
                c = (_b = this.cookies.get(domain)) !== null && _b !== void 0 ? _b : process.env[`VINTED_API_${domain.toUpperCase()}_COOKIE`];
            }
            const controller = new AbortController();
            fetch(`https://www.vinted.be/api/v2/catalog/items?${querystring}`, {
                signal: controller.signal,
                //agent: process.env.VINTED_API_HTTPS_PROXY ? new HttpsProxyAgent(process.env.VINTED_API_HTTPS_PROXY) : undefined,
                headers: {
                    cookie: '_vinted_fr_session=' + c,
                    'user-agent': new UserAgent().toString(),
                    accept: 'application/json, text/plain, */*'
                }
            }).then((res) => {
                res.text().then((text) => {
                    controller.abort();
                    try {
                        resolve(JSON.parse(text));
                    }
                    catch (e) {
                        reject(text);
                    }
                });
            }).catch((e) => {
                try {
                    if (JSON.parse(e).message === `Token d'authentification invalide`) {
                        this.fetchVintedCookie();
                    }
                }
                catch (_a) { }
                controller.abort();
                reject('Can not fetch search API');
            });
        }));
    }
}
exports.VintedFetcher = VintedFetcher;
