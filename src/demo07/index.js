//         随机座位要求
// 1.共23个同学，分为五组，其中中间三组坐5个人左右个坐两组坐4人
// 2.让21号和22号一直做同桌（在两相邻组）
const stdList = [
    '曾雅萱',
    '陈亚楠',
    '代沁芯',
    '何颜西',
    '何一然',
    '贾舒斐',
    '金彤',
    '李昕怡',
    '廖元柯',
    '刘博文',
    '罗婧洋',
    '吕晨',
    '毛艺星',
    '潘奕亦',
    '蒲睿轩',
    '秦艺轩',
    '王紫嫣',
    '张庭轩',
    '张婉玲',
    '张雅雯',
    '赵雨晴',
]
const nearList = ['赵家钰', '赵宇轩']

function fun() {
    // 坐在一起的，坐在哪一列        const nearCol = randomNum(1, 5);

    const rows = document.querySelectorAll('.row')
    const rlen = rows.length
    if (rlen == 0) {
        return
    }

    // 坐在第几行
    const seatRowNum = randomNum(1, 5)
    let seatOfTow = []
    if (1 === seatRowNum) {
        seatOfTow = randomTwoNum(1, 3)
    } else {
        seatOfTow = randomTwoNum(1, 5)
    }

    const whereRowSeat = rows[seatRowNum - 1]
    const seats = whereRowSeat.querySelectorAll('.seat')
    // "赵家钰", "赵宇轩" 谁在前面
    const a = randomNum(0, 1)

    seats[seatOfTow[0] - 1].innerText = nearList[a]
    seats[seatOfTow[1] - 1].innerText = nearList[1 - a]

    const seatsAll = document.querySelectorAll('.seat')
    randomSort(stdList)
    let index = 0
    seatsAll.forEach(item => {
        if (item.innerText) {
            return
        }
        item.innerText = stdList[index]
        index++
    })
}

function clear() {
    const seatsAll = document.querySelectorAll('.seat')
    seatsAll.forEach(item => {
        item.innerText = ''
    })
}

function start() {
    clear()
    fun()
}

function exportExcel() {
    const table = document.querySelector('table')
    const style = document.querySelector('style')

    const data = `
        <html>
        <head>
        <meta charset="UTF-8">
        ${style.outerHTML}
        </head>
        <body>
        ${table.outerHTML}
        </body>
        </html>
        `

    uploadExcel(data, '未命名.xlsx')
}

function uploadExcel(_data, fileName) {
    const blob = new Blob([_data])
    const url = URL.createObjectURL(blob)
    const aLink = document.createElement('a')
    aLink.setAttribute('download', fileName)
    aLink.setAttribute('href', url)
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
    URL.revokeObjectURL(blob)
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
// 从 a，b之间选两个相邻的数
function randomTwoNum(a, b) {
    const rd = randomNum(a, b - 1)
    return [rd, rd + 1]
}
// 随机排列数组a
function randomSort(a) {
    for (let i = 0; i < a.length; i++) {
        const rd = randomNum(0, a.length - 1)
        const temp = a[i]
        a[i] = a[rd]
        a[rd] = temp
    }
}

let interval = null

window.onload = () => {
    document.querySelector('.start').addEventListener('click', () => {
        if (interval) return
        interval = setInterval(() => {
            start()
        }, 10)
    })
    document.querySelector('.end').addEventListener('click', () => {
        if (interval) {
            clearInterval(interval)
            interval = null
        }
    })
    document.querySelector('.exportExcel').addEventListener('click', () => {
        exportExcel()
    })

    start()
}
