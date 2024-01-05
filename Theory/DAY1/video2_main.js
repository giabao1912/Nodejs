function luy_thua(a,n) {
    let kq = 1;
    for (let i = 1; i <= n; i++) {
        kq *= a;
    }
    return kq;
}
console.log(luy_thua(3,2))