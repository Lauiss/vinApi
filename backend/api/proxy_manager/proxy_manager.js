import fetch from 'node-fetch';
import cheerio from 'cheerio';
//const cheerio = require('cheerio');

export class ProxyManager {
    proxies = [];
    proxiesTabLength = 0;

    async initAddrAndPort(){
        const response = await fetch('https://sslproxies.org/');
        const html = await response.text();
        this.parseHtml(html);
    }

    getRandomProxy(lastProxy=null){
        let proxy = this.proxies[Math.floor(Math.random() * this.proxiesTabLength)];
        while(this.proxies[Math.floor(Math.random() * this.proxiesTabLength)] == lastProxy){
            this.proxies[Math.floor(Math.random() * this.proxiesTabLength)];
        }
        return proxy;
    }

    parseHtml(html){
        let ips = [];
        let ports = [];
        let country = []
        const $ = cheerio.load(html);

        $("td:nth-child(1)").each(function(index, value) {
            ips[index] = $(value).text();
        });

        $("td:nth-child(2)").each(function(index, value) {
            ports[index] = $(value).text();
        });

        $("td:nth-child(3)").each(function(index, value) {
            country[index] = $(value).text();
        });


        ips.join(", ");
        ports.join(", ");
        country.join(", ")

        this.fillProxiesTab(ips,ports,country);
    }

    fillProxiesTab(ips,ports,country){
        for(let i=0; i<ips.length;++i){
            let regExpAlpha = /[a-zA-Z]/g 
            let regExpExtra = /-/g ;
            if(!regExpExtra.test(ips[i]) && !regExpAlpha.test(ips[i])){
                if(country[i] == 'FR' || country[i] == 'DE'){
                    let proxy = {address: ips[i], port: ports[i]};
                    this.proxies.push(proxy);
                }
            }
        }

        this.proxiesTabLength = this.proxies.length;
    }

    getProxies(){
        return this.proxies;
    }
    
}