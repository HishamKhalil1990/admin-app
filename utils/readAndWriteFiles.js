const fs = require('fs');

const getDocNo = async (empNo) => {
    try {
        const postNumber = fs.readFileSync('./docNo.txt', 'utf8');
        updateDocNo(postNumber)
        return combineNumber(postNumber,empNo)
    } catch (err) {
        console.log(err)
        const postNumber = '0'
        updateDocNo(postNumber,'./docNo.txt')
        return getDocNo('./docNo.txt',empNo)
    }
}

const updateDocNo = async (postNumber) => {
    const number = updatePostNumber(postNumber)
    try {
        fs.writeFileSync('./docNo.txt', number);
        return 'updated'
    } catch (err) {
        console.error(err);
        return 'file error'
    }
}

const combineNumber = (postNumber,empNo) => {
    return postNumber + "-" + empNo

}

const updatePostNumber = (postNumber) => {
    let no = parseInt(postNumber);
    no += 1;
    return no.toString()
}



module.exports = {
    getDocNo,
}
