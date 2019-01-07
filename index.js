const type = process.argv[2]
const category = process.argv[3]
const key = process.argv[4]
const https = require('https')
const path = require('path')

const { join } = path
let content = ''
let result_array = []

const options = {
    'juejin': [{
            host: 'timeline-merger-ms.juejin.im',
            path: '/v1/get_entry_by_rank?src=web&limit=50&category=all'
        },
        {
            host: 'timeline-merger-ms.juejin.im',
            path: '/v1/get_entry_by_rank?src=web&limit=50&category=5562b415e4b00c57d9b94ac8',
            remark: '前端'
        },
        {
            host: 'timeline-merger-ms.juejin.im',
            path: '/v1/get_entry_by_rank?src=web&limit=50&category=5562b419e4b00c57d9b94ae2',
            remark: '后端'
        },
    ]
} [type][category]

function getData(handleDataFn) {
    https.get(options, (res) => {
        res.on('data', (chunk) => {
            content += chunk
        }).on('end', () => {
            const jsonContent = JSON.parse(content)
            handleDataFn(jsonContent)
        })
    })
}

function showItem(resultArray) {
    content = ''
    result_array = []
    console.log(JSON.stringify({
        items: resultArray
    }))
}

if (type === 'juejin') {
    getData((jsonContent) => {
        const result = jsonContent.d.entrylist
        for (let i = 0; i < result.length; i++) {
            if (result[i].user.jobTitle === '') {
                result_array.push({
                    title: result[i].title,
                    subtitle: `点赞数${result[i].collectionCount} 评论数${result[i].commentsCount} 作者: ${result[i].user.username}`,
                    arg: result[i].originalUrl,
                    icon: {
                        path: join(__dirname, '/icon_juejin.png'),
                    },
                    mods: {
                        cmd: {
                            arg: result[i].originalUrl,
                            subtitle: result[i].content
                        }
                    }
                })
            } else {
                result_array.push({
                    title: result[i].title,
                    subtitle: `点赞数${result[i].collectionCount} 评论数${result[i].commentsCount} 作者: ${result[i].user.username}(${result[i].user.jobTitle})`,
                    arg: result[i].originalUrl,
                    icon: {
                        path: join(__dirname, '/icon_juejin.png'),
                    },
                    mods: {
                        cmd: {
                            arg: result[i].originalUrl,
                            subtitle: result[i].content
                        }
                    }
                })
            }
        }
        showItem(result_array)
    })
}