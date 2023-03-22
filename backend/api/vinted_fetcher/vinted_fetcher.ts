const fetch = require('node-fetch');
const UserAgent = require('user-agents');
const cookie = require('cookie');
const { HttpsProxyAgent } = require('https-proxy-agent');
import { ProxyManager } from '../proxy_manager/proxy_manager'

export class VintedFetcher{
    private cookies: any = new Map();

    fetchVintedCookie(proxy?: any): any{
            return new Promise((resolve, reject) => {
                const controller = new AbortController();
                let agent, data;
                
                if(proxy){
                agent = new HttpsProxyAgent(`https://${proxy.address}:${proxy.port}`);
                console.log(` using : http://${proxy.address}:${proxy.port}`);

                data = {
                            signal: controller.signal,
                            agent,
                            headers: {
                                'user-agent': new UserAgent().toString()
                            }
                        }
                } else {
                    data = { signal: controller.signal,
                             headers: {
                                'user-agent': new UserAgent().toString()
                            }
                           }
                }

                fetch(`https://vinted.fr`, data).then((res:any) => {
                    const sessionCookie = res.headers.get('set-cookie');
                    controller.abort();
                    const c = cookie.parse(sessionCookie)['secure, _vinted_fr_session'];
                    if (c) {
                        console.log(c);
                        this.cookies.set('fr', c);
                    }
                    resolve({status: 'success', cookie:c});

                }).catch((e: Error) => {
                    controller.abort();
                    reject({status: 'failed', error:e});
                });
            });
    }

    parseVintedUrl(url:string, customParams:any={}): any{
        try {
            const decodedURL = decodeURI(url);
            const matchedParams = decodedURL.match(/^https:\/\/www\.vinted\.([a-z]+)/);
            if (!matchedParams) return {
                validURL: false
            };
    
            const missingIDsParams = ['catalog', 'status'];
            const params:any = decodedURL.match(/(?:([a-z_]+)(\[\])?=([a-zA-Z 0-9._À-ú+%]*)&?)/g);
            if (typeof matchedParams[Symbol.iterator] !== 'function') return {
                validURL: false
            };
            const mappedParams = new Map();
            for (let param of params) {
                let [ _, paramName, isArray, paramValue ] = param.match(/(?:([a-z_]+)(\[\])?=([a-zA-Z 0-9._À-ú+%]*)&?)/);
                if (paramValue?.includes(' ')) paramValue = paramValue.replace(/ /g, '+');
                if (isArray) {
                    if (missingIDsParams.includes(paramName)) paramName = `${paramName}_id`;
                    if (mappedParams.has(`${paramName}s`)) {
                        mappedParams.set(`${paramName}s`, [ ...mappedParams.get(`${paramName}s`), paramValue ]);
                    } else {
                        mappedParams.set(`${paramName}s`, [paramValue]);
                    }
                } else {
                    mappedParams.set(paramName, paramValue);
                }
            }
            for (let key of Object.keys(customParams)) {
                mappedParams.set(key, customParams[key]);
            }
            const finalParams = [];
            for (let [ key, value ] of mappedParams.entries()) {
                finalParams.push(typeof value === 'string' ? `${key}=${value}` : `${key}=${value.join(',')}`);
            }
    
            return {
                validURL: true,
                domain: matchedParams[1],
                querystring: finalParams.join('&')
            }
        } catch (e) {
            return {
                validURL: false
            }
        }
    }

    search(url:any, customParams:any = {}){
        return new Promise(async (resolve, reject) => {

            const { validURL, domain, querystring } = this.parseVintedUrl(url, customParams);
            
            if (!validURL) {
                console.log(`[!] ${url} is not valid in search!`);
                return resolve([]);
            }
    
            var c = this.cookies.get(domain) ?? process.env[`VINTED_API_${domain.toUpperCase()}_COOKIE`];
            // if (c) console.log(`[*] Using cached cookie for ${domain}`);
            if (!c) {
                // console.log(`[*] Fetching cookie for ${domain}`);
                await this.fetchVintedCookie().catch(() => {});
                c = this.cookies.get(domain) ?? process.env[`VINTED_API_${domain.toUpperCase()}_COOKIE`];
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
            }).then((res:any) => {
                res.text().then((text:any) => {
                    controller.abort();
                    try {
                        resolve(JSON.parse(text));
                    } catch (e) {
                        reject(text);
                    }
                });
            }).catch((e:any) => {
                try {
                    if (JSON.parse(e).message === `Token d'authentification invalide`) {
                        this.fetchVintedCookie();
                    }
                } catch {}
                controller.abort();
                reject('Can not fetch search API');
            });       
        });
    }
}