// ==========================================
// CORE ENGINE: OTOMATISASI NARASI & TATA LETAK
// ==========================================
function updateSemuanya() {
    let hari = document.getElementById('inHari').value;
    let tanggalAsli = document.getElementById('inTanggal').value;
    
    let umum = document.getElementById('inUmum').value.toLowerCase();
    let intensitas = document.getElementById('inHujan').value;
    
    let cPagi = document.getElementById('inCuacaPagi').value.replace(/_/g, ' ').replace(' Malam', '').toLowerCase();
    let cSiang = document.getElementById('inCuacaSiang').value.replace(/_/g, ' ').replace(' Malam', '').toLowerCase();
    let cMalam = document.getElementById('inCuacaMalam').value.replace(/_/g, ' ').replace(' Malam', '').toLowerCase();
    let cDini = document.getElementById('inCuacaDiniHari').value.replace(/_/g, ' ').replace(' Malam', '').toLowerCase();
    
    let sMin = document.getElementById('inSuhuMin').value;
    let sMax = document.getElementById('inSuhuMax').value;
    let lMin = document.getElementById('inLembapMin').value;
    let lMax = document.getElementById('inLembapMax').value;
    let aDari = document.getElementById('inAnginDari').value;
    let aKe = document.getElementById('inAnginMenuju').value;
    let aSpeed = document.getElementById('inAnginSpeed').value;
    let peringatan = document.getElementById('inPeringatan').value;


    // UPDATE TANGGAL GLOBAL (HURUF BESAR SEMUA UNTUK JUDUL)
    let teksTanggal = "BERLAKU UNTUK " + tanggalAsli.toUpperCase();
    document.getElementById('outTanggal2').innerText = teksTanggal;
    document.getElementById('outTanggal3').innerText = teksTanggal;


    // UPDATE SLIDE 2 (DATA INFOGRAFIS)
    document.getElementById('outSuhu').innerText = `${sMin} - ${sMax}°`;
    document.getElementById('outLembap').innerText = `${lMin} - ${lMax}%`;
    document.getElementById('outAngin').innerHTML = `${aDari.toUpperCase()} - ${aKe.toUpperCase()}<br>${aSpeed} KM/JAM`;
    document.getElementById('outPeringatan').innerText = peringatan.toUpperCase();


    // FORMAT TANGGAL UNTUK NARASI (Bulan ditulis biasa/kapital awal saja)
    let tanggalNarasi = tanggalAsli.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

    let teksHujan = "";
    if (intensitas !== "") {
        teksHujan = ` hingga terdapat hujan dengan intensitas ${intensitas}`;
    }
    
    // GENERATE NARASI
    let narasi1 = `Kondisi cuaca untuk wilayah Tanah Merah dan sekitarnya pada ${hari}, ${tanggalNarasi} diperkirakan umumnya ${umum}${teksHujan}, dengan detil waktu prakiraan kondisi cuaca sebagai berikut: Pada Pagi hari kondisi cuaca diprakirakan ${cPagi}, Kemudian pada siang hari cuaca diprakirakan ${cSiang}. Selanjutnya untuk malam hari cuaca diprakirakan ${cMalam} dan untuk dini hari cuaca diprakirakan ${cDini}.`;
    let narasi2 = `Adapun beberapa parameter cuaca untuk hari ini diprakirakan sebagai berikut: Pertama untuk suhu udara berkisar dari ${sMin} hingga ${sMax} derajat Celsius, kemudian kelembaban udara berkisar ${lMin} hingga ${lMax} persen, serta untuk arah angin diprakirakan bergerak dominan dari arah ${aDari} menuju ${aKe} dengan kecepatan mencapai ${aSpeed} Kilo meter per jam.\nPeringatan Dini: ${peringatan}`;
    
    document.getElementById('inNarasi1').value = narasi1;
    document.getElementById('outNarasi1').innerText = narasi1;
    document.getElementById('inNarasi2').value = narasi2;
    document.getElementById('outNarasi2').innerText = narasi2;
}

