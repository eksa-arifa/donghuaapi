const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const keluaran = {
    author : "EksaArifa",
    dari : "anichin",
    data : {
        ambilDonghuaTerbaru : "/terbaru",
        ambilDonghuaYangDicari : "/search/:slug",
        ambilDetailDonghua : "/detail/:slug",
        ambilStreamDonghua : "/stream/:endpoint"
    }
  }

  res.send(keluaran)
})

app.get('/terbaru', (req, res)=>{
    ambilTerbaru().then((response)=>{
        res.send(response)
    })
})

app.get('/search/:slug', (req, res)=>{
    const slug = req.params.slug

    cariDonghua(slug).then((response)=>{
        res.send(response)
    })
})

app.get('/detail/:slug', (req, res)=>{
    const slug = req.params.slug

    detailDonghua(slug).then((response)=>{
        res.send(response)
    })
})

app.get('/stream/:endpoint', (req, res)=>{
    const endpoint = req.params.endpoint

    streamDonghua(endpoint).then((response)=>{
        res.send(response)
    })
})


const ambilTerbaru = async ()=>{
    const {data} = await axios.get("https://anichin.vip/")

    const $ = cheerio.load(data)

    const bixbox = []
    const arr = []

    $('.bixbox').each((index, element)=>{
        bixbox.push($(element).html())
    })

    const oke = cheerio.load(bixbox[1])

    oke('.listupd article').each((index, element)=>{
        const judul = $(element).find('.eggtitle').text()
        const type = $(element).find('.eggtype').text()
        const eps = $(element).find('.eggepisode').text()
        let endpoint = $(element).find('a').attr('href')
        endpoint = endpoint.split("/")[3]

        arr.push({
            id : index+1,
            judul : judul,
            type : type,
            eps : eps,
            slug : endpoint
        })
    })


    const keluaran = {
        author : "EksaArifa",
        dari : "anichin.vip",
        data : {
            arr : arr
        }
    }

    return keluaran
}


const cariDonghua = async (slug)=>{
    const {data} = await axios.get(`https://anichin.vip/?s=${slug}`)

    const $ = cheerio.load(data)

    const arr = []

    $('.listupd article').each((index, element)=>{
        const judul = $(element).find('.tt h2').text()
        const type = $(element).find('.typez').text()
        const status = $(element).find('.epx').text()
        let endpoint = $(element).find('a').attr('href')
        endpoint = endpoint.split("/")[3]


        arr.push({
            id : index+1,
            judul : judul,
            type : type,
            status : status,
            slug : endpoint
        })
    })

    const keluaran = {
        author : "EksaArifa",
        dari : "anichin.vip",
        data : {
            arr : arr
        }
    }

    return keluaran
}


const detailDonghua = async (slug)=>{
    const {data} = await axios.get(`https://anichin.vip/${slug}/`)

    const $ = cheerio.load(data)

    const arr = []
    const arr2 = []
    const arr3 = []

    const judul = $('.entry-title').text()
    const thumb = $('.bigcontent').find('img').attr("src")
    const status = $('.bigcontent').find('.spe span').first().text()
    const studio = $('.bigcontent').find('.spe span:nth-child(3)').text()
    const dirilis = $('.bigcontent').find('.spe span:nth-child(4)').text()
    const tipe = $('.bigcontent').find('.spe span:nth-child(7)').text()
    const durasi = $('.bigcontent').find('.spe span:nth-child(5)').text()

    arr.push({
        judul : judul,
        thumbnail : thumb,
        status : status,
        studio : studio,
        dirilis : dirilis,
        tipe : tipe,
        durasi : durasi
    })

    $('.eplister ul li').each((index, element)=>{
        const title = $(element).find('.epl-title').text()
        const date = $(element).find('.epl-date').text()
        let endpoint = $(element).find('a').attr("href")
        endpoint = endpoint.split("/")[3]

        arr2.push({
            id : index + 1,
            title : title,
            date : date,
            endpoint : endpoint
        })
    })

    $('.genxed a').each((index, element)=>{
        const title = $(element).text()
        let endpoint = $(element).attr("href")
        endpoint = endpoint.split("/")[4]

        arr3.push({
            title : title,
            endpoint : endpoint
        })
    })


    const keluaran = {
        author : "EksaArifa",
        dari : "anichin.vip",
        data : {
            info : arr,
            genre : arr3,
            eps : arr2
        }
    }

    return keluaran
}

const streamDonghua = async (endpoint)=>{
    const {data} = await axios.get(`https://anichin.vip/${endpoint}/`)

    const $ = cheerio.load(data)


    const arr = []

    const judul = $('.entry-title').text()
    const iframe = $('.player-embed iframe').attr("src")
    const link = $('.soraddlx').html()

    arr.push({
        judul : judul,
        iframe : iframe,
        link : link
    })

    const keluaran = {
        author : "EksaArifa",
        dari : "anichin.vip",
        data : {
            arr : arr
        }
    }

    return keluaran
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})