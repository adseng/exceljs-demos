const List35 = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35',
]

const List12 = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12'
]

const List33 = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33'
]

const List16 = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16'
]
console.log('sssaaa')
function selected(c1, c2) {
    const haomaList = document.querySelectorAll(c1);
    haomaList.forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation()
            this.classList.toggle(c2);
        })
    })
}

function unselected(c1, c2, c3) {
    const click = document.querySelector(c2)
    const haomaList = document.querySelectorAll(c1);
    click.addEventListener('click', function (e) {
        e.stopPropagation()
        haomaList.forEach(item => {
            item.classList.remove(c3);
        })
    })
}

// 大乐透

// 红区选中效果
selected('.box1 .haoma1', 'haoma11')
// 红区杀号 一键重置
unselected('.box1 .haoma1', '.box1 .click4', 'haoma11')
// 蓝区选中效果
selected('.box1 .haoma2', 'haoma21')
// 蓝区杀号 一键重置
unselected('.box1 .haoma2', '.box1 .click5', 'haoma21')

// 双色球

// 红区选中效果
selected('.box2 .haoma1', 'haoma11')
// 红区杀号 一键重置
unselected('.box2 .haoma1', '.box2 .click4', 'haoma11')
// 蓝区选中效果
selected('.box2 .haoma2', 'haoma21')
// 蓝区杀号 一键重置
unselected('.box2 .haoma2', '.box2 .click5', 'haoma21')


// 点击开始选号

function reset(clickClass, shDomsClass, num1ListClass, allNums, numGroupClass) {
    // 红区点击重选
    const click2 = document.querySelector(clickClass)
    click2.addEventListener('click', function (e) {
        e.stopPropagation()

        // 获取红色杀号区号码
        const sh = []
        const shDoms = document.querySelectorAll(shDomsClass)
        shDoms.forEach(item => {
            sh.push(item.innerText)
        })

        // 获取待插入dom,遍历然后插入
        const group = document.querySelectorAll(numGroupClass)

        // let a = []
        //
        // group.forEach(item => {
        //     const num1List = item.querySelectorAll(num1ListClass)
        //     const createdNums = createNums(allNums, sh, num1List.length)
        //     a.push(createdNums)
        // })
        //
        // a.sort((a, b) => {
        //     return a.join('') - b.join('')
        // })

        group.forEach((item, index) => {
            const num1List = item.querySelectorAll(num1ListClass)
            console.log('num1List', num1List.length)

            const createdNums = createNums(allNums, sh, num1List.length).sort((a, b) => {
                return Number(a) - Number(b)
            })

            num1List.forEach((item2, index2) => {
                item2.innerText = createdNums[index2]
            })
        })


    })
}

// 红区点击重选
reset('.box1 .click2', '.box1 .haoma11', '.box1 .num1', List35, '.box1 .numGroup')
// 蓝区点击重选
reset('.box1 .click3', '.box1 .haoma21', '.box1 .num2', List12, '.box1 .numGroup')

// 双色球
// 红区点击重选
reset('.box2 .click2', '.box2 .haoma11', '.box2 .num1', List33, '.box2 .numGroup')
// 蓝区点击重选
reset('.box2 .click3', '.box2 .haoma21', '.box2 .num2', List16, '.box2 .numGroup')


// 点击开始选号

function resetAll(c1, c2, c3) {
    const el = document.querySelector(c1)
    el.addEventListener('click', function (e) {
        e.stopPropagation()
        document.querySelector(c2).click()
        document.querySelector(c3).click()
    })
}

resetAll('.box1 .click1', '.box1 .click2', '.box1 .click3')
resetAll('.box2 .click1', '.box2 .click2', '.box2 .click3')


function clearNum(className) {
    const numList = document.querySelectorAll(className)
    numList.forEach(item => {
        item.innerText = ''
    })
}

// 一键号码清空
function clearAll(clickClassName, clearClassName1, clearClassName2) {
    document.querySelector(clickClassName).addEventListener('click', function (e) {
        e.stopPropagation()
        clearNum(clearClassName1)
        clearNum(clearClassName2)
    })
}

clearAll('.box1 .click6', '.box1 .num1', '.box1 .num2')
clearAll('.box2 .click6', '.box2 .num1', '.box2 .num2')


/**
 *
 * @param a 选号区
 * @param b 杀号区选择了几个
 * @param n 选几个
 */
function createNums(a, b, n) {
    const result = []
    const aLen = a.length - 1
    let j = 0
    for (let i = 0; i < n;) {
        const randomNum1 = randomNum(0, aLen)
        if (!b.includes(a[randomNum1]) && !result.includes(a[randomNum1])) {
            result.push(a[randomNum1])
            i++
        }
        j++
        if (j > 1000) {
            alert('生成号码失败')
            throw new Error('生成号码失败')
        }
    }

    return result
}

// let test = []
// for (let i = 0; i < 100; i++) {
//     test.push(randomNum(0, 35))
// }
//
// console.log(test)


// [min, max], 左右包括，随机一个整数
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
