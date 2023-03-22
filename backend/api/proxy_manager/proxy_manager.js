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
exports.ProxyManager = void 0;
const fetch = require('node-fetch');
const cheerio = require('cheerio');
class ProxyManager {
    constructor() {
        this.proxies = [];
        this.proxiesTabLength = 0;
    }
    initAddrAndPort() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('https://sslproxies.org/');
            const html = yield response.text();
            this.parseHtml(html);
        });
    }
    getRandomProxy(lastProxy) {
        let proxy = this.proxies[Math.floor(Math.random() * this.proxiesTabLength)];
        while (this.proxies[Math.floor(Math.random() * this.proxiesTabLength)] == lastProxy) {
            this.proxies[Math.floor(Math.random() * this.proxiesTabLength)];
        }
        return proxy;
    }
    parseHtml(html) {
        let ips = [];
        let ports = [];
        let country = [];
        const $ = cheerio.load(html);
        $("td:nth-child(1)").each(function (index, value) {
            ips[index] = $(value).text();
        });
        $("td:nth-child(2)").each(function (index, value) {
            ports[index] = $(value).text();
        });
        $("td:nth-child(3)").each(function (index, value) {
            country[index] = $(value).text();
        });
        ips.join(", ");
        ports.join(", ");
        country.join(", ");
        this.fillProxiesTab(ips, ports, country);
    }
    fillProxiesTab(ips, ports, country) {
        for (let i = 0; i < ips.length; ++i) {
            let regExpAlpha = /[a-zA-Z]/g;
            let regExpExtra = /-/g;
            if (!regExpExtra.test(ips[i]) && !regExpAlpha.test(ips[i])) {
                if (country[i] == 'FR' || country[i] == 'DE') {
                    let proxy = { address: ips[i], port: ports[i] };
                    this.proxies.push(proxy);
                }
            }
        }
        this.proxiesTabLength = this.proxies.length;
    }
    getProxies() {
        return this.proxies;
    }
}
exports.ProxyManager = ProxyManager;
