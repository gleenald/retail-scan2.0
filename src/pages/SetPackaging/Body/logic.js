const jumlah_item = 50;
const jumlah_item_di_halaman_pertama = 10;
const jumlah_item_di_halaman_lain = 15
let item = [];
for (var i = 0; i < jumlah_item; i++) {
    item.push(i + 1)
}
console.log(item)


//sistem buat menentukan halaman
const jumlah_halaman = Math.floor((jumlah_item - jumlah_item_di_halaman_pertama) / jumlah_item_di_halaman_lain) + 3;
const jumlah_halaman_item = jumlah_halaman - 3

console.log(jumlah_halaman)
console.log(jumlah_halaman_item)


//sistem buat menentukan letak item
const index_item_halaman_pertama = [0, 10];
const index_awal = [10];
const index_akhir = [25];

for (var i = 0; i < jumlah_halaman_item - 1; i++) {
    index_awal.push(index_awal[i] + 15)
    index_akhir.push(index_akhir[i] + 15)
}

console.log(index_awal)


//sistem tampilan ke user
const halaman_pertama = item.slice(index_item_halaman_pertama[0], index_item_halaman_pertama[1]);

console.log(halaman_pertama)

for (var i = 0; i < jumlah_halaman_item; i++) {
    console.log(item.slice(index_awal[i], index_akhir[i]))
}

//halaman item akhir
const modulus = (jumlah_item - jumlah_item_di_halaman_pertama) % 15
console.log(item.slice(Math.max(jumlah_item - modulus, 0)))
