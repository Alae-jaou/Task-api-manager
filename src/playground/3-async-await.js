const add = (a , b) => {
    return new Promise((resolve , reject) => {
        if (a * b < 0) {
            return reject('a or b is negative');
        }
        setTimeout(() => {
            resolve(a + b)
        }, 2000);
    })
}

const doWork = async () => {
    const sum = await add(1,1);
    return await add(sum , 1);
    // return sum2;
}

doWork().then((res) => {
    console.log('result : ' , res)
}).catch((e)=> {
    console.log(e)
})