require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: process.env.SECRET,
    database: process.env.DATABSE
})
const delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
const count = length => Array.from({ length })
const gtaSerieJ = count(3).map((_, index) => ({ numeroGta: index + 1, serieGta: 'J' }))
const gtas = async function () {
    for (const item of gtaSerieJ) {
        await delay(1000)
        const result = await axios.post('https://siapec3.adepara.pa.gov.br/siapec3/services/rest/gta/consultarGtaPorNumeroSerie/', { "numeroGta": item.numeroGta, "serieGta": item.serieGta, }).then(outPut => (outPut.data.gta))
        if (result == undefined) {
            console.log('GTA Inválida!')
        } else if (result != undefined) {
            result.map(e => {
                connection.query(`INSERT INTO gta_siape_3.gta_t 
                (nomeOrgao, idGta, nrGta, dsSerie, status, dataEmissao, dataValidade, meioTransporte, emitidoPor, escritorio, cpfCnpjProcedencia, nomeProcedencia, estabProcedencia, codEstabProcedencia, ufProcedencia, cpfCnpjDestino, nomeDestino, estabDestino, codEstabDestino, ufDestino, especie, finalidade, valorGta, valorNfe, dataAftosa1, dataAftosa2, totalAnimais, codigoBarras, tipoEmitente, horaEmissao, reimpressao, baseHomologacao, qrCode) VALUES ('${e.nomeOrgao}', '${e.idGta}', '${e.nrGta}', '${e.dsSerie}', '${e.status}', '${e.dataEmissao}', '${e.dataValidade}', '${e.meioTransporte}', '${e.emitidoPor}', '${e.escritorio}', '${e.cpfCnpjProcedencia}', '${e.nomeProcedencia}', '${e.estabProcedencia}', '${e.codEstabProcedencia}', '${e.ufProcedencia}', '${e.cpfCnpjDestino}', '${e.nomeDestino}', '${e.estabDestino}', '${e.codEstabDestino}', '${e.ufDestino}', '${e.especie}', '${e.finalidade}', '${e.valorGta}', '${e.valorNfe}', '${e.dataAftosa1}', '${e.dataAftosa2}', '${e.totalAnimais}', '${e.codigoBarras}', '${e.tipoEmitente}', '${e.horaEmissao}', '${e.reimpressao}', '${e.baseHomologacao}', '${e.qrCode}')`, function (err, returned, field) {
                        if (err) {
                            console.log(`erro:${err}`)
                        }
                        console.log(`Adicionou a GTA no banco!`)
                    })
            })
        }
    }
}
gtas()