"use strict";
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
    fetchVitedCookie(proxy) {
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
                data = {
                    signal: controller.signal,
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
}
exports.VintedFetcher = VintedFetcher;
