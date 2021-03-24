function calcular() {
    var pmt = document.getElementById("PMT").value
    var i = document.getElementById("i").value
    var n = document.getElementById("n").value
    var pv = document.getElementById("PV").value
    var taxa = document.getElementsByName("rbTaxa");
    var periodo = document.getElementsByName("rbPeriodo");
    if (taxa[0].checked) {
        //var i = i / 12.0;
        var i = ((Math.pow((1 + (i / 100)), (1 / 12))) - 1) * 100
    }
    if (periodo[0].checked) {
        var n = n * 12.0;
    }
    var fv = FV(pmt, i, n, pv);
    resultado = fv.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    console.log(resultado)
    document.getElementById("resposta").value = resultado;
}
function FV(PMT, i, n, PV) {
    var i = i / 100
    return ((PV * (Math.pow(1 + i, n)))) + ((PMT * (Math.pow(1 + i, n) - 1)) / i)
}