function updateIkon(inputId, iconId, textId) {
    const value = document.getElementById(inputId).value; 
    document.getElementById(iconId).src = value + ".png";
    let teksTampil = value.replace(/_/g, ' ').replace(' Malam', '');
    document.getElementById(textId).innerText = teksTampil.toUpperCase();
}

document.getElementById('inNarasi1').addEventListener('input', function(e) { document.getElementById('outNarasi1').innerText = e.target.value; });
document.getElementById('inNarasi2').addEventListener('input', function(e) { document.getElementById('outNarasi2').innerText = e.target.value; });

const daftarInput = ['inHari', 'inTanggal', 'inUmum', 'inHujan', 'inCuacaPagi', 'inCuacaSiang', 'inCuacaMalam', 'inCuacaDiniHari', 'inSuhuMin', 'inSuhuMax', 'inLembapMin', 'inLembapMax', 'inAnginDari', 'inAnginMenuju', 'inAnginSpeed', 'inPeringatan'];

daftarInput.forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        updateSemuanya();
        if(id.startsWith('inCuaca')) {
            if(id === 'inCuacaPagi') updateIkon('inCuacaPagi', 'iconPagi', 'teksPagi');
            if(id === 'inCuacaSiang') updateIkon('inCuacaSiang', 'iconSiang', 'teksSiang');
            if(id === 'inCuacaMalam') updateIkon('inCuacaMalam', 'iconMalam', 'teksMalam');
            if(id === 'inCuacaDiniHari') updateIkon('inCuacaDiniHari', 'iconDiniHari', 'teksDiniHari');
        }
    });
});

window.addEventListener('load', function() {
    updateSemuanya();
    updateIkon('inCuacaPagi', 'iconPagi', 'teksPagi');
    updateIkon('inCuacaSiang', 'iconSiang', 'teksSiang');
    updateIkon('inCuacaMalam', 'iconMalam', 'teksMalam');
    updateIkon('inCuacaDiniHari', 'iconDiniHari', 'teksDiniHari');
});


// ==========================================
// FITUR DOWNLOAD HD ANTI-BURAM & ANTI-GEPENG
// ==========================================
const canvasOptions = {
    scale: 4, // KUNCI ANTI-BURAM: Di-render 4x lipat lebih besar dari layar asli
    useCORS: true, 
    allowTaint: true,
    scrollY: 0,
    backgroundColor: null 
};

document.getElementById('btnDownloadGambar').addEventListener('click', async function() {
    const btn = this;
    const teksAsli = btn.innerText;
    btn.innerText = "Memproses Gambar HD...";
    btn.disabled = true;

    // Paksa layar ke atas agar hasil crop presisi
    window.scrollTo(0, 0); 
    await document.fonts.ready; 

    const captureArea = document.getElementById('slide2');
    
    html2canvas(captureArea, canvasOptions).then(canvas => {
        const link = document.createElement('a');
        link.download = `Infografis_Cuaca_HD.png`; 
        link.href = canvas.toDataURL("image/png", 1.0); 
        link.click();

        btn.innerText = teksAsli;
        btn.disabled = false;
    });
});

document.getElementById('btnDownloadPDF').addEventListener('click', async function() {
    const btn = this;
    const teksAsli = btn.innerText;
    btn.innerText = "Membuat PDF HD...";
    btn.disabled = true;

    window.scrollTo(0, 0); 
    await document.fonts.ready; 

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'px', [800, 800]); 
    const slides = ['slide1', 'slide2', 'slide3', 'slide4'];

    for (let i = 0; i < slides.length; i++) {
        const captureArea = document.getElementById(slides[i]);
        const canvas = await html2canvas(captureArea, canvasOptions); 
        const imgData = canvas.toDataURL('image/png', 1.0); 
        
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 800);
        if (i < slides.length - 1) {
            pdf.addPage();
        }
    }

    pdf.save("Prakiraan_Cuaca_Harian.pdf");
    btn.innerText = teksAsli;
    btn.disabled = false;
});