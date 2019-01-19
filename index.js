console.time("all")

/* Imports */
const axios = require('axios')
const cheerio = require('cheerio')
const Deque = require('double-ended-queue')

/* Wiki language */
const wiki = 'en'
const wikipath = 'https://' + wiki + '.wikipedia.org/wiki/' 

const parsePage = html => {
    data = []
    /* Accept only valid Wikipedia pages (no media etc.) */
    const regex = RegExp('^\/wiki\/[A-z()%0-9.-]*$')
    const $ = cheerio.load(html)
    $('a').each((i, elem) => {
        data.push($(elem).attr('href'))
    })
    return data.filter((element) => {
        return regex.test(element) === true
    }) 
    .map(page => page.replace('/wiki/',''))
}

const getLinks = (page) => {

    return new Promise((resolve, reject) => {
        
        axios.get(wikipath + page)
        .then(response => {
            const ls =  parsePage(response.data)
            resolve(ls)
        })
    })
}

const first = encodeURI('Finland')
const final = encodeURI('Canada')

console.log("first: " , first)
console.log("final: " , final , "\n")

path = {}
path[first] = [first]

/* Double ended queue, fast append and pop on either end, slow splice */
let Q = new Deque([first])

async function test() {
    let cont = true
    while (cont) {
        if (!Q.isEmpty()){
            page = Q.shift()
            console.log( "page " , page)
            const links = await getLinks(page)
            links.forEach(link => {
                if (link.toLowerCase() == final.toLowerCase()) {
                    console.log("\n\nPath: ", path[page].join(" -> ") + " -> ", link + "\n")
                    cont = false
                    console.timeEnd("all")
                    return
                }
                else if (!path[link] && link != page) {
                    path[link] = [path[page] , [link]]
                    Q.push(link)
                }
            });
        }
    }
}

test()
