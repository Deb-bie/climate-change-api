// declaring the port
const PORT = process.env.PORT ||8000

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')


// calling express and putting 
const app = express()

// creating an array of pages to be scrapped
const newspapers = [
    {
        name: 'thetimes',
        urls: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },

    {
        name: 'guardian',
        urls: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
 
    {
        name: 'telegraph',
        urls: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },
]


const articles = []


// looping through the newspaper array using axios

newspapers.forEach(newspaper => {
    axios.get(newspaper.urls )
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        // loooking for a tags that contain climate cclimate change
        $('a:contains("climate")', html).each(function () {

            // taking the text out of the data
                const title = $(this).text()
                const url = $(this).attr('href')

            //  putting them into an array
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            }) 

        })
    })

})



// welcome.... should be displayed when you go to this '/' page
// app.get('/', (req ,res) => { 
//     res.json("Welcome to my Climate change api")
// })


app.get('/', (req, res) => {
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    // .then((response) => {           //promise
    //     const html = response.data

    //     // picking the elements
    //     const $ = cheerio.load(html)

    //     // loooking for a tags that contain climate cclimate change
    //     $('a:contains("climate")', html).each(function () {

    //         // taking the text out of the data
    //          const title = $(this).text()
    //          const url = $(this).attr('href')

    //         //  putting them into an array
    //         articles.push({
    //             title,
    //             url
    //         }) 
    //     })

        res.json(articles)
})

app.get('/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId

    // if the newspaper matches the newspaperId , we go inside to get the url
    const newspaperURL = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].urls

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base



    axios.get(newspaperURL)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId 
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))  
 
    console.log(newspaperURL)
})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))







