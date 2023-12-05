import * as _ from './lib/lodash'
import ExcelJS from './lib/exceljs'
import Big from './lib/big'

function lis() {
    var dropzone = document.getElementById('dropzone');
    var fileInput = document.getElementById('file-input');

    // 阻止浏览器默认的拖拽行为
    dropzone.addEventListener('dragenter', function (e) {
        e.preventDefault();
    });

    dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        var files = e.dataTransfer.files;

        // 处理上传的文件
        handleFiles(files);
    });

    dropzone.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        var files = fileInput.files;

        // 处理上传的文件
        handleFiles(files);
    });
}

lis()

function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        // 这里可以执行上传文件的操作，例如使用AJAX将文件发送到服务器

        // 输出文件信息
        console.log('文件名:', file.name);
        console.log('文件大小:', file.size);
        console.log('文件类型:', file.type);

        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
            fun(data)

            /* DO SOMETHING WITH workbook HERE */
        };
        reader.readAsArrayBuffer(file);
    }
}

async function fun(buffer) {

    const wb2 = new ExcelJS.Workbook();
    const ws2_1 = wb2.addWorksheet('1关键词分析')
    const ws2_2 = wb2.addWorksheet('2词根分析')
    ws2_1.columns = [
        {header: '行标签', key: '行标签'},
        {header: '求和:展现量', key: '求和:展现量'},
        {header: '求和:点击量', key: '求和:点击量'},
        {header: '求和:费用', key: '求和:费用'},
        {header: '求和:订单数', key: '求和:订单数'},
        {header: '求和:销售额', key: '求和:销售额'},
        {header: '计算:客单价', key: '计算:客单价'},
        {header: '计算:CPC', key: '计算:CPC'},
        {header: '计算:点击率', key: '计算:点击率'},
        {header: '计算:转化率', key: '计算:转化率'},
        {header: '计算:ACOS', key: '计算:ACOS'},
    ]

    // 属性	词频	求和:展现量	求和:点击量	求和:费用	求和:订单数	求和:销售额	客单价	CPC	计算:点击率[1%]	计算:转化率[15%,5%]	"计算:ACOS
    // [20%,40%]"	属性标识
    ws2_2.columns = [
        {header: '属性', key: '属性'},
        {header: '词频', key: '词频'},
        {header: '求和:展现量', key: '求和:展现量'},
        {header: '求和:点击量', key: '求和:点击量'},
        {header: '求和:费用', key: '求和:费用'},
        {header: '求和:订单数', key: '求和:订单数'},
        {header: '求和:销售额', key: '求和:销售额'},
        {header: '客单价', key: '客单价'},
        {header: 'CPC', key: 'CPC'},
        {header: '计算:点击率', key: '计算:点击率'},
        {header: '计算:转化率', key: '计算:转化率'},
        {header: '计算:ACOS', key: '计算:ACOS'},
        {header: '属性标识', key: '属性标识'},
    ]

    console.log(ws2_1)


    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet1 = workbook.getWorksheet('原始数据')

    let map1 = {}
    let map2 = {}

    // 关键词分析
    sheet1.eachRow((row, rowNumber) => {

        if (rowNumber === 1) return

        let text = row.getCell('H').text
        if (!text) return

        let value = {
            '展现量': row.getCell('I').text,
            '点击量': row.getCell('J').text,
            '点击率': row.getCell('K').text,
            '每次点击成本(CPC)': row.getCell('L').text,
            '花费': row.getCell('M').text,
            '总销售额': row.getCell('N').text,
            '广告成本销售比(ACoS)': row.getCell('O').text,
            '投入产出比(RoAS)': row.getCell('P').text,
            '总订单数': row.getCell('Q').text,
        }

        if (text in map1) {
            map1[text].push(value)
        } else {
            let list = []
            list.push(value)
            map1[text] = list
        }

        let textList = text.split(' ')

        textList.forEach(item => {
            if (item in map2) {
                map2[item].push(value)
            } else {
                let list = []
                list.push(value)
                map2[item] = list
            }
        })
    })


    for (let map1Key in map1) {
        // 展现量
        let zxl = new Big(0)
        // 点击量
        let djl = new Big(0)
        // 费用
        let fy = new Big(0)
        // 订单数
        let dds = new Big(0)
        // 销售额
        let xse = new Big(0)

        map1[map1Key].forEach(item => {

            zxl = zxl.plus(isNumber(item['展现量']) ? item['展现量'] : 0)
            djl = djl.plus(isNumber(item['点击量']) ? item['点击量'] : 0)
            fy = fy.plus(isNumber(item['花费']) ? item['花费'] : 0)
            dds = dds.plus(isNumber(item['总订单数']) ? item['总订单数'] : 0)
            xse = xse.plus(isNumber(item['总销售额']) ? item['总销售额'] : 0)
        })

        // 客单价
        let kdj = new Big(0)
        // CPC
        let cpc = new Big(0)
        // 点击率
        let djlv = new Big(0)
        // 转化率
        let zhl = new Big(0)
        // ACOS
        let acos = new Big(0)

        try {

            if (Big(0).lt(dds)) {

                kdj = xse.div(dds)
            }
            if (Big(0).lt(djl)) {

                cpc = fy.div(djl)
            }
            if (Big(0).lt(zxl)) {

                djlv = djl.div(zxl)
            }
            if (Big(0).lt(djl)) {

                zhl = dds.div(djl)
            }
            if (Big(0).lt(xse)) {

                acos = fy.div(xse)
            }
        } catch (e) {
            console.log(e)
        }

        let rowData = {
            '行标签': map1Key,
            '求和:展现量': zxl.toString(),
            '求和:点击量': djl.toString(),
            '求和:费用': fy.toString(),
            '求和:订单数': dds.toString(),
            '求和:销售额': xse.toString(),
            '计算:客单价': kdj.toString(),
            '计算:CPC': cpc.toString(),
            '计算:点击率': djlv.toString(),
            '计算:转化率': zhl.toString(),
            '计算:ACOS': acos.toString(),
        }

        ws2_1.addRow(rowData)
    }

    for (let map2Key in map2) {
        // 词频
        let cp = map2[map2Key].length
        // 求和：展现量
        let zxl = new Big(0)
        // 求和：点击量
        let djl = new Big(0)
        // 求和：费用
        let fy = new Big(0)
        // 求和：订单数
        let dds = new Big(0)
        // 求和：销售额
        let xse = new Big(0)
        // 客单价
        let kdj = new Big(0)
        // CPC
        let cpc = new Big(0)
        // 点击率
        let djlv = new Big(0)
        // 转化率
        let zhl = new Big(0)
        // ACOS
        let acos = new Big(0)

        map2[map2Key].forEach(item => {
            zxl = zxl.plus(isNumber(item['展现量']) ? item['展现量'] : 0)
            djl = djl.plus(isNumber(item['点击量']) ? item['点击量'] : 0)
            fy = fy.plus(isNumber(item['花费']) ? item['花费'] : 0)
            dds = dds.plus(isNumber(item['总订单数']) ? item['总订单数'] : 0)
            xse = xse.plus(isNumber(item['总销售额']) ? item['总销售额'] : 0)
        })

        try {
            if (Big(0).lt(dds)) {

                kdj = xse.div(dds)
            }
            if (Big(0).lt(djl)) {

                cpc = fy.div(djl)
            }
            if (Big(0).lt(zxl)) {

                djlv = djl.div(zxl)
            }
            if (Big(0).lt(djl)) {

                zhl = dds.div(djl)
            }
            if (Big(0).lt(xse)) {

                acos = fy.div(xse)
            }
        } catch (e) {
            console.log(e)
        }

        let rowData = {
            '属性': map2Key,
            '词频': cp,
            '求和:展现量': zxl.toString(),
            '求和:点击量': djl.toString(),
            '求和:费用': fy.toString(),
            '求和:订单数': dds.toString(),
            '求和:销售额': xse.toString(),
            '客单价': kdj.toString(),
            'CPC': cpc.toString(),
            '计算:点击率': djlv.toString(),
            '计算:转化率': zhl.toString(),
            '计算:ACOS': acos.toString(),
        }

        ws2_2.addRow(rowData)

    }


    function copyWorkSheet() {
        // 获取要复制的源工作表
        const sourceWorksheet = sheet1

        // 创建一个新的目标工作表
        const targetWorksheet = wb2.addWorksheet('原始数据');

        // sourceWorksheet.eachRow((row, rowNumber) => {
        //     // const newRow = targetWorksheet.getRow(rowNumber);
        //     // newRow.height = row.height;
        //
        //     targetWorksheet.addRow(row.values)
        //
        //
        //     // row.eachCell((cell, colNumber) => {
        //     //     const newCell = newRow.getCell(colNumber);
        //     //     newCell.value = cell.value;
        //     //     newCell.style = cell.style;
        //     //     targetWorksheet.addCell
        //     // });
        // });

        sourceWorksheet.eachRow((row, rowNumber) => {
            const targetRow = targetWorksheet.getRow(rowNumber);
            row.eachCell((cell, colNumber) => {
                const targetCell = targetRow.getCell(colNumber);
                targetCell.value = cell.value;
                targetCell.style = cell.style;
            });
        });

    }

    copyWorkSheet()


    const buffers = await wb2.xlsx.writeBuffer('test')

    uploadExcel('text', buffers)
}

function isNumber(v) {

    const reg = /^[0-9]+.?[0-9]*$/;
    return reg.test(v);
}

function downloadFromUrl(url, fileName) {
    const aLink = document.createElement('a')
    aLink.setAttribute('download', fileName)
    aLink.setAttribute('href', url)
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
}

function uploadExcel(fileName, _data) {
    const blob = new Blob([_data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    })
    const url = URL.createObjectURL(blob)
    downloadFromUrl(url, fileName)
    URL.revokeObjectURL(blob)
}
